import { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import IFileStorageService from "../interfaces/fileStorageService";
import {
  CreateCampDTO,
  CamperCSVInfoDTO,
  CampDTO,
  CampSessionDTO,
  UpdateCampSessionDTO,
  GetCampDTO,
  UpdateCampDTO,
  CreateCampSessionsDTO,
} from "../../types";

import ICampService from "../interfaces/campService";
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
            id: campSession.id,
            capacity: campSession.capacity,
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

  async updateCampById(campId: string, camp: UpdateCampDTO): Promise<CampDTO> {
    let oldCamp: Camp | null;

    try {
      oldCamp = await MgCamp.findByIdAndUpdate(campId, {
        $set: {
          name: camp.name,
          ageLower: camp.ageLower,
          ageUpper: camp.ageUpper,
          description: camp.description,
          location: camp.location,
          fee: camp.fee,
        },
      });
      if (!oldCamp) {
        throw new Error(`Camp' with campId ${campId} not found.`);
      }
    } catch (error: unknown) {
      Logger.error(`Failed to update camp. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return {
      id: campId,
      ageLower: camp.ageLower,
      ageUpper: camp.ageUpper,
      campSessions: oldCamp.campSessions.map((session) => session.toString()),
      name: camp.name,
      description: camp.description,
      location: camp.location,
      fee: camp.fee,
      formQuestions: oldCamp.formQuestions.map((formQuestion) =>
        formQuestion.toString(),
      ),
    };
  }

  async createCampSessions(
    campId: string,
    campSessions: CreateCampSessionsDTO,
  ): Promise<CampSessionDTO[]> {
    const insertCampSessions: Omit<CampSessionDTO, "id">[] = [];
    campSessions.forEach((campSession) => {
      insertCampSessions.push({
        camp: campId,
        campers: [],
        capacity: campSession.capacity,
        waitlist: [],
        dates: campSession.dates.sort(),
        startTime: campSession.startTime,
        endTime: campSession.endTime,
        active: campSession.active,
      });
    });

    let newCampSessions: Array<CampSession> = [];
    let newCampSessionsIds: Array<string>;

    try {
      newCampSessions = await MgCampSession.insertMany(insertCampSessions);
      newCampSessionsIds = newCampSessions.map((session) => session.id);
      await MgCamp.findByIdAndUpdate(
        campId,
        {
          $push: { campSessions: newCampSessionsIds },
        },
        { runValidators: true },
      );
    } catch (error: unknown) {
      try {
        Promise.all(
          newCampSessions.map(async (session) => {
            MgCampSession.findByIdAndDelete(session.id);
          }),
        );
      } catch (rollbackError: unknown) {
        Logger.error(
          `Failed to rollback camp session creation error. Reason = ${getErrorMessage(
            rollbackError,
          )}`,
        );
      }

      Logger.error(
        `Failed to create CampSession. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }

    return newCampSessions.map(
      (session) =>
        <CampSessionDTO>{
          id: session.id,
          camp: campId,
          campers: [],
          capacity: session.capacity,
          waitlist: [],
          dates: session.dates.map((date) => date.toString()),
          startTime: session.startTime,
          endTime: session.endTime,
          active: session.active,
        },
    );
  }

  async updateCampSessionById(
    campId: string,
    campSessionId: string,
    campSession: UpdateCampSessionDTO,
  ): Promise<CampSessionDTO> {
    try {
      const oldCamp: Camp | null = await MgCamp.findById(campId);
      if (!oldCamp) {
        throw new Error(`Camp with campId ${campId} not found.`);
      }
      const oldSessions = oldCamp.campSessions as Schema.Types.ObjectId[];
      if (
        !oldSessions.find((session) => session.toString() === campSessionId)
      ) {
        throw new Error(
          `CampSession with campSessionId ${campSessionId} not found for Camp with id ${campId}.`,
        );
      }

      const newCampSession: CampSession | null = await MgCampSession.findByIdAndUpdate(
        campSessionId,
        {
          capacity: campSession.capacity,
          dates: campSession.dates.sort(),
          startTime: campSession.startTime,
          endTime: campSession.endTime,
          active: campSession.active,
        },
        { runValidators: true, new: true },
      );

      if (!newCampSession) {
        throw new Error(
          `CampSession with campSessionId ${campSessionId} not found.`,
        );
      }

      return {
        id: campSessionId,
        camp: newCampSession.camp.toString(),
        campers: newCampSession.campers.map((camper) => camper.toString()),
        capacity: newCampSession.capacity,
        waitlist: newCampSession.waitlist.map((camper) => camper.toString()),
        dates: newCampSession.dates.map((date) => date.toString()),
        startTime: newCampSession.startTime,
        endTime: newCampSession.endTime,
        active: newCampSession.active,
      };
    } catch (error: unknown) {
      Logger.error(
        `Failed to edit CampSession. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async deleteCampSessionById(
    campId: string,
    campSessionId: string,
  ): Promise<void> {
    try {
      const oldCamp: Camp | null = await MgCamp.findById(campId);
      if (!oldCamp) {
        throw new Error(`Camp with campId ${campId} not found.`);
      }
      const oldSessions = oldCamp.campSessions as Schema.Types.ObjectId[];
      if (
        !oldSessions.find((session) => session.toString() === campSessionId)
      ) {
        throw new Error(
          `CampSession with campSessionId ${campSessionId} not found for Camp with id ${campId}.`,
        );
      }
      const campSession = await MgCampSession.findByIdAndRemove(campSessionId);
      if (!campSession) {
        throw new Error(
          `CampSession' with campSessionID ${campSessionId} not found.`,
        );
      }
      await MgCamp.findByIdAndUpdate(campId, {
        $pullAll: { campSessions: [campSession.id] },
      });
    } catch (error: unknown) {
      Logger.error(
        `Failed to delete CampSession. Reason = ${getErrorMessage(error)}`,
      );
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
        description: camp.description,
        location: camp.location,
        fee: camp.fee,
        formQuestions: [],
        ...(camp.filePath && { fileName }),
      });

      /* eslint no-underscore-dangle: 0 */
      if (camp.formQuestions) {
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
      }

      if (camp.campSessions) {
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
      }

      try {
        await newCamp.save();
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

  async editCampSessionById(
    campSessionId: string,
    campSession: UpdateCampSessionDTO,
  ): Promise<CampSessionDTO> {
    try {
      const newCampSession: CampSession | null = await MgCampSession.findByIdAndUpdate(
        campSessionId,
        {
          capacity: campSession.capacity,
          dates: campSession.dates,
          startTime: campSession.startTime,
          endTime: campSession.endTime,
          active: campSession.active,
        },
        { runValidators: true, new: true },
      );

      if (!newCampSession) {
        throw new Error(
          `CampSession with campSessionId ${campSessionId} not found.`,
        );
      }

      return {
        id: campSessionId,
        camp: newCampSession.camp.toString(),
        campers: newCampSession.campers.map((camper) => camper.toString()),
        capacity: newCampSession.capacity,
        waitlist: newCampSession.waitlist.map((camper) => camper.toString()),
        dates: newCampSession.dates.map((date) => date.toString()),
        startTime: newCampSession.startTime,
        endTime: newCampSession.endTime,
        active: newCampSession.active,
      };
    } catch (error: unknown) {
      Logger.error(
        `Failed to edit CampSession. Reason = ${getErrorMessage(error)}`,
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
