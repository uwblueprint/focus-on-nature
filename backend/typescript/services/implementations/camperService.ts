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
} from "../../types";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import IEmailService from "../interfaces/emailService";
import nodemailerConfig from "../../nodemailer.config";
import EmailService from "./emailService";

const Logger = logger(__filename);
const emailService: IEmailService = new EmailService(nodemailerConfig);
const stripe = new Stripe(process.env.STRIPE_SECRET_TEST_KEY ?? "", {
  apiVersion: "2020-08-27",
});

class CamperService implements ICamperService {
  /* eslint-disable class-methods-use-this */
  async createCampers(campers: CreateCampersDTO): Promise<Array<CamperDTO>> {
    let newCamperDTOs: Array<CamperDTO> = [];
    let newCampers: Array<Camper> = [];
    let existingCampSession: CampSession | null;
    let newCamperIds: Array<string>;
    try {
      newCampers = await MgCamper.insertMany(campers);
      if (campers.length > 0) {
        try {
          newCamperIds = newCampers.map((newCamper) => newCamper.id);
          existingCampSession = await MgCampSession.findById(
            campers[0].campSession,
          );

          if (!existingCampSession) {
            throw new Error(
              `Camp session ${campers[0].campSession} not found.`,
            );
          }

          existingCampSession.campers = existingCampSession.campers
            .map((id) => id.toString())
            .concat(newCamperIds);
          await existingCampSession.save();

          const camp = await MgCamp.findById(existingCampSession.camp);
          if (!camp) {
            throw new Error(`Camp ${existingCampSession.camp} not found.`);
          }

          await emailService.sendParentConfirmationEmail(
            camp,
            newCampers,
            existingCampSession,
          );

          const specialNeedsCampers = newCampers.filter(
            (camper) => camper.specialNeeds,
          );

          /* eslint-disable no-await-in-loop */
          for (let i = 0; i < specialNeedsCampers.length; i += 1) {
            await emailService.sendAdminSpecialNeedsNoticeEmail(
              camp,
              specialNeedsCampers[i],
              existingCampSession,
            );
          }

          if (
            existingCampSession.campers.length >= existingCampSession.capacity
          ) {
            await emailService.sendAdminFullCampNoticeEmail(
              camp,
              existingCampSession,
            );
          }
        } catch (mongoDbError: unknown) {
          // rollback camper creation
          /* eslint-disable no-await-in-loop */
          for (let i = 0; i < newCampers.length; i += 1) {
            try {
              const deletedCamper: Camper | null = await MgCamper.findByIdAndDelete(
                newCampers[i].id,
              );
              if (!deletedCamper) {
                throw new Error(`Camper ${newCampers[i].id} not found.`);
              }
            } catch (rollbackDbError) {
              const errorMessage = [
                "Failed to rollback MongoDB camper creation after update camp failure. Reason =",
                getErrorMessage(rollbackDbError),
                "MongoDB camper id that could not be deleted =",
                newCampers[i].id,
              ];
              Logger.error(errorMessage.join(" "));
            }
          }
          throw mongoDbError;
        }
      }
    } catch (error: unknown) {
      Logger.error(
        `Failed to create camper. Reason: ${getErrorMessage(error)}`,
      );
      throw error;
    }
    newCamperDTOs = newCampers.map((newCamper) => {
      return {
        id: newCamper.id,
        campSession: newCamper.campSession.toString(),
        firstName: newCamper.firstName,
        lastName: newCamper.lastName,
        age: newCamper.age,
        allergies: newCamper.allergies,
        hasCamera: newCamper.hasCamera,
        hasLaptop: newCamper.hasLaptop,
        earlyDropoff: newCamper.earlyDropoff,
        latePickup: newCamper.latePickup,
        specialNeeds: newCamper.specialNeeds,
        contacts: newCamper.contacts,
        registrationDate: newCamper.registrationDate,
        hasPaid: newCamper.hasPaid,
        chargeId: newCamper.chargeId,
        formResponses: newCamper.formResponses,
        charges: newCamper.charges,
      };
    });
    return newCamperDTOs;
  }

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
          hasCamera: camper.hasCamera,
          hasLaptop: camper.hasLaptop,
          earlyDropoff: camper.earlyDropoff,
          latePickup: camper.latePickup,
          specialNeeds: camper.specialNeeds,
          contacts: camper.contacts,
          registrationDate: camper.registrationDate,
          hasPaid: camper.hasPaid,
          chargeId: camper.chargeId,
          formResponses: camper.formResponses,
          charges: camper.charges,
        };
      });
    } catch (error: unknown) {
      Logger.error(`Failed to get campers. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return camperDtos;
  }

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
          hasCamera: camper.hasCamera,
          hasLaptop: camper.hasLaptop,
          earlyDropoff: camper.earlyDropoff,
          latePickup: camper.latePickup,
          specialNeeds: camper.specialNeeds,
          contacts: camper.contacts,
          registrationDate: camper.registrationDate,
          hasPaid: camper.hasPaid,
          chargeId: camper.chargeId,
          formResponses: camper.formResponses,
          charges: camper.charges,
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
        };
      });
    } catch (error: unknown) {
      Logger.error(`Failed to get campers. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return { campers: camperDtos, waitlist: waitlistedCamperDtos };
  }

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
          hasCamera: camper.hasCamera,
          hasLaptop: camper.hasLaptop,
          earlyDropoff: camper.earlyDropoff,
          latePickup: camper.latePickup,
          specialNeeds: camper.specialNeeds,
          contacts: camper.contacts,
          formResponses: camper.formResponses,
          registrationDate: camper.registrationDate,
          hasPaid: camper.hasPaid,
          chargeId: camper.chargeId,
          charges: camper.charges,
        };
      });

      return camperDTO;
    } catch (error: unknown) {
      Logger.error(`Failed to get campers. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async createWaitlistedCamper(
    waitlistedCamper: CreateWaitlistedCamperDTO,
  ): Promise<WaitlistedCamperDTO> {
    let newWaitlistedCamper: WaitlistedCamper;
    let existingCampSession: CampSession | null;

    try {
      newWaitlistedCamper = await MgWaitlistedCamper.create({
        firstName: waitlistedCamper.firstName,
        lastName: waitlistedCamper.lastName,
        age: waitlistedCamper.age,
        contactName: waitlistedCamper.contactName,
        contactEmail: waitlistedCamper.contactEmail,
        contactNumber: waitlistedCamper.contactNumber,
        campSession: waitlistedCamper.campSession,
      });

      try {
        existingCampSession = await MgCampSession.findByIdAndUpdate(
          waitlistedCamper.campSession,
          {
            $push: { waitlist: newWaitlistedCamper.id },
          },
          { runValidators: true },
        );

        if (!existingCampSession) {
          throw new Error(
            `Camp session ${waitlistedCamper.campSession} not found.`,
          );
        }

        const camp = await MgCamp.findById(existingCampSession.camp);
        if (!camp) {
          throw new Error(`Camp ${existingCampSession.camp} not found.`);
        }
        await emailService.sendParentWaitlistConfirmationEmail(
          camp,
          existingCampSession,
          [newWaitlistedCamper],
        );
      } catch (mongoDbError: unknown) {
        // rollback user creation
        try {
          const deletedWaitlistedCamper: WaitlistedCamper | null = await MgWaitlistedCamper.findByIdAndDelete(
            newWaitlistedCamper.id,
          );

          if (!deletedWaitlistedCamper) {
            throw new Error(
              `Waitlisted Camper ${newWaitlistedCamper.id} not found.`,
            );
          }
        } catch (rollbackDbError) {
          const errorMessage = [
            "Failed to rollback MongoDB waitlisted camper creation after update camp failure. Reason =",
            getErrorMessage(rollbackDbError),
            "MongoDB camper id that could not be deleted =",
            newWaitlistedCamper.id,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw mongoDbError;
      }
    } catch (error: unknown) {
      Logger.error(
        `Failed to create waitlisted camper. Reason: ${getErrorMessage(error)}`,
      );
      throw error;
    }

    return {
      id: newWaitlistedCamper.id,
      firstName: waitlistedCamper.firstName,
      lastName: waitlistedCamper.lastName,
      age: waitlistedCamper.age,
      contactName: waitlistedCamper.contactName,
      contactEmail: waitlistedCamper.contactEmail,
      contactNumber: waitlistedCamper.contactNumber,
      campSession: waitlistedCamper.campSession,
    };
  }

  /* eslint-disable class-methods-use-this */
  async updateCampersById(
    camperIds: Array<string>,
    updatedFields: UpdateCamperDTO,
  ): Promise<Array<CamperDTO>> {
    let updatedCamperDTOs: Array<CamperDTO> = [];
    let updatedCampers: Array<Camper> = [];
    let oldCampers: Array<Camper> = [];
    let newCampSessionCampers: (
      | string
      | mongoose.Schema.Types.ObjectId
      | Camper
    )[] = [];
    let oldCampSessionCampers: (
      | string
      | mongoose.Schema.Types.ObjectId
      | Camper
    )[] = [];
    let newCampSession: CampSession | null;
    let oldCampSession: CampSession | null;

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

      if (updatedFields.campSession) {
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

        /* eslint-disable no-await-in-loop */
        for (let i = 0; i < camperIds.length; i += 1) {
          const oneCampSession = await MgCampSession.findById(
            oldCampers[i].campSession,
          );
          if (
            oneCampSession &&
            oneCampSession.id.toString() !== oldCampSession.id.toString()
          ) {
            throw new Error(
              `Not all campers are registered for the same camp session`,
            );
          }
        }

        if (newCampSession.camp.toString() !== oldCampSession.camp.toString()) {
          throw new Error(
            `Error: for all campers, can only change sessions between the same camp`,
          );
        }

        const oldCampSessionOriginalCampers = oldCampSession.campers; // for roll back

        if (newCampSession) {
          // campers for new camp session
          newCampSessionCampers = newCampSession.campers;
          for (let i = 0; i < oldCampers.length; i += 1) {
            newCampSessionCampers.push(oldCampers[i]);
          }

          // campers for old camp session
          oldCampSessionCampers = oldCampSession.campers.filter(
            (camperId) => !camperIds.includes(camperId.toString()),
          );
        }

        try {
          // update camper IDs for new camp session
          newCampSession.campers = newCampSessionCampers;
          const updatedNewCampSessionCampers = await newCampSession.save();

          if (!updatedNewCampSessionCampers) {
            throw new Error(
              `Failed to update ${newCampSession} with updated campers.`,
            );
          }

          // update camper IDs for old camp session
          oldCampSession.campers = oldCampSessionCampers;
          const updatedOldCampSessionCampers = await oldCampSession.save();

          if (!updatedOldCampSessionCampers) {
            throw new Error(
              `Failed to update ${oldCampSession} with updated campers.`,
            );
          }
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
                campSession: oldCampers[i].campSession,
                formResponses: oldCampers[i].formResponses,
                hasPaid: oldCampers[i].hasPaid,
                chargeId: oldCampers[i].chargeId,
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
        hasCamera: updatedCamper.hasCamera,
        hasLaptop: updatedCamper.hasLaptop,
        earlyDropoff: updatedCamper.earlyDropoff,
        latePickup: updatedCamper.latePickup,
        specialNeeds: updatedCamper.specialNeeds,
        contacts: updatedCamper.contacts,
        formResponses: updatedCamper.formResponses,
        registrationDate: updatedCamper.registrationDate,
        hasPaid: updatedCamper.hasPaid,
        chargeId: updatedCamper.chargeId,
        charges: updatedCamper.charges,
      };
    });

    return updatedCamperDTOs;
  }

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

      // call delete campers function
      await this.deleteCampersById(camperIdsToBeDeleted);
    } catch (error: unknown) {
      Logger.error(
        `Failed to cancel registration. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

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

      const campSession: CampSession | null = await MgCampSession.findById(
        campers[0].campSession,
      );
      if (!campSession) {
        throw new Error(
          `Camp session with ID ${campers[0].campSession} not found.`,
        );
      }

      /* eslint-disable no-await-in-loop */
      for (let i = 0; i < campers.length; i += 1) {
        const camperCampSession: CampSession | null = await MgCampSession.findById(
          campers[i].campSession,
        );
        if (!camperCampSession) {
          throw new Error(
            `Campers' camp session with campSessionId ${campers[i].campSession} not found.`,
          );
        }
        if (camperCampSession.id.toString() !== campSession.id.toString()) {
          throw new Error(
            `Not all campers are registered for the same campSession.`,
          );
        }
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
        /* eslint-disable no-await-in-loop */
        for (let i = 0; i < campers.length; i += 1) {
          await emailService.sendAdminCamperCancellationNoticeEmail(
            camp,
            campers[i],
            campSession,
          );
        }
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
