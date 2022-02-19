import { CreateCampDTO, CampDTO, CamperCSVInfoDTO } from "../../types";
import ICampService from "../interfaces/campService";
import MgCamp, { Camp } from "../../models/camp.model";
import MgCamper, { Camper } from "../../models/camper.model";
import { getErrorMessage } from "../../utilities/errorUtils";
import { generateCSV } from "../../utilities/CSVUtils";
import logger from "../../utilities/logger";
import MgAbstractCamp from "../../models/abstractCamp.model";

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

  async getCamps(): Promise<any> {
    try {
      const camps = MgCamp.find({}).populate('abstractCamp');
      if(!camps) {
        return [];
      }

      // const populatedCamps = 
      return camps.map((camp) => ({
        id: camp.id,
        abstractCamp: camp.abstractCamp,
        campers: camp.campers,
        waitlist: camp.waitlist,
        startDate: camp.startDate,
        endDate: camp.endDate,
        active: camp.active
      }));
    }
  }
  async createCamp(camp: CreateCampDTO, authId?: string): Promise<CampDTO> {
    var abstractCamp = new MgAbstractCamp({
      name: camp.name,
      description: camp.description,
      location: camp.location,
      capacity: camp.capacity,
      fee: camp.fee,
      camperInfo: camp.camperInfo,
    });
    var newCamp = new MgCamp({
      abstractCamp: abstractCamp,
      campers: camp.campers,
      waitlist: camp.waitlist,
      startDate: camp.startDate,
      endDate: camp.endDate,
      active: camp.active,
    });
    try {
      await abstractCamp.save(function (err) {
        throw err;
      });
      await newCamp.save(function (err) {
        throw err;
      });
    } catch (error: unknown) {
      Logger.error(`Failed to create camp. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return {
      id: newCamp._id,
      abstractCamp: abstractCamp.id,
      campers: newCamp.campers.map((camper) => camper.toString()),
      waitlist: newCamp.waitlist.map((camper) => camper.toString()),
      startDate: newCamp.startDate,
      endDate: newCamp.endDate,
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
