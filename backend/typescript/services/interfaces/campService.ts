import mongoose from "mongoose";
import {
  CampDTO,
  CamperCSVInfoDTO,
  CampSessionDTO,
  UpdateCampSessionDTO,
  GetCampDTO,
  CreateCampSessionsDTO,
  FormQuestionDTO,
  UpdateCampSessionsDTO,
  CreateFormQuestionDTO,
  CreateUpdateCampDTO,
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

  createCamp(camp: CreateUpdateCampDTO): Promise<CampDTO>;

  deleteCamp(campId: string): Promise<void>;

  updateCampById(campId: string, camp: CreateUpdateCampDTO): Promise<CampDTO>;

  deleteCampSessionById(campId: string, campSessionId: string): Promise<void>;

  deleteCampSessionsByIds(
    campId: string,
    campSessionIds: Array<string>,
    dbSession?: mongoose.ClientSession,
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
   * Creates new FormQuestions in the db and adds it to the formQuestions field in the camp
   * @param campId camp's id
   * @param formQuestions the form questions to be associated with camp
   * @param dbSession, optional parameter passed if session already exists.
   *        If this is the entrypoint method, called directly from the campRoutes,
   *        no session exists and the method will begin the transaction. If this is called as
   *        a utility method, the session was created previously and a transaction is therefore
   *        in progress.
   * @returns formQuestion ids that were successfully inserted
   * @throws Error if formQuestions cannot be inserted
   */
  addFormQuestionsToCamp(
    campId: string,
    formQuestions: CreateFormQuestionDTO[],
    dbSession?: mongoose.ClientSession,
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
   * deleteFormQuestionsByIds deletes the formQuestions provided
   * @param formQuestionIds the ids of the formQuestions to delete
   * @param dbSession an optional session object used by parent functions if this is part of a series of changes
   * @throws Error if formQuestions cannot be deleted
   */
  deleteFormQuestionsByIds(
    formQuestionIds: string[],
    dbSession: mongoose.ClientSession,
  ): Promise<void>;

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
