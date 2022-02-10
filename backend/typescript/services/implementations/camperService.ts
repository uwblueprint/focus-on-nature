import ICamperService from "../interfaces/camperService";
import MgUser, { Camper } from "../../models/camper.model";
import { CamperDTO, UpdateCamperDTO, DropOffType } from "../../types";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";

const Logger = logger(__filename);

class CamperService implements ICamperService {
  async updateCamperById(
    camperId: string,
    camper: UpdateCamperDTO,
  ): Promise<CamperDTO> {
    let oldCamper: Camper | null;

    try {
      // must explicitly specify runValidators when updating through findByIdAndUpdate
      oldCamper = await MgUser.findByIdAndUpdate(
        camperId,
        {
          firstName: camper.firstName,
          lastName: camper.lastName,
          age: camper.age,
          parentName: camper.parentName,
          contactEmail: camper.contactEmail,
          contactNumber: camper.contactNumber,
          camps: camper.camps,
          hasCamera: camper.hasCamera,
          hasLaptop: camper.hasLaptop,
          allergies: camper.allergies,
          additionalDetails: camper.additionalDetails,
          dropOffType: camper.dropOffType,
          registrationDate: camper.registrationDate,
          hasPaid: camper.hasPaid,
          chargeId: camper.chargeId,
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
      firstName: camper.firstName,
      lastName: camper.lastName,
      age: camper.age,
      parentName: camper.parentName,
      contactEmail: camper.contactEmail,
      contactNumber: camper.contactNumber,
      camps: camper.camps,
      hasCamera: camper.hasCamera,
      hasLaptop: camper.hasLaptop,
      allergies: camper.allergies,
      additionalDetails: camper.additionalDetails,
      dropOffType: camper.dropOffType,
      registrationDate: camper.registrationDate,
      hasPaid: camper.hasPaid,
      chargeId: camper.chargeId,
    };
  }
}

export default CamperService;
