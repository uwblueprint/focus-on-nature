import MgCamp, { Camp } from "../../models/camp.model";
import { Camper } from "../../models/camper.model";
import { CamperCSVInfoDTO } from "../../types";
import { getErrorMessage } from "../../utilities/errorUtils";
import ICampService from "../interfaces/campService";

import logger from "../../utilities/logger";
import { generateCSV } from "../../utilities/CSVUtils";

const Logger = logger(__filename);

class CampService implements ICampService {
  async getCampersByCampId(campId: string): Promise<CamperCSVInfoDTO[]> {
    try {
      const camp: Camp | null = await MgCamp.findById(campId);
      if (!camp) {
        throw new Error(`Camp with id ${campId} not found.`);
      }
      const campers: Camper[] = camp.populate("campers");
      return campers.map((camper) => ({
        id: camper.id,
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
      }));
    } catch (error: unknown) {
      Logger.error(
        `Failed to get entities. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async generateCampersCSV(campId: string): Promise<string> {
    try {
      const camper = await this.getCampersByCampId(campId);
      const fields = camper.length > 0 ? Object.keys(camper[0]) : [];

      const csvString = await generateCSV({ data: camper, fields });

      return csvString;
    } catch (error: unknown) {
      Logger.error(
        `Failed to generate CSV. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }
}

export default CampService;
