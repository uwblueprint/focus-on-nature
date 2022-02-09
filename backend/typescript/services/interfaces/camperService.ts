import {
    CamperDTO, 
    UpdateCamperDTO,
    DropOffType, 
} from "../../types";

interface ICamperService {

/**
   * Update a camper.
   * Note: the password cannot be updated using this method, use IAuthService.resetPassword instead
   * @param camperId camper's id
   * @param camper the camper to be updated
   * @returns a CamperDTO with the updated camper's information
   * @throws Error if camper update fails
   */
 updateCamperById(camperId: string, camper: UpdateCamperDTO): Promise<CamperDTO>;

}

export default ICamperService