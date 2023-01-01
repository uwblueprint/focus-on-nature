import Stripe from "stripe";
import mongoose from "mongoose";
import ICamperService from "../interfaces/camperService";
import MgCamper, { Camper } from "../../models/camper.model";
import MgWaitlistedCamper, {
  WaitlistedCamper,
} from "../../models/waitlistedCamper.model";
import MgCampSession, { CampSession } from "../../models/campSession.model";
import MgCamp, { Camp } from "../../models/camp.model";
import {
  CreateCampersDTO,
  CamperDTO,
  CreateWaitlistedCamperDTO,
  WaitlistedCamperDTO,
  UpdateCamperDTO,
  CamperCharges,
  CampRegistrationDTO,
} from "../../types";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import IEmailService from "../interfaces/emailService";
import nodemailerConfig from "../../nodemailer.config";
import EmailService from "./emailService";
import {
  createStripeCheckoutSession,
  createStripeLineItems,
  retrieveStripeCheckoutSession,
} from "../../utilities/stripeUtils";
import { getEDUnits, getLPUnits } from "../../utilities/CampUtils";

const Logger = logger(__filename);
const emailService: IEmailService = new EmailService(nodemailerConfig);
const stripe = new Stripe(process.env.STRIPE_SECRET_TEST_KEY ?? "", {
  apiVersion: "2020-08-27",
});

