import Stripe from "stripe";
import ICamperService from "../interfaces/camperService";
import MgCamper, { Camper } from "../../models/camper.model";
import MgWaitlistedCamper, {
  WaitlistedCamper,
} from "../../models/waitlistedCamper.model";
import MgCampSession, { CampSession } from "../../models/campSession.model";
import {
  CreateCampersDTO,
  CamperDTO,
  CreateWaitlistedCamperDTO,
  WaitlistedCamperDTO,
  UpdateCamperDTO,
} from "../../types";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import mongoose from "mongoose";

const Logger = logger(__filename);
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
          existingCampSession = await MgCampSession.findByIdAndUpdate(
            campers[0].campSession,
            {
              $push: { campers: newCamperIds },
            },
            {
              runValidators: true,
            },
          );
          if (!existingCampSession) {
            throw new Error(
              `Camp session ${campers[0].campSession} not found.`,
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
          throw new Error(`Camp ${waitlistedCamper.campSession} not found.`);
        }
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
    let newCampSessionCampers: (mongoose.Schema.Types.ObjectId | Camper)[] = [];
    let oldCampSessionCampers: (mongoose.Schema.Types.ObjectId | Camper)[] = [];
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

      if (camperIds.length > 0) {
        const { chargeId } = oldCampers[0];
        for (let i = 0; i < oldCampers.length; i += 1) {
          if (oldCampers[i].chargeId !== chargeId) {
            throw new Error(`All campers must have the same chargeId.`);
          }
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

        /* eslint-disable no-await-in-loop */
        for (let i = 0; i < camperIds.length; i += 1) {
          oldCampSession = await MgCampSession.findById(
            oldCampers[i].campSession,
          );

          if (
            oldCampSession &&
            newCampSession.camp.toString() !== oldCampSession.camp.toString()
          ) {
            throw new Error(
              `Error: for camper ${oldCampers[i].id}, can only change sessions between the same camp`,
            );
          }
        }

        oldCampSession = await MgCampSession.findById(
          oldCampers[0].campSession,
        );

        if (!oldCampSession) {
          throw new Error(`Camp ${oldCampers[0].campSession} not found.`);
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
          const updatedNewCampSessionCampers = await MgCampSession.findByIdAndUpdate(
            newCampSession.id,
            { campers: newCampSessionCampers },
            { runValidators: true },
          );

          if (!updatedNewCampSessionCampers) {
            throw new Error(
              `Failed to update ${newCampSession} with updated campers.`,
            );
          }

          // update camper IDs for old camp session
          const updatedOldCampSessionCampers = await MgCampSession.findByIdAndUpdate(
            oldCampSession.id,
            { campers: oldCampSessionCampers },
            { runValidators: true },
          );

          if (!updatedOldCampSessionCampers) {
            throw new Error(
              `Failed to update ${oldCampSession} with updated campers.`,
            );
          }
        } catch (mongoDbError: unknown) {
          try {
            await MgCampSession.findByIdAndUpdate(
              oldCampSession.id,
              { campers: oldCampSessionOriginalCampers },
              { runValidators: true },
            );

            await MgCampSession.findByIdAndUpdate(
              newCampSession.id,
              { campers: newCampSessionOriginalCampers },
              { runValidators: true },
            );
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

      const oldCampers = campSession.campers; // clone the full array of campers for rollback

      try {
        // delete camper IDs from the camp
        const newCampers = campSession.campers.filter(
          (camperId) => !camperIds.includes(camperId.toString()),
        );

        const updatedCampSessionCampers = await MgCampSession.findByIdAndUpdate(
          campSession.id,
          { campers: newCampers },
          { runValidators: true },
        );

        if (!updatedCampSessionCampers) {
          throw new Error(
            `Failed to update ${campSession} with deleted campers.`,
          );
        }
      } catch (mongoDbError: unknown) {
        try {
          await MgCampSession.findByIdAndUpdate(
            campSession.id,
            { campers: oldCampers },
            { runValidators: true },
          );
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
}

export default CamperService;
