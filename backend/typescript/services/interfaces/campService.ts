import {
  CampDTO,
  CamperCSVInfoDTO,
  CampSessionDTO,
  CreateCampDTO,
  UpdateCampSessionDTO,
  GetCampDTO,
  UpdateCampDTO,
  CreateCampSessionsDTO,
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

  deleteCamp(campId: string): Promise<void>;

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
}

export default ICampService;
