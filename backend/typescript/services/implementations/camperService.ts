import ICamperService from "../interfaces/camperService";
import MgCamper, { Camper } from "../../models/camper.model";
import MgWaitlistedCamper, {
  WaitlistedCamper,
} from "../../models/waitlistedCamper.model";
import MgCampSession, { CampSession } from "../../models/campSession.model";
import {
  CreateCamperDTO,
  CamperDTO,
  CreateWaitlistedCamperDTO,
  WaitlistedCamperDTO,
  UpdateCamperDTO,
} from "../../types";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";

const Logger = logger(__filename);

class CamperService implements ICamperService {
  /* eslint-disable class-methods-use-this */
  async createCamper(camper: CreateCamperDTO): Promise<CamperDTO> {
    let newCamper: Camper;
    let existingCamp: CampSession | null;
    try {
      existingCamp = await MgCampSession.findById(camper.campSession);

      if (existingCamp) {
        if (existingCamp.campers.length >= existingCamp.capacity) {
          throw new Error(
            `Error: camp is full. Current number of campers in camp: ${existingCamp.campers.length}. Camp capacity: ${existingCamp.capacity}.`,
          );
        }
      } else {
        throw new Error(`Camp ${camper.campSession} not found.`);
      }

      newCamper = await MgCamper.create({
        campSession: camper.campSession,
        registrationDate: camper.registrationDate,
        hasPaid: camper.hasPaid,
        chargeId: camper.chargeId,
        formResponses: camper.formResponses,
      });

      try {
        existingCamp = await MgCampSession.findByIdAndUpdate(
          camper.campSession,
          {
            $push: { campers: newCamper.id },
          },
          { runValidators: true },
        );

        if (!existingCamp) {
          throw new Error(`CampSession ${camper.campSession} not found.`);
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
      campSession: camper.campSession,
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
          campSession: camper.campSession ? camper.campSession.toString() : "",
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
      const existingCamp: CampSession | null = await MgCampSession.findById(
        campId,
      ).populate({
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
          campSession: camper.campSession ? camper.campSession.toString() : "",
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
    let existingCamp: CampSession | null;

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
        existingCamp = await MgCampSession.findByIdAndUpdate(
          waitlistedCamper.campSession,
          {
            $push: { waitlist: newWaitlistedCamper.id },
          },
          { runValidators: true },
        );

        if (!existingCamp) {
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
    // need to revisit and work on
    campers: Array<UpdateCamperDTO>,
  ): Promise<Array<CamperDTO>> {
    let updatedCamperDTOs: Array<CamperDTO> = [];
    let oldCampers: Array<Camper> = []; // for rollback strategy....but what do i even do?
    let updatedCampers: Array<Camper> = [];

    try {
      const camperIds = campers.map((camper) => camper.id);
      oldCampers = await MgCamper.find({
        _id: {
          $in: camperIds,
        },
      });

      if (oldCampers.length !== campers.length) {
        throw new Error(`Not all campers in [${campers}] are found.`);
      }

      for (let i = 0; i < campers.length; i += 1) {
        let camper = campers[i];
        if (camper.campSession && oldCampers[i]) {
          const newCamp: CampSession | null = await MgCampSession.findById(
            camper.campSession,
          );
          const oldCamp: CampSession | null = await MgCampSession.findById(
            oldCampers[i].campSession,
          );

          if (!newCamp) {
            throw new Error(
              `Camp ${camper.campSession} not found for camper ${camper.id}.`,
            );
          } else if (
            newCamp &&
            oldCamp &&
            newCamp.camp.toString() !== oldCamp.camp.toString()
          ) {
            throw new Error(
              `Error: for camper ${camper.id}, can only change sessions between the same camp`,
            );
          }
        }
      }

      updatedCampers = await MgCamper.updateMany(campers);

      if (!updatedCampers) {
        throw new Error(`Campers with camperIds [${camperIds}] not found.`);
      }
    } catch (error: unknown) {
      Logger.error(
        `Failed to update campers. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    updatedCamperDTOs = updatedCampers.map((updatedCamper) => {
      return {
        id: updatedCamper.id,
        campSession: updatedCamper.campSession
          ? updatedCamper.campSession.toString()
          : "",
        registrationDate: updatedCamper.registrationDate,
        hasPaid: updatedCamper.hasPaid,
        chargeId: updatedCamper.chargeId,
        formResponses: updatedCamper.formResponses,
      };
    });

    return updatedCamperDTOs;
  }

  async cancelRegistration(camperIds: Array<string>): Promise<void> {
    if (camperIds.length > 0) {
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

        const oneCampSessionId = campers[0].campSession;

        const campSession: CampSession | null = await MgCampSession.findById(
          oneCampSessionId,
        );

        if (!campSession) {
          throw new Error(
            `Campers' camp session with campSessionId ${oneCampSessionId} not found.`,
          );
        }

        for (let i = 0; i < campers.length; i += 1) {
          if (
            campers[i].campSession.toString() !== oneCampSessionId.toString()
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
            `Campers' camp with campId ${oneCampSessionId} has a start date in less than 30 days and the waitlist is empty.`,
          );
        }
        // call delete campers function
        await this.deleteCampersById(camperIds);
      } catch (error: unknown) {
        Logger.error(
          `Failed to cancel registration. Reason = ${getErrorMessage(error)}`,
        );
        throw error;
      }
    }
  }

  async deleteCampersById(camperIds: Array<string>): Promise<void> {
    if (camperIds.length > 0) {
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

        const chargeIds = campers.map((camper) => camper.chargeId);

        const oneChargeId = campers[0].chargeId;
        for (let i = 0; i < chargeIds.length; i += 1) {
          if (chargeIds[i] !== oneChargeId) {
            throw new Error(
              `ChargeIds in [${chargeIds}] must all be the same.`,
            );
          }
        }

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
}

export default CamperService;
