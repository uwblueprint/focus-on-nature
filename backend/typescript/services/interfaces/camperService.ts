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
   * @param waitlistedCamperId the waitlistedCamperIds to be set to registered
   * @returns an array of CamperDTO with the created campers' information
   * @throws Error if user creation fails
   */
  createCampers(
    campers: CreateCampersDTO,
    waitlistedCamperId?: string,
  ): Promise<Array<CamperDTO>>;

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
   * @returns array of CamperDTO
   * @throws Error if camper retrieval fails
   */
  getCampersByChargeId(chargeId: string): Promise<Array<CamperDTO>>;

  /**
   * Get campers associated with charge id and session id
   * @param chargeId camper's charge id indicating which other campers they were registered with
   * @param sessionId camper's session id indicating what camp session they're registered in
   * @returns array of CamperDTO
   * @throws Error if camper retrieval fails
   */
  getCampersByChargeIdAndSessionId(
    chargeId: string,
    sessionId: string,
  ): Promise<Array<CamperDTO>>;

  /**
   * Create a waitlisted camper
   * @param waitlistedCampers the waitlisted campers to be created
   * @param campSessions the session ids for which the campers should be waitlisted
   * @returns a WaitlistedCamperDTO with the created waitlisted camper's information
   * @throws Error if waitlisted camper creation fails
   */
  createWaitlistedCampers(
    waitlistedCampers: CreateWaitlistedCamperDTO[],
    campSessions: string[],
  ): Promise<WaitlistedCamperDTO[]>;

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
   * Delete all campers in camperIds associated with the charge ID if the camp session start date is > 30 days from this cancellation request OR the waitlist for that camp session is not empty and the camp session start date is <= 30 days from this cancellation request
   * @param chargeId the charge ID for the payment
   * @param camperIds is the array of camper IDs to be deleted
   * @throws Error if camper cancellation fails
   */
  cancelRegistration(chargeId: string, camperIds: string[]): Promise<void>;

  /**
   * Delete campers associated with the camper IDs
   * @param camperIds array of camper Ids
   * @throws Error if camper deletion fails
   */
  deleteCampersById(camperIds: Array<string>): Promise<void>;
  /**
   * Sends email inviting waitlisted camper to register and updates their status
   * @param waitlistedCamperId waitlisted camper's Id
   * @throws Error if waitlisted camper's status update fails
   */
  inviteWaitlistedCamper(waitlistedCamperId: string): Promise<unknown>;

  /**
   * Delete waitlisted camper associated with the ID
   * @param waitlistedCamperId waitlisted camper's Id
   * @throws Error if waitlisted camper deletion fails
   */
  deleteWaitlistedCamperById(waitlistedCamperId: string): Promise<void>;
}

export default ICamperService;
