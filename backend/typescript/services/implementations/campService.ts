import { v4 as uuidv4 } from "uuid";
import { CreateCampDTO, CampDTO, CamperCSVInfoDTO } from "../../types";
import ICampService from "../interfaces/campService";
import IFileStorageService from "../interfaces/fileStorageService";
import MgCamp, { Camp } from "../../models/camp.model";
import MgCamper, { Camper } from "../../models/camper.model";
import { getErrorMessage } from "../../utilities/errorUtils";
import { generateCSV } from "../../utilities/CSVUtils";
import logger from "../../utilities/logger";
import MgBaseCamp, { BaseCamp } from "../../models/baseCamp.model";
import MgFormQuestion from "../../models/formQuestion.model";

const Logger = logger(__filename);

class CampService implements ICampService {
  storageService: IFileStorageService;

  constructor(storageService: IFileStorageService) {
    this.storageService = storageService;
  }

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
        registrationDate: camper.registrationDate,
        hasPaid: camper.hasPaid,
        chargeId: camper.chargeId,
        formResponses: camper.formResponses,
      }));
    } catch (error: unknown) {
      Logger.error(
        `Failed to get entities. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async createCamp(camp: CreateCampDTO): Promise<CampDTO> {
    let baseCamp: BaseCamp;
    let newCamp: Camp;
    const formQuestionIDs: string[] = [];
    try {
      const fileName = camp.filePath ? uuidv4() : "";
      if (camp.filePath) {
        await this.storageService.createFile(
          fileName,
          camp.filePath,
          camp.fileContentType,
        );
      }
      await Promise.all(
        camp.formQuestions.map(async (formQuestion, i) => {
          const question = await MgFormQuestion.create({
            type: formQuestion.type,
            question: formQuestion.question,
            required: formQuestion.required,
            description: formQuestion.description,
            options: formQuestion.options,
          });
          formQuestionIDs[i] = question._id;
        }),
      );

      baseCamp = new MgBaseCamp({
        name: camp.name,
        ageLower: camp.ageLower,
        ageUpper: camp.ageUpper,
        description: camp.description,
        location: camp.location,
        fee: camp.fee,
        formQuestions: formQuestionIDs,
      });
      const newCampObj = {
        baseCamp,
        campers: [],
        capacity: camp.capacity,
        waitlist: [],
        startTime: camp.startTime,
        endTime: camp.endTime,
        dates: camp.dates,
        active: camp.active,
      };

      newCamp = new MgCamp({
        ...newCampObj,
        ...(camp.filePath && { fileName }),
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
        // rollback incomplete camp creation
        formQuestionIDs.forEach((formQuestionID) =>
          MgFormQuestion.deleteOne({ _id: formQuestionID }),
        );

        MgCamp.findByIdAndDelete(baseCamp.id);

        MgBaseCamp.findByIdAndDelete(newCamp.id);

        Logger.error(
          `Failed to create camp. Reason = ${getErrorMessage(error)}`,
        );
        throw error;
      }
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
      fileName: newCamp.fileName,
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
