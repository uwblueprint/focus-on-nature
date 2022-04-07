import { v4 as uuidv4 } from "uuid";
import ICampService from "../interfaces/campService";
import IFileStorageService from "../interfaces/fileStorageService";
import {
  CreateCampDTO,
  CampDTO,
  CamperCSVInfoDTO,
  GetCampDTO,
} from "../../types";
import { getErrorMessage } from "../../utilities/errorUtils";
import { generateCSV } from "../../utilities/CSVUtils";
import logger from "../../utilities/logger";
import MgCamp, { Camp } from "../../models/camp.model";
import MgCampSession, { CampSession } from "../../models/campSession.model";
import MgFormQuestion, { FormQuestion } from "../../models/formQuestion.model";
import MgCamper, { Camper } from "../../models/camper.model";

const Logger = logger(__filename);

class CampService implements ICampService {
  storageService: IFileStorageService;

  constructor(storageService: IFileStorageService) {
    this.storageService = storageService;
  }

  /* eslint-disable class-methods-use-this */
  async getCamps(): Promise<GetCampDTO[]> {
    try {
      const camps: Camp[] | null = await MgCamp.find({})
        .populate({
          path: "campSessions",
          model: MgCampSession,
        })
        .populate({
          path: "formQuestions",
          model: MgFormQuestion,
        });

      if (!camps) {
        return [];
      }

      return camps.map((camp) => {
        const formQuestions = (camp.formQuestions as FormQuestion[]).map(
          (formQuestion: FormQuestion) => {
            return {
              id: formQuestion.id,
              type: formQuestion.type,
              question: formQuestion.question,
              required: formQuestion.required,
              description: formQuestion.description,
              options: formQuestion.options,
            };
          },
        );

        const campSessions = (camp.campSessions as CampSession[]).map(
          (campSession) => ({
            dates: campSession.dates.map((date) => date.toString()),
            startTime: campSession.startTime,
            endTime: campSession.endTime,
            registrations: campSession.campers.length,
            waitlist: campSession.waitlist.length,
            active: campSession.active,
          }),
        );

        return {
          id: camp.id,
          ageLower: camp.ageLower,
          ageUpper: camp.ageUpper,
          capacity: camp.capacity,
          name: camp.name,
          description: camp.description,
          location: camp.location,
          fee: camp.fee,
          formQuestions,
          campSessions,
        };
      });
    } catch (error: unknown) {
      Logger.error(`Failed to get camps. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getCampersByCampSessionId(
    campSessionId: string,
  ): Promise<CamperCSVInfoDTO[]> {
    try {
      const campSession: CampSession | null = await MgCampSession.findById(
        campSessionId,
      ).populate({
        path: "campers",
        model: MgCamper,
      });

      if (!campSession) {
        throw new Error(`Camp with id ${campSessionId} not found.`);
      }
      const campers = campSession.campers as Camper[];

      const questionIds = new Set(
        campers.length > 0
          ? campers.reduce((prevCamper, currCamper) => {
              return [
                ...prevCamper,
                ...Array.from(currCamper.formResponses.keys()),
              ];
            }, Array.from(campers[0].formResponses.keys()))
          : [],
      );

      const formQuestions = await MgFormQuestion.find({
        _id: Array.from(questionIds),
      });

      const formQuestionMap: { [id: string]: string } = {};

      formQuestions.forEach((formQuestion) => {
        formQuestionMap[formQuestion._id] = formQuestion.question;
      });

      return await Promise.all(
        campers.map(async (camper) => {
          const { formResponses } = camper;
          const formResponseObject: { [key: string]: string } = {};

          Array.from(formResponses.keys()).forEach((questionId) => {
            const question = formQuestionMap[questionId];
            const answer = formResponses.get(questionId);
            formResponseObject[question] = answer as string;
          });

          return {
            firstName: camper.firstName,
            lastName: camper.lastName,
            age: camper.age,
            allergies: camper.allergies,
            hasCamera: camper.hasCamera,
            hasLaptop: camper.hasLaptop,
            earlyDropoff: camper.earlyDropoff,
            latePickup: camper.latePickup,
            specialNeeds: camper.specialNeeds,
            contacts: camper.contacts,
            formResponses: formResponseObject,
            registrationDate: camper.registrationDate,
            hasPaid: camper.hasPaid,
            chargeId: camper.chargeId,
          };
        }),
      );
    } catch (error: unknown) {
      Logger.error(`Failed to get campers. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async createCamp(camp: CreateCampDTO): Promise<CampDTO> {
    let newCamp: Camp;

    try {
      const fileName = camp.filePath ? uuidv4() : "";
      if (camp.filePath) {
        await this.storageService.createFile(
          fileName,
          camp.filePath,
          camp.fileContentType,
        );
      }
      newCamp = new MgCamp({
        name: camp.name,
        ageLower: camp.ageLower,
        ageUpper: camp.ageUpper,
        capacity: camp.capacity,
        description: camp.description,
        location: camp.location,
        fee: camp.fee,
        formQuestions: [],
        ...(camp.filePath && { fileName }),
      });
      /* eslint no-underscore-dangle: 0 */
      await Promise.all(
        camp.formQuestions.map(async (formQuestion, i) => {
          const question = await MgFormQuestion.create({
            type: formQuestion.type,
            question: formQuestion.question,
            required: formQuestion.required,
            description: formQuestion.description,
            options: formQuestion.options,
          });
          newCamp.formQuestions[i] = question._id;
        }),
      );

      await Promise.all(
        camp.campSessions.map(async (campSession, i) => {
          const session = await MgCampSession.create({
            camp: newCamp,
            campers: [],
            waitlist: [],
            startTime: campSession.startTime,
            endTime: campSession.endTime,
            dates: campSession.dates,
            active: campSession.active,
          });
          newCamp.campSessions[i] = session._id;
        }),
      );

      try {
        await newCamp.save((err) => {
          if (err) throw err;
        });
      } catch (error: unknown) {
        // rollback incomplete camp creation

        try {
          newCamp.formQuestions.forEach((formQuestionID) =>
            MgFormQuestion.findByIdAndDelete(formQuestionID),
          );
          newCamp.campSessions.forEach((campSessionID) =>
            MgCampSession.findByIdAndDelete(campSessionID),
          );

          MgCamp.findByIdAndDelete(newCamp.id);
        } catch (rollbackError: unknown) {
          Logger.error(
            `Failed to rollback camp creation error. Reason = ${getErrorMessage(
              rollbackError,
            )}`,
          );
        }

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
      id: newCamp.id,
      ageLower: newCamp.ageLower,
      ageUpper: newCamp.ageUpper,
      campSessions: newCamp.campSessions.map((session) => session.toString()),
      capacity: newCamp.capacity,
      name: newCamp.name,
      description: newCamp.description,
      location: newCamp.location,
      fee: newCamp.fee,
      formQuestions: newCamp.formQuestions.map((formQuestion) =>
        formQuestion.toString(),
      ),
      fileName: newCamp.fileName,
    };
  }

  async deleteCampSessionById(campSessionId: string): Promise<void> {
    try {
      const campSession = await MgCampSession.findByIdAndRemove(campSessionId);
      if (!campSession) {
        throw new Error(
          `CampSession' with campSessionID ${campSessionId} not found.`,
        );
      }
      await MgCamp.findByIdAndUpdate(campSession.camp, {
        $pullAll: { campSessions: [campSession.id] },
      });
    } catch (error: unknown) {
      Logger.error(
        `Failed to delete CampSession. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async generateCampersCSV(campSessionId: string): Promise<string> {
    try {
      const campers = await this.getCampersByCampSessionId(campSessionId);
      if (campers.length === 0) {
        // if there are no campers, we return an empty string
        return "";
      }
      let csvHeaders: string[] = [];
      const flattenedCampers = campers.map((camper) => {
        const { formResponses, ...formObj } = camper;
        // grabbing column names
        csvHeaders = [
          ...csvHeaders,
          ...Object.keys(formResponses),
          ...Object.keys(formObj),
        ];
        return {
          ...formResponses,
          ...formObj,
        };
      });
      csvHeaders = Array.from(new Set(csvHeaders));
      const csvString = await generateCSV({
        data: flattenedCampers,
        fields: csvHeaders,
      });
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
