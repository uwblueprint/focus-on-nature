import mongoose from "mongoose";
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
import MgFormQuestion, { FormQuestion } from "../../models/formQuestion.model";

const Logger = logger(__filename);

class CampService implements ICampService {
  /* eslint-disable class-methods-use-this */
  async getCamps(): Promise<GetCampDTO[]> {
    try {
      const camps: Camp[] | null = await MgCamp.find({}).populate({
        path: "baseCamp",
        model: MgBaseCamp,
      });

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

      let camperCsvInfo: CamperCSVInfoDTO[] = [];

      for (let camper of campers) {
        const formResponses = camper.formResponses;
        let formResponseObject: { [key: string]: string } = {};
        for (const questionId of Array.from(formResponses.keys())) {
          const formQuestion = await MgFormQuestion.findById(
            questionId,
            "question",
          );

          if (!formQuestion) continue;
          const { question } = formQuestion;
          const answer = formResponses.get(questionId) as string;

          formResponseObject[question] = answer;

          camperCsvInfo.push({
            formResponses: formResponseObject,
            dropOffType: camper.dropOffType,
            registrationDate: camper.registrationDate,
            hasPaid: camper.hasPaid,
            chargeId: camper.chargeId,
          });
        }
      }
      return camperCsvInfo;
    } catch (error: unknown) {
      Logger.error(`Failed to get campers. Reason = ${getErrorMessage(error)}`);
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

      const flattenedCampers = campers.map((camper) => {
        const { formResponses, ...formObj } = camper;
        return {
          ...formResponses,
          ...formObj,
        };
      });
      // grabbing column names
      const fields = Object.keys(flattenedCampers[0]);
      const csvString = await generateCSV({ data: flattenedCampers, fields });
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
