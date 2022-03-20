import { CreateCampDTO, CamperCSVInfoDTO, CampSessionDTO } from "../../types";
import ICampService from "../interfaces/campService";
import MgCampSession, { CampSession } from "../../models/campSession.model";
import MgCamper, { Camper } from "../../models/camper.model";
import { getErrorMessage } from "../../utilities/errorUtils";
import { generateCSV } from "../../utilities/CSVUtils";
import logger from "../../utilities/logger";
import MgCamp, { Camp } from "../../models/camp.model";
import MgFormQuestion from "../../models/formQuestion.model";

const Logger = logger(__filename);

class CampService implements ICampService {
  /* eslint-disable class-methods-use-this */
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

  async createCamp(camp: CreateCampDTO): Promise<CampSessionDTO> {
    let newCamp: Camp;
    let session: CampSession;
    const formQuestionIDs: string[] = [];
    try {
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

      newCamp = new MgCamp({
        name: camp.name,
        ageLower: camp.ageLower,
        ageUpper: camp.ageUpper,
        description: camp.description,
        location: camp.location,
        fee: camp.fee,
        formQuestions: formQuestionIDs,
      });

      session = new MgCampSession({
        camp: newCamp,
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
        newCamp.campSessions.push(session._id);

        await session.save((err) => {
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

        MgCampSession.findByIdAndDelete(session.id);

        MgCamp.findByIdAndDelete(newCamp.id);

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
      id: session._id,
      camp: newCamp.id,
      campers: session.campers.map((camper) => camper.toString()),
      capacity: session.capacity,
      dates: session.dates.map((date) => date.toString()),
      waitlist: session.waitlist.map((camper) => camper.toString()),
      startTime: session.startTime.toString(),
      endTime: session.endTime.toString(),
      active: session.active,
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
