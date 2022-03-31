import {
  CreateCampDTO,
  CampDTO,
  CamperCSVInfoDTO,
  GetCampDTO,
  FormQuestionDTO,
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
  /* eslint-disable class-methods-use-this */
  async getCamps(): Promise<GetCampDTO[]> {
    try {
      const camps: Camp[] | null = await MgCamp.find({})
        .populate({
          path: "campSessions",
          model: MgCampSession,
          populate: {
            path: "campers",
            model: MgCamper,
          },
        })
        .populate({
          path: "formQuestions",
          model: MgFormQuestion,
        });

      if (!camps) {
        return [];
      }

      return camps.map((camp) => {
        const formQuestionArr = camp.formQuestions as FormQuestion[];
        const formQuestions = formQuestionArr.map(
          (formQuestion: FormQuestion) => {
            const {
              id,
              type,
              question,
              required,
              description,
              options,
            } = formQuestion;
            let result: FormQuestionDTO = { id, type, question, required };
            if (description) {
              result = { ...result, description };
            }
            if (options) {
              result = { ...result, options };
            }

            return result;
          },
        );
        const campSessionsArr = camp.campSessions as CampSession[];
        const campSessions = campSessionsArr.map((campSession) => ({
          dates: campSession.dates.map((date) => date.toString()),
          startTime: campSession.startTime,
          endTime: campSession.endTime,
          active: campSession.active,
        }));

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

  async getCampersByCampId(campId: string): Promise<CamperCSVInfoDTO[]> {
    try {
      const camp: CampSession | null = await MgCampSession.findById(
        campId,
      ).populate({
        path: "campers",
        model: MgCamper,
      });

      if (!camp) {
        throw new Error(`Camp with id ${campId} not found.`);
      }
      const campers = camp.campers as Camper[];

      return await Promise.all(
        campers.map(async (camper) => {
          const { formResponses } = camper;
          const formResponseObject: { [key: string]: string } = {};
          const formQuestionsPromise = Array.from(formResponses.keys()).map(
            (questionId) => {
              return MgFormQuestion.findById(questionId, "question");
            },
          );
          const formQuestions = await Promise.all(formQuestionsPromise);
          formQuestions.forEach((formQuestion) => {
            if (formQuestion) {
              const { id, question } = formQuestion;
              const answer = formResponses.get(id) as string;

              formResponseObject[question] = answer;
            }
          });
          return {
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
      newCamp = new MgCamp({
        name: camp.name,
        ageLower: camp.ageLower,
        ageUpper: camp.ageUpper,
        capacity: camp.capacity,
        description: camp.description,
        location: camp.location,
        fee: camp.fee,
        formQuestions: [],
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
