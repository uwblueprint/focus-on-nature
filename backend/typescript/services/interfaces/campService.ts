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
} from "../../types";

interface ICampService {
  /**
   * Get all camps
   * @param
   * @returns array of getCampDTO object containing camp information
   * @throws Error if camp retrieval fails
   */
  getCamps(): Promise<GetCampDTO[]>;

  createCamp(camp: CreateCampDTO): Promise<CampDTO>;

  updateCampById(campId: string, camp: UpdateCampDTO): Promise<CampDTO>;

  deleteCampSessionById(campId: string, campSessionId: string): Promise<void>;

  createCampSessions(
    campId: string,
    campSessions: CreateCampSessionsDTO,
  ): Promise<CampSessionDTO[]>;

  updateCampSessionById(
    campId: string,
    campSessionId: string,
    campSession: UpdateCampSessionDTO,
  ): Promise<CampSessionDTO>;

  /**
   * Get all campers associated with camps of id campId
   * @param campId camp's id
   * @returns array of CamperCSVInfoDTO object containing campers information
   * @throws Error if camper retrieval fails
   */
  getCampersByCampSessionId(campId: string): Promise<CamperCSVInfoDTO[]>;

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
}

export default ICampService;
