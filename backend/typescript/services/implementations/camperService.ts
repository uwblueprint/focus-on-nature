import ICamperService from "../interfaces/camperService";
import MgCamper, { Camper } from "../../models/camper.model";
import { CreateCamperDTO, CamperDTO } from "../../types";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";

const Logger = logger(__filename);

class CamperService implements ICamperService {
  /* eslint-disable class-methods-use-this */
  async createCamper(camper: CreateCamperDTO): Promise<CamperDTO> {
    let newCamper: Camper;
    try {
      newCamper = await MgCamper.create({
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
      });
    } catch (mongoDbError) {
      Logger.error(
        `Failed to create camper. Reason: ${getErrorMessage(mongoDbError)}`,
      );
      throw mongoDbError;
    }

    return {
      id: newCamper.id,
      firstName: newCamper.firstName,
      lastName: newCamper.lastName,
      age: newCamper.age,
      parentName: newCamper.parentName,
      contactEmail: newCamper.contactEmail,
      contactNumber: newCamper.contactNumber,
      camps: newCamper.camps, // why is DTO's camps different from model's + how to convert?
      hasCamera: newCamper.hasCamera,
      hasLaptop: newCamper.hasLaptop,
      allergies: newCamper.allergies,
      additionalDetails: newCamper.additionalDetails,
      dropOffType: newCamper.dropOffType,
      registrationDate: newCamper.registrationDate,
      hasPaid: newCamper.hasPaid,
      chargeId: newCamper.chargeId,
    };
  }
}

export default CamperService;
