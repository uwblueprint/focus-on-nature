import {
  CreateCampersDTO,
  CamperDTO,
  CreateWaitlistedCamperDTO,
  WaitlistedCamperDTO,
  UpdateCamperDTO,
  CampRegistrationDTO,
} from "../../types";

interface ICamperService {
  /**
   * Creates a Camper document for each camper and each session. Also handles registering a waitlisted camper for 1 particular session
   * @param campers the campers to be created. The function uses this data to create 1 Camper document per camper per session
   * @param campSessions the ids of the sessions to register the campers for
   * @param waitlistedCamperId the id of the waitlisted camper who will be registered for 1 session
   * @returns an array of CamperDTO with the created campers' information, and checkout URL as a string
   * @throws Error if user creation or checkout session creation fails
   */
  createCampersAndCheckout(
    campers: CreateCampersDTO,
    campSessions: string[],
    waitlistedCamperId?: string,
  ): Promise<CampRegistrationDTO>;

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
   * Confirm successful payment, marking associated campers with `hasPaid=true`
   * @param chargeId id from Stripe checkout session object
   * @returns boolean result, if camper `hasPaid` status updates successfully
   * @throws Error if camper update fails
   */
  confirmCamperPayment(chargeId: string, paymentIntent: string): Promise<boolean>;

  /**
   * Creates a waitlisted camper entity for each camper in each campSession
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
   * Batch process deletion of all campers in camperIds associated with the charge ID and send confirmation email to their parent
   * @param chargeId the charge ID for the payment
   * @param camperIds is the array of camper IDs to be deleted
   * @throws Error if camper cancellation fails
   */
  cancelRegistration(chargeId: string, paymentIntentId: string, camperIds: string[]): Promise<void>;

  /**
   * Returns the refund amount for all campers in camperIds associated with the charge ID if the camp session start date is > 30 days from this cancellation request OR the waitlist for that camp session is not empty and the camp session start date is <= 30 days from this cancellation request
   * @param chargeId the charge ID for the payment
   * @param camperIds is the array of camper IDs to be deleted
   * @throws Error if camper cancellation fails
   */
  cancelRegistrationSession(
    chargeId: string,
    camperIds: string[],
  ): Promise<number>;

  /**
   * Delete campers associated with the camper IDs
   * @param camperIds array of camper Ids
   * @throws Error if camper deletion fails
   */
  deleteCampersById(camperIds: Array<string>): Promise<void>;

  /**
   * Update camper's refund status to "requested"
   * @param camperIds array of camper Ids
   * @throws Error if camper refund status update fails
  */
  changeCamperRefundStatusById(camperIds: Array<string>): Promise<void>;

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
