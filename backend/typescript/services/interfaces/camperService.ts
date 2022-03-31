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
  getCampersByCampId(campId: string): Promise<Array<CamperDTO>>;

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
   * Delete all campers associated with the charge ID
   * @param chargeId the charge ID for the payment
   * @throws Error if camper cancellation fails
   */
  deleteCampersByChargeId(chargeId: string): void;

  /**
   * Delete camper associated with the camper ID
   * @param camperId camper's Id
   * @throws Error if camper cancellation fails
   */
  deleteCamperById(camperId: string): void;
}

export default ICamperService;
