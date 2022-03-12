import mongoose from "mongoose";
import ICamperService from "../interfaces/camperService";
import MgCamper, { Camper } from "../../models/camper.model";
import MgCamp, { Camp } from "../../models/camp.model";
import { CreateCamperDTO, UpdateCamperDTO, CamperDTO } from "../../types";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";

const Logger = logger(__filename);

class CamperService implements ICamperService {
  /* eslint-disable class-methods-use-this */
  async updateCamperById(
    camperId: string,
    camper: UpdateCamperDTO,
  ): Promise<CamperDTO> {
    let oldCamper: Camper | null;

    try {
      oldCamper = await MgCamper.findById(camperId);

      if (oldCamper) {
        const newCamp: Camp | null = await MgCamp.findById(camper.camp);
        const oldCamp: Camp | null = await MgCamp.findById(oldCamper.camp);

        /* if (!newCamp) {
          throw new Error(`Error: new camp does not exist`);
        }

        if (!oldCamp) {
          throw new Error(`Error: old camp does not exist`);
        } */

        if (
          newCamp &&
          oldCamp &&
          newCamp.baseCamp.toString() !== oldCamp.baseCamp.toString()
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
          // camp: camper.camp,
          formResponses: camper.formResponses,
          dropOffType: camper.dropOffType,
          registrationDate: camper.registrationDate,
          hasPaid: camper.hasPaid,
          chargeId: camper.chargeId,
        },
        { runValidators: true, omitUndefined: true },
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
      camp: camper.camp,
      formResponses: camper.formResponses,
      dropOffType: camper.dropOffType,
      registrationDate: camper.registrationDate,
      hasPaid: camper.hasPaid,
      chargeId: camper.chargeId,
    };
  }
}

export default CamperService;
