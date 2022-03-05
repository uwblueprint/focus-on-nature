import {
  CreateCampDTO,
  CampDTO,
  CamperCSVInfoDTO,
  GetCampDTO,
} from "../../types";
import ICampService from "../interfaces/campService";
import MgCamp, { Camp } from "../../models/camp.model";
import MgCamper, { Camper } from "../../models/camper.model";
import { getErrorMessage } from "../../utilities/errorUtils";
import { generateCSV } from "../../utilities/CSVUtils";
import logger from "../../utilities/logger";
import MgBaseCamp, { BaseCamp } from "../../models/baseCamp.model";

const Logger = logger(__filename);

class CampService implements ICampService {
  /* eslint-disable class-methods-use-this */
  async getCamps(): Promise<GetCampDTO[]> {
    try {
      const camps: Camp[] | null = await MgCamp.find({}).populate("baseCamp");

      if (!camps) {
        return [];
      }

      return camps.map((camp) => {
        const baseCamp = camp.baseCamp as BaseCamp;
        return {
          id: camp.id,
          name: baseCamp.name,
          description: baseCamp.description,
          location: baseCamp.location,
          fee: baseCamp.fee,
          ageLower: baseCamp.ageLower,
          ageUpper: baseCamp.ageUpper,
          camperInfo: baseCamp.camperInfo,
          capacity: camp.capacity,
          dates: camp.dates.map((date) => date.toString()),
          startTime: camp.startTime,
          endTime: camp.endTime,
          active: camp.active,
        };
      });
    } catch (error: unknown) {
      Logger.error(`Failed to get camps. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

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
        contactName: camper.contactName,
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

  async createCamp(camp: CreateCampDTO): Promise<CampDTO> {
    const baseCamp = new MgBaseCamp({
      name: camp.name,
      ageLower: camp.ageLower,
      ageUpper: camp.ageUpper,
      description: camp.description,
      location: camp.location,
      fee: camp.fee,
      camperInfo: camp.camperInfo,
    });
    const newCamp = new MgCamp({
      baseCamp,
      campers: [],
      capacity: camp.capacity,
      waitlist: [],
      startTime: camp.startTime,
      endTime: camp.endTime,
      dates: camp.dates,
      active: camp.active,
    });

    try {
      /* eslint no-underscore-dangle: 0 */

      baseCamp.camps.push(newCamp._id);
      await baseCamp.save((err) => {
        if (err) throw err;
      });
      await newCamp.save((err) => {
        if (err) throw err;
      });
    } catch (error: unknown) {
      Logger.error(`Failed to create camp. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
    return {
      /* eslint no-underscore-dangle: 0 */
      id: newCamp._id,
      baseCamp: baseCamp.id,
      campers: newCamp.campers.map((camper) => camper.toString()),
      capacity: newCamp.capacity,
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
