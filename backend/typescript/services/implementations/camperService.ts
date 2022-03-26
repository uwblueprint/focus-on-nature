import ICamperService from "../interfaces/camperService";
import MgCamper, { Camper } from "../../models/camper.model";
import MgWaitlistedCamper, {
  WaitlistedCamper,
} from "../../models/waitlistedCamper.model";
import MgCamp, { Camp } from "../../models/camp.model";
import {
  CreateCamperDTO,
  CamperDTO,
  CreateWaitlistedCamperDTO,
  WaitlistedCamperDTO,
} from "../../types";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";

const Logger = logger(__filename);

class CamperService implements ICamperService {
  /* eslint-disable class-methods-use-this */
  async createCamper(camper: CreateCamperDTO): Promise<CamperDTO> {
    let newCamper: Camper;
    let existingCamp: Camp | null;
    try {
      newCamper = await MgCamper.create({
        camp: camper.camp,
        registrationDate: camper.registrationDate,
        hasPaid: camper.hasPaid,
        chargeId: camper.chargeId,
        formResponses: camper.formResponses,
      });

      try {
        existingCamp = await MgCamp.findByIdAndUpdate(
          camper.camp,
          {
            $push: { campers: newCamper.id },
          },
          { runValidators: true },
        );

        if (!existingCamp) {
          throw new Error(`Camp ${camper.camp} not found.`);
        }
      } catch (mongoDbError: unknown) {
        // rollback user creation
        try {
          const deletedCamper: Camper | null = await MgCamper.findByIdAndDelete(
            newCamper.id,
          );

          if (!deletedCamper) {
            throw new Error(`Camper ${newCamper.id} not found.`);
          }
        } catch (rollbackDbError) {
          const errorMessage = [
            "Failed to rollback MongoDB camper creation after update camp failure. Reason =",
            getErrorMessage(rollbackDbError),
            "MongoDB camper id that could not be deleted =",
            newCamper.id,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw mongoDbError;
      }
    } catch (error: unknown) {
      Logger.error(
        `Failed to create camper. Reason: ${getErrorMessage(error)}`,
      );
      throw error;
    }

    return {
      id: newCamper.id,
      camp: camper.camp,
      registrationDate: newCamper.registrationDate,
      hasPaid: newCamper.hasPaid,
      chargeId: newCamper.chargeId,
      formResponses: camper.formResponses,
    };
  }

  async getAllCampers(): Promise<Array<CamperDTO>> {
    let camperDtos: Array<CamperDTO> = [];

    try {
      const campers: Array<Camper> = await MgCamper.find();
      camperDtos = campers.map((camper) => {
        return {
          id: camper.id,
          camp: camper.camp ? camper.camp.toString() : "",
          registrationDate: camper.registrationDate,
          hasPaid: camper.hasPaid,
          chargeId: camper.chargeId,
          formResponses: camper.formResponses,
        };
      });
    } catch (error: unknown) {
      Logger.error(`Failed to get campers. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return camperDtos;
  }

  async getCampersByCampId(campId: string): Promise<Array<CamperDTO>> {
    let camperDtos: Array<CamperDTO> = [];

    try {
      const existingCamp: Camp | null = await MgCamp.findById(campId).populate({
        path: "campers",
        model: MgCamper,
      });

      if (!existingCamp) {
        throw new Error(`Camp ${existingCamp} not found.`);
      }

      const campers = existingCamp.campers as Camper[];

      camperDtos = campers.map((camper) => {
        return {
          id: camper.id,
          camp: camper.camp ? camper.camp.toString() : "",
          registrationDate: camper.registrationDate,
          hasPaid: camper.hasPaid,
          chargeId: camper.chargeId,
          formResponses: camper.formResponses,
        };
      });
    } catch (error: unknown) {
      Logger.error(`Failed to get campers. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return camperDtos;
  }

  async createWaitlistedCamper(
    waitlistedCamper: CreateWaitlistedCamperDTO,
  ): Promise<WaitlistedCamperDTO> {
    let newWaitlistedCamper: WaitlistedCamper;
    let existingCamp: Camp | null;

    try {
      newWaitlistedCamper = await MgWaitlistedCamper.create({
        firstName: waitlistedCamper.firstName,
        lastName: waitlistedCamper.lastName,
        age: waitlistedCamper.age,
        contactName: waitlistedCamper.contactName,
        contactEmail: waitlistedCamper.contactEmail,
        contactNumber: waitlistedCamper.contactNumber,
        camp: waitlistedCamper.camp,
      });

      try {
        existingCamp = await MgCamp.findByIdAndUpdate(
          waitlistedCamper.camp,
          {
            $push: { waitlist: newWaitlistedCamper.id },
          },
          { runValidators: true },
        );

        if (!existingCamp) {
          throw new Error(`Camp ${waitlistedCamper.camp} not found.`);
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
      camp: waitlistedCamper.camp,
    };
  }

  async deleteCampersByChargeId(chargeId: string): Promise<void> {
    try {
      const campers: Array<Camper> = await MgCamper.find({
        chargeId,
      });

      if (!campers.length) {
        throw new Error(`Campers with charge ID ${chargeId} not found.`);
      }

      const camp: Camp | null = await MgCamp.findById(campers[0].camp);

      if (!camp) {
        throw new Error(
          `Campers' camp with campId ${campers[0].camp} not found.`,
        );
      }

      const today = new Date();
      const diffInMilliseconds: number = Math.abs(
        camp.dates[0].getTime() - today.getTime(),
      );
      const daysUntilStartOfCamp = Math.ceil(
        diffInMilliseconds / (1000 * 60 * 60 * 24),
      );

      if (daysUntilStartOfCamp < 30) {
        throw new Error(
          `Campers' camp with campId ${campers[0].camp} has a start date in less than 30 days.`,
        );
      }

      const camperIds = campers.map((camper) => camper.id);
      const oldCamperIds = [...camp.campers]; // clone the full array of campers for rollback
      camp.campers = camp.campers.filter(
        (camperId) => !camperIds.includes(camperId.toString()),
      );
      await camp.save();

      try {
        await MgCamper.deleteMany({
          _id: {
            $in: camperIds,
          },
        });
      } catch (mongoDbError: unknown) {
        // could not delete users, rollback camp's camper deletions
        try {
          camp.campers = oldCamperIds;
          await camp.save();
        } catch (rollbackDbError: unknown) {
          const errorMessage = [
            "Failed to rollback MongoDB camp's updated campers field after deleting camper documents failure. Reason =",
            getErrorMessage(rollbackDbError),
            "MongoDB campers id that could not be deleted =",
            camperIds,
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
      const camper: Camper | null = await MgCamper.findById(camperId);

      if (!camper) {
        throw new Error(`Camper with camper ID ${camperId} not found.`);
      }

      const camp: Camp | null = await MgCamp.findById(camper.camp);

      if (!camp) {
        throw new Error(`Camper's camp with campId ${camper.camp} not found.`);
      }

      // delete the camper from the camp's list of campers
      const oldCamperIds = [...camp.campers];
      camp.campers = camp.campers.filter((id) => id.toString() !== camperId);
      await camp.save();

      try {
        await MgCamper.deleteOne({
          _id: camperId,
        });
      } catch (mongoDbError: unknown) {
        // could not delete camper, rollback camp's campers deletion
        try {
          camp.campers = oldCamperIds;
          await camp.save();
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
}

export default CamperService;
