import mongoose from "mongoose";
import {
  CampDTO,
  CamperCSVInfoDTO,
  CampSessionDTO,
  CreateCampDTO,
  UpdateCampSessionDTO,
  GetCampDTO,
  UpdateCampDTO,
  CreateCampSessionsDTO,
  FormQuestionDTO,
  UpdateCampSessionsDTO,
} from "../../types";

interface ICampService {
  /**
   * Get all camps
   * @param
   * @returns array of getCampDTO object containing camp information
   * @throws Error if camp retrieval fails
   */
  getCamps(campYear: number): Promise<GetCampDTO[]>;

  /**
   * Get camp with the specified campId
   * @param campId camp's id
   * @param campSessionId request query "session" for only one camp session shown
   * @param waitlistedCamperId request query "wId" for waitlisted campers signing up
   * @returns a CampDTO
   * @throws Error if camper retrieval fails
   */
  getCampById(
    campId: string,
    campSessionId?: string,
    waitlistedCamperId?: string,
  ): Promise<GetCampDTO>;

  createCamp(camp: CreateCampDTO): Promise<CampDTO>;

  deleteCamp(campId: string): Promise<void>;

  updateCampById(campId: string, camp: UpdateCampDTO): Promise<CampDTO>;

  deleteCampSessionById(campId: string, campSessionId: string): Promise<void>;

  deleteCampSessionsByIds(
    campId: string,
    campSessionIds: Array<string>,
  ): Promise<void>;

  createCampSessions(
    campId: string,
    campSessions: CreateCampSessionsDTO,
    dbSession?: mongoose.ClientSession,
  ): Promise<CampSessionDTO[]>;

  updateCampSessionById(
    campId: string,
    campSessionId: string,
    campSession: UpdateCampSessionDTO,
  ): Promise<CampSessionDTO>;

  updateCampSessionsByIds(
    campId: string,
    updatedCampSessions: Array<UpdateCampSessionsDTO>,
  ): Promise<Array<CampSessionDTO>>;

  /**
   * Get all campers associated with camp session of id campSessionId for CSV file generation
   * @param campSessionId camp's session id
   * @returns array of CamperCSVInfoDTO object containing campers information
   * @throws Error if camper retrieval fails
   */
  getCampersByCampSessionId(campSessionId: string): Promise<CamperCSVInfoDTO[]>;

  /**
   * Generates CSV string containg all the campers associated with a camp
   * @param campId camp's id
   * @returns CSV string
   * @throws Error if CSV generation fails
   */
  generateCampersCSV(campId: string): Promise<string>;

  /**
   * Adds form questions to db
   * @param campId camp's id
   * @param formQuestions the form questions to be associated with camp
   * @returns formQuestion ids that were successfully inserted
   * @throws Error if formQuestions cannot be inserted
   */
  createFormQuestions(
    campId: string,
    formQuestions: FormQuestionDTO[],
  ): Promise<string[]>;

  /**
   * Edits form question associated with a camp
   * @param formQuestionId form question to edit's id
   * @param formQuestion the data to replace it with
   * @returns successfully edited form question
   * @throws Error if formQuestions cannot be edited
   */
  editFormQuestion(
    formQuestionId: string,
    formQuestion: FormQuestionDTO,
  ): Promise<FormQuestionDTO>;

  /**
   * Delete a form question
   * @param campId camp's id
   * @param formQuestionId form question to edit's id
   * @returns successfully deleted form question
   * @throws Error if formQuestions cannot be found or deleted
   */
  deleteFormQuestion(campId: string, formQuestionId: string): Promise<void>;

  /**
   * Append form questions to existing camp
   * @param campId camp's id
   * @param formQuestions the form questions to be added
   * @returns successfully appended form questions
   * @throws Error if formQuestions cannot be appended
   */
  appendFormQuestions(
    campId: string,
    formQuestions: FormQuestionDTO[],
  ): Promise<string[]>;
}

export default ICampService;