class CamperService implements ICamperService {
  /* eslint-disable class-methods-use-this */
  async createCampersAndCheckout(
    campers: CreateCampersDTO,
    campSessions: string[],
    waitlistedCamperId?: string,
  ): Promise<CampRegistrationDTO> {
    const session = await mongoose.startSession();
    session.startTransaction();

    let registeredCampers: Camper[];
    let sessionsToRegister: CampSession[];
    let createCamperResponse: CamperDTO[] = [];
    let checkoutSessionUrl = "";

    try {
      // Perform session checks:
      sessionsToRegister = await MgCampSession.find(
        { _id: { $in: campSessions } },
        {},
        { session },
      );

      // Ensure all session ids passed in are found in the db
      if (sessionsToRegister.length !== campSessions.length) {
        throw new Error("Not all session ids passed in were found");
      }

      // Ensure we have enough space to register all campers in all the sessions
      if (
        !sessionsToRegister.every(
          (cs) => cs.capacity >= cs.campers.length + campers.length,
        )
      ) {
        throw new Error(
          "Not enough space in all the selected sessions to register the given campers",
        );
      }

      // Cannot register for sessions in progress
      if (
        !sessionsToRegister.every((cs) =>
          cs.dates.every((csDate) => csDate.getTime() > Date.now()),
        )
      ) {
        throw new Error("Cannot register for sessions in progress or finished");
      }

      const camp = await MgCamp.findById(
        sessionsToRegister[0].camp,
        {},
        { session },
      );
      if (!camp) {
        throw new Error(
          "Could not find the camp associated with this session id",
        );
      }

      if (!camp.active) {
        throw new Error(
          `Camp associated with camp sessions is a draft camp, must publish camp to add campers`,
        );
      }

      if (!sessionsToRegister.every((cs) => cs.camp.toString() === camp.id)) {
        throw new Error("All sessions must belong to the same camp");
      }

      // Ensure all campers meet the age requirements
      if (
        !campers.every(
          (camper) =>
            camper.age >= camp.ageLower && camper.age <= camp.ageUpper,
        )
      ) {
        throw new Error("Not all campers meet the age requirements");
      }

      // Add the total charges for the campers:
      const lineItems = createStripeLineItems(
        sessionsToRegister,
        campers,
        camp,
      );

      const createStripeCheckoutSessionResponse = await createStripeCheckoutSession(
        lineItems,
        camp.id,
      );

      if (
        !createStripeCheckoutSessionResponse.id ||
        !createStripeCheckoutSessionResponse.url
      ) {
        throw new Error(`Failed to create checkout session.`);
      }

      checkoutSessionUrl = createStripeCheckoutSessionResponse.url;

      // Create a camper entity for each session
      const campersToRegister: Array<
        Omit<CamperDTO, "id">
      > = sessionsToRegister.flatMap((cs) => {
        return campers.map((camper) => {
          return {
            campSession: cs.id,
            firstName: camper.firstName,
            lastName: camper.lastName,
            age: camper.age,
            allergies: camper.allergies,
            earlyDropoff: camper.earlyDropoff,
            latePickup: camper.latePickup,
            specialNeeds: camper.specialNeeds,
            contacts: camper.contacts,
            registrationDate: new Date().toString(),
            hasPaid: false,
            formResponses: camper.formResponses,
            chargeId: createStripeCheckoutSessionResponse.id,
            charges: {
              camp: 0,
              earlyDropoff: 0,
              latePickup: 0,
            },
            optionalClauses: camper.optionalClauses,
          };
        });
      });

      campersToRegister.forEach((camper) => {
        const daysOfCamp = sessionsToRegister
          .map((cs) => cs.dates.length)
          .reduce((totalDays, daysInSession) => totalDays + daysInSession);
        const totalCharges: CamperCharges = {
          camp: daysOfCamp * camp.fee, // Total amount paid for this camper to attend all session(s)
          earlyDropoff: getEDUnits(camper.earlyDropoff, camp) * camp.dropoffFee,
          latePickup: getLPUnits(camper.latePickup, camp) * camp.pickupFee,
        };
        /* eslint-disable no-param-reassign */
        camper.charges = totalCharges;
      });

      // Insert the campers
      registeredCampers = await MgCamper.insertMany(campersToRegister, {
        session,
      });

      // Add the campers to each session's campers field
      await Promise.all(
        sessionsToRegister.map((cs) => {
          cs.campers.push(
            ...registeredCampers.filter(
              (camper) => camper.campSession.toString() === cs.id,
            ),
          );
          return cs.save({ session });
        }),
      );

      /**
       * FINISHED CREATING REGISTERED CAMPERS.
       * UPDATE WAITLISTED CAMPER STATUS IF SHIFTING A WAITLIST CAMPER TO REGISTERED CAMPER
       */
      if (waitlistedCamperId) {
        // If there is a waitlisted camper, we can only register that camper
        if (campers.length !== 1) {
          throw new Error(
            "either no camper, or too many campers provided with wId",
          );
        }
        // Ensure we only have 1 session
        if (campSessions.length !== 1) {
          throw new Error(
            "Can only register waitlisted camper for 1 camp session at a time. Please only pass in 1 session",
          );
        }
        const waitlistedCamper = await MgWaitlistedCamper.findById(
          waitlistedCamperId,
          {},
          { session },
        );
        if (!waitlistedCamper) {
          throw new Error(
            "No waitlisted camper could be found with the given id",
          );
        }
        // Ensure that the waitlisted camper's session matches the session passed in
        if (waitlistedCamper.campSession.toString() !== campSessions[0]) {
          throw new Error(
            "Can not register the waitlisted camper for the given session",
          );
        }
        // Update the status of the waitlisted camper
        waitlistedCamper.status = "Registered";
        await waitlistedCamper.save({ session });
      }

      // Find all the campers who need special assistance
      const specialNeedsCampers = registeredCampers.filter(
        (camper) => camper.specialNeeds,
      );
      // Send emails in parallel to the admin about the special needs campers
      await Promise.all(
        specialNeedsCampers.map((camper) => {
          return emailService.sendAdminSpecialNeedsNoticeEmail(
            camp,
            camper,
            sessionsToRegister,
          );
        }),
      );

      // Email the parent about all the campers and sessions they have signed up for
      await emailService.sendParentConfirmationEmail(
        camp,
        registeredCampers,
        sessionsToRegister,
      );

      // Send admin an email for all the sessions that are now full
      // Note: At this point, the sessionsToRegister's campers field has been updated with the registered campers
      const fullSessions = sessionsToRegister.filter(
        (cs) => cs.capacity === cs.campers.length,
      );
      if (fullSessions.length) {
        await emailService.sendAdminFullCampNoticeEmail(camp, fullSessions);
      }

      // Create the DTO return objects
      createCamperResponse = registeredCampers.map((newCamper) => {
        return {
          id: newCamper.id,
          campSession: newCamper.campSession.toString(),
          firstName: newCamper.firstName,
          lastName: newCamper.lastName,
          age: newCamper.age,
          allergies: newCamper.allergies,
          earlyDropoff: newCamper.earlyDropoff.map((date) => date.toString()),
          latePickup: newCamper.latePickup.map((date) => date.toString()),
          specialNeeds: newCamper.specialNeeds,
          contacts: newCamper.contacts,
          registrationDate: newCamper.registrationDate.toString(),
          hasPaid: false,
          chargeId: newCamper.chargeId,
          formResponses: newCamper.formResponses,
          charges: newCamper.charges,
          optionalClauses: newCamper.optionalClauses,
        };
      });
      // Commit the transaction if everything was successful
      await session.commitTransaction();
    } catch (error: unknown) {
      Logger.error(
        `Failed to create camper(s). Reason: ${getErrorMessage(error)}`,
      );
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }

    return { campers: createCamperResponse, checkoutSessionUrl };
  }

