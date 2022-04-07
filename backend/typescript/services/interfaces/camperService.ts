import {
  CreateCamperDTO,
  CamperDTO,
  CreateWaitlistedCamperDTO,
  WaitlistedCamperDTO,
  UpdateCamperDTO,
} from "../../types";

interface ICamperService {
  /**
   * Create a camper
   * @param camper the camper to be created
   * @returns a CamperDTO with the created camper's information
   * @throws Error if user creation fails
   */
  createCamper(camper: CreateCamperDTO): Promise<CamperDTO>;

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
  getCampersByCampId(
    campId: string,
  ): Promise<{
    campers: CamperDTO[];
    waitlist: WaitlistedCamperDTO[];
  }>;

  /**
   * Get campers associated with charge id
   * @param chargeId camper's charge id for refunds
   * @returns CamperDTO
   * @throws Error if camper retrieval fails
   */
  getCampersByChargeId(chargeId: string): Promise<Array<CamperDTO>>;

  /**
   * Create a waitlisted camper
   * @param waitlistedCamper the waitlisted camper to be created
   * @returns a WaitlistedCamperDTO with the created waitlisted camper's information
   * @throws Error if waitlisted camper creation fails
   */
  createWaitlistedCamper(
    waitlistedCamper: CreateWaitlistedCamperDTO,
  ): Promise<WaitlistedCamperDTO>;

  /**
   * Update an array of campers
   * @param camperIds the campers to be updated
   * @param updatedFields camper fields to be updated
   * @returns an array of CamperDTOs with the updated campers' information
   * @throws Error if campers' update fails
   */
  updateCampersById(
    camperIds: Array<string>,
    updatedFields: UpdateCamperDTO,
  ): Promise<Array<CamperDTO>>;

  /**
   * Delete all campers associated with the camper IDs if the camp session start date is > 30 days from this cancellation request OR the waitlist for that camp session is not empty and the camp session start date is <= 30 days from this cancellation request
   * @param camperIds array of camper Ids
   * @throws Error if camper cancellation fails
   */
  cancelRegistration(camperIds: Array<string>): Promise<void>;

  /**
   * Delete campers associated with the camper IDs
   * @param camperIds array of camper Ids
   * @throws Error if camper deletion fails
   */
  deleteCampersById(camperIds: Array<string>): Promise<void>;
}

export default ICamperService;
