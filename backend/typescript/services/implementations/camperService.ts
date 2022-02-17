import ICamperService from "../interfaces/camperService";
import MgCamper, { Camper } from "../../models/camper.model";
import { CamperDTO, UpdateCamperDTO } from "../../types";
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
      // must explicitly specify runValidators when updating through findByIdAndUpdate
      oldCamper = await MgCamper.findByIdAndUpdate(
        camperId,
        {
          firstName: camper.firstName,
          lastName: camper.lastName,
          age: camper.age,
          parentName: camper.parentName,
          contactEmail: camper.contactEmail,
          contactNumber: camper.contactNumber,
          hasCamera: camper.hasCamera,
          hasLaptop: camper.hasLaptop,
          allergies: camper.allergies,
          additionalDetails: camper.additionalDetails,
          dropOffType: camper.dropOffType,
          registrationDate: camper.registrationDate,
          hasPaid: camper.hasPaid,
          chargeId: camper.chargeId,
        },
        { runValidators: true, omitUndefined: true }, // must omitUndefined if not all fields are passed
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
      firstName: oldCamper.firstName,
      lastName: oldCamper.lastName,
      age: oldCamper.age,
      parentName: oldCamper.parentName,
      contactEmail: oldCamper.contactEmail,
      contactNumber: oldCamper.contactNumber,
      camp: oldCamper.camp.toString(),
      hasCamera: oldCamper.hasCamera,
      hasLaptop: oldCamper.hasLaptop,
      allergies: oldCamper.allergies,
      additionalDetails: oldCamper.additionalDetails,
      dropOffType: oldCamper.dropOffType,
      registrationDate: oldCamper.registrationDate,
      hasPaid: oldCamper.hasPaid,
      chargeId: oldCamper.chargeId,
    };
  }
}

export default CamperService;
