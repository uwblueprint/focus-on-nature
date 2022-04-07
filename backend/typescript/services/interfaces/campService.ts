import {
  CampDTO,
  CamperCSVInfoDTO,
  CreateCampDTO,
  GetCampDTO,
} from "../../types";

interface ICampService {
  /**
   * Get all camps
   * @param
   * @returns array of getCampDTO object containing camp information
   * @throws Error if camp retrieval fails
   */
  getCamps(campStatus: string, campYear: number): Promise<GetCampDTO[]>;

  /**
   * Get all campers associated with camps of id campId
   * @param campId camp's id
   * @returns array of CamperCSVInfoDTO object containing campers information
   * @throws Error if camper retrieval fails
   */
  getCampersByCampId(campId: string): Promise<CamperCSVInfoDTO[]>;

  createCamp(user: CreateCampDTO): Promise<CampDTO>;

  //  createBaseCamp(user: CreateCampDTO, authId?: string): Promise<CampDTO>;

  /**
   * Generates CSV string containg all the campers associated with a camp
   * @param campId camp's id
   * @returns CSV string
   * @throws Error if CSV generation fails
   */
  generateCampersCSV(campId: string): Promise<string>;
}

export default ICampService;