  /* eslint-disable class-methods-use-this */
  async getAllCampers(): Promise<Array<CamperDTO>> {
    let camperDtos: Array<CamperDTO> = [];

    try {
      const campers: Array<Camper> = await MgCamper.find();
      camperDtos = campers.map((camper) => {
        return {
          id: camper.id,
          campSession: camper.campSession ? camper.campSession.toString() : "",
          firstName: camper.firstName,
          lastName: camper.lastName,
          age: camper.age,
          allergies: camper.allergies,
          earlyDropoff: camper.earlyDropoff.map((date) => date.toString()),
          latePickup: camper.latePickup.map((date) => date.toString()),
          specialNeeds: camper.specialNeeds,
          contacts: camper.contacts,
          registrationDate: camper.registrationDate.toString(),
          hasPaid: camper.hasPaid,
          chargeId: camper.chargeId,
          formResponses: camper.formResponses,
          charges: camper.charges,
          optionalClauses: camper.optionalClauses,
        };
      });
    } catch (error: unknown) {
      Logger.error(`Failed to get campers. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return camperDtos;
  }

  /* eslint-disable class-methods-use-this */
  async getCampersByCampId(
    campId: string,
  ): Promise<{
    campers: CamperDTO[];
    waitlist: WaitlistedCamperDTO[];
  }> {
    let camperDtos: Array<CamperDTO> = [];
    let waitlistedCamperDtos: Array<WaitlistedCamperDTO> = [];

    try {
      const existingCampSession: CampSession | null = await MgCampSession.findById(
        campId,
      )
        .populate({
          path: "campers",
          model: MgCamper,
        })
        .populate({
          path: "waitlist",
          model: MgWaitlistedCamper,
        });

      if (!existingCampSession) {
        throw new Error(`Camp session ${existingCampSession} not found.`);
      }

      const campers = existingCampSession.campers as Camper[];

      camperDtos = campers.map((camper) => {
        return {
          id: camper.id,
          campSession: camper.campSession ? camper.campSession.toString() : "",
          firstName: camper.firstName,
          lastName: camper.lastName,
          age: camper.age,
          allergies: camper.allergies,
          earlyDropoff: camper.earlyDropoff.map((date) => date.toString()),
          latePickup: camper.latePickup.map((date) => date.toString()),
          specialNeeds: camper.specialNeeds,
          contacts: camper.contacts,
          registrationDate: camper.registrationDate.toString(),
          hasPaid: camper.hasPaid,
          chargeId: camper.chargeId,
          formResponses: camper.formResponses,
          charges: camper.charges,
          optionalClauses: camper.optionalClauses,
        };
      });

      const waitlistedCampers = existingCampSession.waitlist as WaitlistedCamper[];

      waitlistedCamperDtos = waitlistedCampers.map((camper) => {
        return {
          id: camper.id,
          firstName: camper.firstName,
          lastName: camper.lastName,
          age: camper.age,
          contactName: camper.contactName,
          contactEmail: camper.contactEmail,
          contactNumber: camper.contactNumber,
          campSession: camper.campSession ? camper.campSession.toString() : "",
          status: camper.status,
        };
      });
    } catch (error: unknown) {
      Logger.error(`Failed to get campers. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return { campers: camperDtos, waitlist: waitlistedCamperDtos };
  }

  /* eslint-disable class-methods-use-this */
  async getCampersByChargeId(chargeId: string): Promise<CamperDTO[]> {
    try {
      // eslint-disable-next-line prettier/prettier
      const campers: Camper[] = await MgCamper.find({ chargeId });

      if (!campers || campers.length === 0) {
        throw new Error(`Campers with Charge Id ${chargeId} not found.`);
      }

      const camperDTO: CamperDTO[] = campers.map((camper) => {
        return {
          id: camper.id,
          campSession: camper.campSession ? camper.campSession.toString() : "",
          firstName: camper.firstName,
          lastName: camper.lastName,
          age: camper.age,
          allergies: camper.allergies,
          earlyDropoff: camper.earlyDropoff.map((date) => date.toString()),
          latePickup: camper.latePickup.map((date) => date.toString()),
          specialNeeds: camper.specialNeeds,
          contacts: camper.contacts,
          formResponses: camper.formResponses,
          registrationDate: camper.registrationDate.toString(),
          hasPaid: camper.hasPaid,
          chargeId: camper.chargeId,
          charges: camper.charges,
          optionalClauses: camper.optionalClauses,
        };
      });

      return camperDTO;
    } catch (error: unknown) {
      Logger.error(`Failed to get campers. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  /* eslint-disable class-methods-use-this */
  async getCampersByChargeIdAndSessionId(
    chargeId: string,
    sessionId: string,
  ): Promise<CamperDTO[]> {
    try {
      // eslint-disable-next-line prettier/prettier
      const campers: Camper[] = await MgCamper.find({
        chargeId,
        campSession: sessionId,
      });

      if (!campers || campers.length === 0) {
        throw new Error(
          `Campers with Charge Id ${chargeId} and Session Id ${sessionId} not found.`,
        );
      }

      const camperDTO: CamperDTO[] = campers.map((camper) => {
        return {
          id: camper.id,
          campSession: camper.campSession ? camper.campSession.toString() : "",
          firstName: camper.firstName,
          lastName: camper.lastName,
          age: camper.age,
          allergies: camper.allergies,
          earlyDropoff: camper.earlyDropoff.map((date) => date.toString()),
          latePickup: camper.latePickup.map((date) => date.toString()),
          specialNeeds: camper.specialNeeds,
          contacts: camper.contacts,
          formResponses: camper.formResponses,
          registrationDate: camper.registrationDate.toString(),
          hasPaid: camper.hasPaid,
          chargeId: camper.chargeId,
          charges: camper.charges,
          optionalClauses: camper.optionalClauses,
        };
      });

      return camperDTO;
    } catch (error: unknown) {
      Logger.error(`Failed to get campers. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async confirmCamperPayment(chargeId: string): Promise<boolean> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const checkoutSession = await retrieveStripeCheckoutSession(chargeId);
      if (!checkoutSession) {
        throw new Error(`Could not find checkout session with id ${chargeId}`);
      }

      if (checkoutSession.payment_status !== "paid") {
        throw new Error(
          `Checkout session status is ${checkoutSession.payment_status}, expected status to be "paid"`,
        );
      }

      const campers = await MgCamper.find({ chargeId });
      if (!campers || campers.length === 0) {
        throw new Error(
          `Could not find campers belonging to checkout session with id ${chargeId}`,
        );
      }

      await MgCamper.updateMany(
        { chargeId },
        { $set: { hasPaid: true } },
        { session, runValidators: true },
      );
      await session.commitTransaction();
    } catch (error: unknown) {
      await session.abortTransaction();
      Logger.error("Failed to confirm payment and mark campers as paid.");
      throw error;
    } finally {
      session.endSession();
    }

    return true;
  }

  /* eslint-disable class-methods-use-this */
  async createWaitlistedCampers(
    waitlistedCampers: CreateWaitlistedCamperDTO[],
    campSessions: string[],
  ): Promise<WaitlistedCamperDTO[]> {
    const session = await mongoose.startSession();
    session.startTransaction();

    let sessionsToWaitlist: CampSession[] = [];
    let newWaitlistedCampers: WaitlistedCamper[] = [];

    try {
      sessionsToWaitlist = await MgCampSession.find(
        { _id: { $in: campSessions } },
        {},
        { session },
      );

      // Ensure all sessions were found
      if (sessionsToWaitlist.length !== campSessions.length) {
        throw new Error("Could not find camp sessions for all ids");
      }

      const camp = await MgCamp.findById(
        sessionsToWaitlist[0].camp,
        {},
        { session },
      );
      if (!camp) {
        throw new Error(
          "Unable to find the camp associated with the camp sessions passed in",
        );
      }

      // Ensure all the campSessions are for the same camp
      if (!sessionsToWaitlist.every((cs) => cs.camp.toString() === camp.id)) {
        throw new Error("Not all camp sessions belong to the same camp");
      }

      // Ensure all camper(s) meet the age requirements of the camp
      if (
        !waitlistedCampers.every(
          (c) => c.age >= camp.ageLower && c.age <= camp.ageUpper,
        )
      ) {
        throw new Error(
          "Some camper(s) didn't meet the age requirements of the camp",
        );
      }

      // Create a waitlist camper entity for each session
      const campersToWaitlist: Array<
        Omit<WaitlistedCamperDTO, "id">
      > = campSessions.flatMap((cs) => {
        return waitlistedCampers.map((waitlistedCamper) => {
          return {
            firstName: waitlistedCamper.firstName,
            lastName: waitlistedCamper.lastName,
            age: waitlistedCamper.age,
            contactName: waitlistedCamper.contactName,
            contactEmail: waitlistedCamper.contactEmail,
            contactNumber: waitlistedCamper.contactNumber,
            campSession: cs,
            status: "NotRegistered",
          };
        });
      });

      // Insert the waitlisted camper entities
      newWaitlistedCampers = await MgWaitlistedCamper.insertMany(
        campersToWaitlist,
        { session },
      );

      // Add the campers to the waitlist field of each session
      await Promise.all(
        sessionsToWaitlist.map((cs) => {
          cs.waitlist.push(
            ...newWaitlistedCampers.filter(
              (camper) => camper.campSession.toString() === cs.id,
            ),
          );
          return cs.save({ session });
        }),
      );

      await emailService.sendParentWaitlistConfirmationEmail(
        camp,
        sessionsToWaitlist,
        newWaitlistedCampers,
      );

      await session.commitTransaction();
    } catch (error: unknown) {
      Logger.error(
        `Failed to create waitlisted camper. Reason: ${getErrorMessage(error)}`,
      );
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }

    return newWaitlistedCampers.map((c) => {
      return {
        id: c.id,
        firstName: c.firstName,
        lastName: c.lastName,
        age: c.age,
        contactName: c.contactName,
        contactEmail: c.contactEmail,
        contactNumber: c.contactName,
        campSession: c.campSession.toString(),
        status: c.status,
      };
    });
  }

  /* eslint-disable class-methods-use-this */
  async updateCampersById(
    camperIds: Array<string>,
    updatedFields: UpdateCamperDTO,
  ): Promise<Array<CamperDTO>> {
    let updatedCamperDTOs: Array<CamperDTO> = [];
    let updatedCampers: Array<Camper> = [];
    let oldCampers: Array<Camper> = [];
    let newCampSession: CampSession | null = null;
    let oldCampSession: CampSession | null = null;
    let movedCampSession = false;
    let camp: Camp | null;

    try {
      oldCampers = await MgCamper.find({
        _id: {
          $in: camperIds,
        },
      });

      if (oldCampers.length !== camperIds.length) {
        throw new Error(`Not all campers in [${camperIds}] are found.`);
      }

      const { chargeId } = oldCampers[0];
      for (let i = 0; i < oldCampers.length; i += 1) {
        if (oldCampers[i].chargeId !== chargeId) {
          throw new Error(`All campers must have the same chargeId.`);
        }
      }

      const oldCampSessionId = oldCampers[0].campSession;
      for (let i = 0; i < oldCampers.length; i += 1) {
        if (
          oldCampers[i].campSession.toString() !== oldCampSessionId.toString()
        ) {
          throw new Error(
            `Not all campers are registered for the same camp session`,
          );
        }
      }

      if (updatedFields.campSession) {
        movedCampSession = true;
        newCampSession = await MgCampSession.findById(
          updatedFields.campSession,
        );

        if (!newCampSession) {
          throw new Error(`Camp ${updatedFields.campSession} not found.`);
        }

        const newCampSessionOriginalCampers = newCampSession.campers; // for roll back

        oldCampSession = await MgCampSession.findById(
          oldCampers[0].campSession,
        );

        if (!oldCampSession) {
          throw new Error(`Camp ${oldCampers[0].campSession} not found.`);
        }

        if (newCampSession.camp.toString() !== oldCampSession.camp.toString()) {
          throw new Error(
            `Error: for all campers, can only change sessions between the same camp`,
          );
        }

        const oldCampSessionOriginalCampers = oldCampSession.campers; // for roll back

        if (newCampSession) {
          // campers for new camp session
          newCampSession.campers = newCampSession.campers.concat(oldCampers);

          // campers for old camp session
          oldCampSession.campers = oldCampSession.campers.filter(
            (camperId) => !camperIds.includes(camperId.toString()),
          );
        }

        try {
          await newCampSession.save();
          await oldCampSession.save();
        } catch (mongoDbError: unknown) {
          try {
            oldCampSession.campers = oldCampSessionOriginalCampers;
            await oldCampSession.save();

            newCampSession.campers = newCampSessionOriginalCampers;
            await newCampSession.save();
          } catch (rollbackDbError: unknown) {
            const errorMessage = [
              "Failed to rollback MongoDB update to campSession to restore camperIds. Reason =",
              getErrorMessage(rollbackDbError),
              "MongoDB camper ids that could not be restored in the camp Sessions=",
              camperIds,
            ];
            Logger.error(errorMessage.join(" "));
          }
        }
      }

      try {
        const updatedResult = await MgCamper.updateMany(
          {
            _id: {
              $in: camperIds,
            },
          },
          {
            $set: updatedFields,
          },
          { runValidators: true },
        );

        if (updatedResult.acknowledged === false) {
          throw new Error(
            `Some or none of the campers with camperIds [${camperIds}] were able to be updated.`,
          );
        }
      } catch (mongoDbError: unknown) {
        // rollback camper updates
        /* eslint-disable no-await-in-loop */
        for (let i = 0; i < oldCampers.length; i += 1) {
          try {
            const rollBackCamper = await MgCamper.findByIdAndUpdate(
              oldCampers[i].id,
              {
                ...oldCampers[i],
              },
              { runValidators: true },
            );
            if (!rollBackCamper) {
              throw new Error(`Camper ${oldCampers[i].id} not found.`);
            }
          } catch (rollbackDbError) {
            const errorMessage = [
              "Failed to rollback MongoDB camper creation after update camper failure. Reason =",
              getErrorMessage(rollbackDbError),
              "MongoDB camper id that could not be updated =",
              oldCampers[i].id,
            ];
            Logger.error(errorMessage.join(" "));
          }
        }
        throw mongoDbError;
      }
    } catch (error: unknown) {
      Logger.error(
        `Failed to update campers. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }

    updatedCampers = await MgCamper.find({
      _id: {
        $in: camperIds,
      },
    });

    if (movedCampSession && newCampSession && oldCampSession) {
      try {
        camp = await MgCamp.findById(newCampSession.camp);
        if (!camp) {
          throw new Error(`Error: Camp ${newCampSession.camp} not found`);
        }

        await emailService.sendParentMovedConfirmationEmail(
          updatedCampers,
          camp,
          oldCampSession,
          newCampSession,
        );
      } catch (error: unknown) {
        Logger.error(
          `Failed to send confirmation email. Reason = ${getErrorMessage(
            error,
          )}`,
        );
        throw error;
      }
    }

    updatedCamperDTOs = updatedCampers.map((updatedCamper) => {
      return {
        id: updatedCamper.id,
        campSession: updatedCamper.campSession
          ? updatedCamper.campSession.toString()
          : "",
        firstName: updatedCamper.firstName,
        lastName: updatedCamper.lastName,
        age: updatedCamper.age,
        allergies: updatedCamper.allergies,
        earlyDropoff: updatedCamper.earlyDropoff.map((date) => date.toString()),
        latePickup: updatedCamper.latePickup.map((date) => date.toString()),
        specialNeeds: updatedCamper.specialNeeds,
        contacts: updatedCamper.contacts,
        formResponses: updatedCamper.formResponses,
        registrationDate: updatedCamper.registrationDate.toString(),
        hasPaid: updatedCamper.hasPaid,
        chargeId: updatedCamper.chargeId,
        charges: updatedCamper.charges,
        optionalClauses: updatedCamper.optionalClauses,
      };
    });

    return updatedCamperDTOs;
  }

  /* eslint-disable class-methods-use-this */
  async cancelRegistration(
    chargeId: string,
    camperIds: string[],
  ): Promise<void> {
    try {
      const campersWithChargeId: Array<Camper> = await MgCamper.find({
        chargeId,
      });
      const campersToBeDeleted = campersWithChargeId.filter((camper) =>
        camperIds.includes(camper.id),
      );
      const camperIdsToBeDeleted = campersToBeDeleted.map(
        (camper) => camper.id,
      );

      if (!campersToBeDeleted.length) {
        throw new Error(
          `Campers with specified camperIds and charge ID ${chargeId} not found.`,
        );
      }

      // check if there are any campers that need to be removed but were not found
      const remainingCamperIds = camperIds.filter(
        (camperId) => !camperIdsToBeDeleted.includes(camperId),
      );

      if (remainingCamperIds.length) {
        throw new Error(
          `Failed to find these camper IDs to delete: ${JSON.stringify(
            remainingCamperIds,
          )}`,
        );
      }

      const campSession: CampSession | null = await MgCampSession.findById(
        campersToBeDeleted[0].campSession,
      );

      if (!campSession) {
        throw new Error(
          `Campers' camp session with campId ${campersToBeDeleted[0].campSession} not found.`,
        );
      }

      for (let i = 0; i < campersToBeDeleted.length; i += 1) {
        if (
          campersToBeDeleted[i].campSession.toString() !==
          campSession.id.toString()
        ) {
          throw new Error(
            `All campers must be registered for the same camp session.`,
          );
        }
      }
      const camp = await MgCamp.findById(campSession.camp);
      if (!camp) {
        throw new Error(
          `Campers' camp with campId ${campSession.camp} not found.`,
        );
      }

      const today = new Date();
      const diffInMilliseconds: number = Math.abs(
        campSession.dates[0].getTime() - today.getTime(),
      );
      const daysUntilStartOfCamp = Math.ceil(
        diffInMilliseconds / (1000 * 60 * 60 * 24),
      );

      if (daysUntilStartOfCamp < 30 && campSession.waitlist.length === 0) {
        throw new Error(
          `Campers' camp session with campId ${campersToBeDeleted[0].campSession} has a start date in less than 30 days and the waitlist is empty.`,
        );
      }

      // refund before db deletion - a camper should not be deleted if the refund doesn't go through
      // calculate amount to be refunded
      let refundAmount = 0;
      campersToBeDeleted.forEach((camper) => {
        const { charges } = camper;
        refundAmount +=
          charges.camp + charges.earlyDropoff + charges.latePickup;
      });

      await stripe.refunds.create({
        charge: chargeId,
        amount: refundAmount,
      });

      await this.deleteCampersById(camperIdsToBeDeleted);
      await Promise.all(
        campersToBeDeleted.map(async (camper) => {
          emailService.sendAdminCamperCancellationNoticeEmail(
            camp,
            camper,
            campSession,
          );
        }),
      );

      await emailService.sendParentCancellationConfirmationEmail(
        campersToBeDeleted,
      );
    } catch (error: unknown) {
      Logger.error(
        `Failed to cancel registration. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  /* eslint-disable class-methods-use-this */
  async deleteCampersById(camperIds: Array<string>): Promise<void> {
    try {
      const campers: Array<Camper> | null = await MgCamper.find({
        _id: {
          $in: camperIds,
        },
      });

      if (campers === null || campers.length !== camperIds.length) {
        throw new Error(
          `Not all campers with camper IDs [${camperIds}] are found.`,
        );
      }

      const oneChargeId = campers[0].chargeId;
      for (let i = 0; i < campers.length; i += 1) {
        if (campers[i].chargeId !== oneChargeId) {
          throw new Error(`ChargeIds must all be the same.`);
        }
      }

      const campSessionId = campers[0].campSession;
      for (let i = 0; i < campers.length; i += 1) {
        if (campers[i].campSession.toString() !== campSessionId.toString()) {
          throw new Error(
            `Not all campers are registered for the same campSession.`,
          );
        }
      }

      const campSession: CampSession | null = await MgCampSession.findById(
        campers[0].campSession,
      );
      if (!campSession) {
        throw new Error(
          `Camp session with ID ${campers[0].campSession} not found.`,
        );
      }

      const camp: Camp | null = await MgCamp.findById(campSession.camp);
      if (!camp) {
        throw new Error(`Camp with campId ${campSession.camp} not found.`);
      }

      const oldCampers = campSession.campers; // clone the full array of campers for rollback

      try {
        // delete camper IDs from the array of campers in the camp session
        const newCampers = campSession.campers.filter(
          (camperId) => !camperIds.includes(camperId.toString()),
        );

        campSession.campers = newCampers;
        const updatedCampSessionCampers = await campSession.save();

        if (!updatedCampSessionCampers) {
          throw new Error(
            `Failed to update ${campSession} with deleted campers.`,
          );
        }
      } catch (mongoDbError: unknown) {
        try {
          campSession.campers = oldCampers;
          await campSession.save();
        } catch (rollbackDbError: unknown) {
          const errorMessage = [
            "Failed to rollback MongoDB update to campSession to restore deleted camperIds. Reason =",
            getErrorMessage(rollbackDbError),
            "MongoDB camper ids that could not be restored in the camp Session=",
            camperIds,
          ];
          Logger.error(errorMessage.join(" "));
        }
      }

      // deleting campers from the camper table
      try {
        await MgCamper.deleteMany({
          _id: {
            $in: camperIds,
          },
        });
      } catch (mongoDbError: unknown) {
        // could not delete camper, rollback camp's campers deletion
        try {
          await MgCamper.create(campers);
        } catch (rollbackDbError: unknown) {
          const errorMessage = [
            "Failed to rollback MongoDB campers' creation after deleting campers failure. Reason =",
            getErrorMessage(rollbackDbError),
            "MongoDB camper ids that could not be deleted =",
            camperIds,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw mongoDbError;
      }
    } catch (error: unknown) {
      Logger.error(
        `Failed to delete campers with camper IDs [${camperIds}]. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  /* eslint-disable consistent-return */
  async inviteWaitlistedCamper(waitlistedCamperId: string): Promise<unknown> {
    // send email to contact to invite them to register
    const camperToUpdate: WaitlistedCamper | null = await MgWaitlistedCamper.findById(
      waitlistedCamperId,
    );
    if (camperToUpdate == null) {
      throw new Error("The camper to update is null!");
    }
    const campSession = await MgCampSession.findById(
      camperToUpdate.campSession,
    );
    if (campSession == null) {
      throw new Error("The camp session is null!");
    }
    try {
      const camp = await MgCamp.findById(campSession.camp);
      if (camp == null) {
        throw new Error("Associated camp is null!");
      }
      await emailService.sendParentRegistrationInviteEmail(
        camp,
        campSession,
        camperToUpdate,
      );
      camperToUpdate.status = "RegistrationFormSent";

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 3);
      camperToUpdate.linkExpiry = expiryDate;

      await camperToUpdate.save();
      if (camperToUpdate)
        return {
          id: camperToUpdate.id,
          firstName: camperToUpdate.firstName,
          lastName: camperToUpdate.lastName,
          age: camperToUpdate.age,
          contactName: camperToUpdate.contactName,
          contactEmail: camperToUpdate.contactEmail,
          contactNumber: camperToUpdate.contactNumber,
          campSession: camperToUpdate.campSession,
          status: camperToUpdate.status,
        };
    } catch (error: unknown) {
      Logger.error(
        `Failed to update waitlisted camper's status with ID ${waitlistedCamperId}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  /* eslint-disable class-methods-use-this */
  async deleteWaitlistedCamperById(waitlistedCamperId: string): Promise<void> {
    try {
      const waitlistedCamperToDelete: WaitlistedCamper | null = await MgWaitlistedCamper.findById(
        waitlistedCamperId,
      );

      if (!waitlistedCamperToDelete) {
        throw new Error(
          `Waitlisted Camper with ID ${waitlistedCamperId} not found.`,
        );
      }

      const campSession: CampSession | null = await MgCampSession.findById(
        waitlistedCamperToDelete.campSession,
      );
      if (!campSession) {
        throw new Error(
          `Waitlisted Camper's camp session with ID ${waitlistedCamperToDelete.campSession} not found.`,
        );
      }

      // delete the camper from the session's waitlist
      const oldWaitlistedCamperIds = [...campSession.waitlist];
      campSession.waitlist = campSession.waitlist.filter(
        (id) => id.toString() !== waitlistedCamperId,
      );
      await campSession.save();

      try {
        await MgWaitlistedCamper.deleteOne({
          _id: waitlistedCamperId,
        });
      } catch (mongoDbError: unknown) {
        // could not delete camper, rollback camp's waitlist deletion
        try {
          campSession.waitlist = oldWaitlistedCamperIds;
          await campSession.save();
        } catch (rollbackDbError: unknown) {
          const errorMessage = [
            "Failed to rollback MongoDB waitlist's updated waitlistedCampers field after deleting waitlistedCamper document failure. Reason =",
            getErrorMessage(rollbackDbError),
            "MongoDB waitlisted camper id that could not be deleted =",
            waitlistedCamperId,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw mongoDbError;
      }
    } catch (error: unknown) {
      Logger.error(
        `Failed to delete camper with camper ID ${waitlistedCamperId}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }
}

export default CamperService;
