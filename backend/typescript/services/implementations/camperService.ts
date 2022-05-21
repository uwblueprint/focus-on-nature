import Stripe from "stripe";
import { off } from "process";
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
          status: "NOT REGISTERED",
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
      status: "NOT REGISTERED",
    };
  }

  /* eslint-disable class-methods-use-this */
  async updateCamperById(
    camperId: string,
    camper: UpdateCamperDTO,
  ): Promise<CamperDTO> {
    let oldCamper: Camper | null;

    try {
      oldCamper = await MgCamper.findById(camperId);

      if (camper.campSession && oldCamper) {
        const newCampSession: CampSession | null = await MgCampSession.findById(
          camper.campSession,
        );
        const oldCampSession: CampSession | null = await MgCampSession.findById(
          oldCamper.campSession,
        );

        if (!newCampSession) {
          throw new Error(`camp ${camper.campSession} not found.`);
        } else if (
          newCampSession &&
          oldCampSession &&
          newCampSession.camp.toString() !== oldCampSession.camp.toString()
        ) {
          throw new Error(
            `Error: can only change sessions between the same camp`,
          );
        }
      }

      // must explicitly specify runValidators when updating through findByIdAndUpdate
      oldCamper = await MgCamper.findByIdAndUpdate(
        camperId,
        {
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
          campSession: camper.campSession,
          formResponses: camper.formResponses,
          hasPaid: camper.hasPaid,
        },
        { runValidators: true },
      );

      if (!oldCamper) {
        throw new Error(`camperId ${camperId} not found.`);
      }
    } catch (error: unknown) {
      Logger.error(`Failed to update user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return {
      id: camperId,
      campSession: camper.campSession,
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
      registrationDate: oldCamper.registrationDate,
      hasPaid: camper.hasPaid,
      chargeId: oldCamper.chargeId,
      charges: oldCamper.charges,
    };
  }

  async deleteCampersByChargeId(
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

      if (daysUntilStartOfCamp < 30) {
        throw new Error(
          `Campers' camp session with campId ${campersToBeDeleted[0].campSession} has a start date in less than 30 days.`,
        );
      }

      const oldCamperIds = [...campSession.campers]; // clone the full array of campers for rollback
      // delete camper IDs from the camp
      campSession.campers = campSession.campers.filter(
        (camperId) => !camperIdsToBeDeleted.includes(camperId.toString()),
      );
      await campSession.save();

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

      try {
        await MgCamper.deleteMany({
          _id: {
            $in: camperIdsToBeDeleted,
          },
        });
        await emailService.sendAdminCamperCancellationNoticeEmail(
          camp,
          campersToBeDeleted[0],
          campSession,
        );
        await emailService.sendParentCancellationConfirmationEmail(
          campersToBeDeleted,
        );
      } catch (mongoDbError: unknown) {
        // could not delete users, rollback camp's camper deletions
        try {
          campSession.campers = oldCamperIds;
          await campSession.save();
        } catch (rollbackDbError: unknown) {
          const errorMessage = [
            "Failed to rollback MongoDB camp's updated campers field after deleting camper documents failure. Reason =",
            getErrorMessage(rollbackDbError),
            "MongoDB campers id that could not be deleted =",
            camperIdsToBeDeleted,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw mongoDbError;
      }
    } catch (error: unknown) {
      Logger.error(
        `Failed to cancel registration. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async deleteCamperById(camperId: string): Promise<void> {
    try {
      const camperToDelete: Camper | null = await MgCamper.findById(camperId);

      if (!camperToDelete) {
        throw new Error(`Camper with camper ID ${camperId} not found.`);
      }

      const campSession: CampSession | null = await MgCampSession.findById(
        camperToDelete.campSession,
      );
      if (!campSession) {
        throw new Error(
          `Camper's camp session with campId ${camperToDelete.campSession} not found.`,
        );
      }

      const camp: Camp | null = await MgCamp.findById(campSession.camp);
      if (!camp) {
        throw new Error(`Camp with campId ${campSession.camp} not found.`);
      }

      // delete the camper from the camp's list of campers
      const oldCamperIds = [...campSession.campers];
      campSession.campers = campSession.campers.filter(
        (id) => id.toString() !== camperId,
      );
      await campSession.save();

      try {
        await MgCamper.deleteOne({
          _id: camperId,
        });

        await emailService.sendAdminCamperCancellationNoticeEmail(
          camp,
          camperToDelete,
          campSession,
        );
      } catch (mongoDbError: unknown) {
        // could not delete camper, rollback camp's campers deletion
        try {
          campSession.campers = oldCamperIds;
          await campSession.save();
        } catch (rollbackDbError: unknown) {
          const errorMessage = [
            "Failed to rollback MongoDB camp's updated campers field after deleting camper document failure. Reason =",
            getErrorMessage(rollbackDbError),
            "MongoDB camper id that could not be deleted =",
            camperId,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw mongoDbError;
      }
    } catch (error: unknown) {
      Logger.error(
        `Failed to delete camper with camper ID ${camperId}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  /* eslint-disable consistent-return */
  async updateWaitlistedCamperStatus(waitlistedCamperId: string): Promise<any> {
    // send email to contact to invite them to register
    const camperToUpdate: WaitlistedCamper | null = await MgWaitlistedCamper.findById(
      waitlistedCamperId,
    );
    let campSession;
    if (camperToUpdate) {
      campSession = await MgCampSession.findById(camperToUpdate.campSession);
    }

    try {
      if (campSession && camperToUpdate) {
        const camp = await MgCamp.findById(campSession.camp);
        if (camp) {
          // fix waitlistedCamper below bc don't think it can be a dto
          await emailService.sendParentRegistrationInviteEmail(
            camp,
            campSession,
            camperToUpdate,
          );
          camperToUpdate.status = "REGISTRATION FORM SENT";
          await camperToUpdate.save();
          // await MgWaitlistedCamper.update({_id: camperToUpdate.id})
        }
      }

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
          status: "REGISTRATION FORM SENT",
        };
    } catch (error: unknown) {
      Logger.error(
        `Failed to updated waitlisted camper's status with ID ${waitlistedCamperId}. Reason = ${getErrorMessage(
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
