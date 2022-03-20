import { CreateCamperDTO, CamperDTO } from "../../types";

interface ICamperService {
  /**
   * Create a camper
   * @param campers the campers to be created
   * @returns an array of CamperDTO with the created campers' information
   * @throws Error if user creation fails
   */
  createCamper(campers: CreateCamperDTO): Promise<Array<CamperDTO>>;

  /**
   * Get all campers and their information
   * @returns array of CamperDTOs
   * @throws Error if camper retrieval fails
   */
  getAllCampers(): Promise<Array<CamperDTO>>;

  /**
   * Get campers associated with camp id
   * @param campId camp's id
   * @returns array of CamperDTOs
   * @throws Error if camper retrieval fails
   */
  getCampersByCampId(campId: string): Promise<Array<CamperDTO>>;

  /**
   * Delete all campers associated with the charge ID
   * @param chargeId the charge ID for the payment
   * @throws Error if camper cancellation fails
   */
  deleteCampersByChargeId(chargeId: string): void;
}

export default ICamperService;
