import { CamperDTO, UpdateCamperDTO } from "../../types";

interface ICamperService {
  /**
   * @param camperId camper's id
   * @param camper the camper to be updated
   * @returns a CamperDTO with the updated camper's information
   * @throws Error if camper update fails
   */
  updateCamperById(
    camperId: string,
    camper: UpdateCamperDTO,
  ): Promise<CamperDTO>;
}

export default ICamperService;
