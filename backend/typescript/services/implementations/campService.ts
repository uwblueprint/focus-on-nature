import { CamperCSVInfoDTO } from "../../types";
import ICampService from "../interfaces/campService";
import MgCamp, { Camp } from "../../models/camp.model";
import MgCamper, { Camper } from "../../models/camper.model";
import { getErrorMessage } from "../../utilities/errorUtils";
import { generateCSV } from "../../utilities/CSVUtils";
import logger from "../../utilities/logger";

const Logger = logger(__filename);

class CampService implements ICampService {
  /* eslint-disable class-methods-use-this */
  async getCampersByCampId(campId: string): Promise<CamperCSVInfoDTO[]> {
    try {
      const camp: Camp | null = await MgCamp.findById(campId);
      if (!camp) {
        throw new Error(`Camp with id ${campId} not found.`);
      }

      const populatedCamp = await camp
        .populate({ path: "campers", model: MgCamper })
        .execPopulate();

      const campers = populatedCamp.campers as Camper[];

      return campers.map((camper) => ({
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

  async createCamp(user: CreateCampDTO, authId?: string): Promise<CampDTO> {
    return "";
  }
  async generateCampersCSV(campId: string): Promise<string> {
    try {
      const campers = await this.getCampersByCampId(campId);
      if (campers.length === 0) {
        // if there are no campers, we return an empty string
        return "";
      }
      // grabbing column names
      const fields = Object.keys(campers[0]);
      const csvString = await generateCSV({ data: campers, fields });
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
