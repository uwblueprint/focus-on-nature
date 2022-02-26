import { CreateCampDTO, CampDTO, CamperCSVInfoDTO } from "../../types";
import ICampService from "../interfaces/campService";
import MgCamp, { Camp } from "../../models/camp.model";
import MgCamper, { Camper } from "../../models/camper.model";
import { getErrorMessage } from "../../utilities/errorUtils";
import { generateCSV } from "../../utilities/CSVUtils";
import logger from "../../utilities/logger";
import MgBaseCamp from "../../models/baseCamp.model";

const Logger = logger(__filename);

class CampService implements ICampService {
  /* eslint-disable class-methods-use-this */
  async getCampersByCampId(campId: string): Promise<CamperCSVInfoDTO[]> {
    try {
      const camp: Camp | null = await MgCamp.findById(campId).populate({
        path: "campers",
        model: MgCamper,
      });

      if (!camp) {
        throw new Error(`Camp with id ${campId} not found.`);
      }

      const campers = camp.campers as Camper[];

      return campers.map((camper) => ({
        firstName: camper.firstName,
        lastName: camper.lastName,
        age: camper.age,
        parentName: camper.parentName,
        contactEmail: camper.contactEmail,
        contactNumber: camper.contactNumber,
        contactName: camper.contactName,
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
      Logger.error(`Failed to get camps. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async createCamp(camp: CreateCampDTO, authId?: string): Promise<CampDTO> {
    const baseCamp = new MgBaseCamp({
      name: camp.name,
      description: camp.description,
      location: camp.location,
      capacity: camp.capacity,
      fee: camp.fee,
      camperInfo: camp.camperInfo,
    });
    const newCamp = new MgCamp({
      baseCamp,
      campers: [],
      waitlist: [],
      startTime: camp.startTime,
      endTime: camp.endTime,
      dates: camp.dates,
      active: camp.active,
    });

    try {
      /*eslint no-underscore-dangle: "error"*/
      baseCamp.camps.push(newCamp._id);
      await baseCamp.save(function (err) {
        if (err) throw err;
      });
      await newCamp.save(function (err) {
        if (err) throw err;
      });
    } catch (error: unknown) {
      Logger.error(`Failed to create camp. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
    return {
      /*eslint no-underscore-dangle: "error"*/
      id: newCamp._id,
      baseCamp: baseCamp.id,
      campers: newCamp.campers.map((camper) => camper.toString()),
      dates: newCamp.dates.map((date) => date.toString()),
      waitlist: newCamp.waitlist.map((camper) => camper.toString()),
      startTime: newCamp.startTime.toString(),
      endTime: newCamp.endTime.toString(),
      active: newCamp.active,
    };
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
