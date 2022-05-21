import {
  CreateCampersDTO,
  CamperDTO,
  CreateWaitlistedCamperDTO,
  WaitlistedCamperDTO,
  UpdateCamperDTO,
} from "../../types";

interface ICamperService {
  /**
   * Create a camper
   * @param campers the campers to be created
   * @returns an array of CamperDTO with the created campers' information
   * @throws Error if user creation fails
   */
  createCampers(campers: CreateCampersDTO): Promise<Array<CamperDTO>>;

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
   * Update a camper
   * @param camperId camper's id
   * @param camper the camper to be updated
   * @returns a CamperDTO with the updated camper's information
   * @throws Error if camper update fails
   */
  updateCamperById(
    camperId: string,
    camper: UpdateCamperDTO,
  ): Promise<CamperDTO>;

  /**
   * Delete all campers in camperIds associated with the charge ID
   * @param chargeId the charge ID for the payment
   * @param camperIds the camper IDs to be deleted
   * @throws Error if camper cancellation fails
   */
  deleteCampersByChargeId(chargeId: string, camperIds: string[]): Promise<void>;

  /**
   * Delete camper associated with the camper ID, without issuing refund
   * @param camperId camper's Id
   * @throws Error if camper cancellation fails
   */
  deleteCamperById(camperId: string): Promise<void>;

  updateWaitlistedCamperStatus(waitlistedCamperId: string): Promise<any>;
}

export default ICamperService;
