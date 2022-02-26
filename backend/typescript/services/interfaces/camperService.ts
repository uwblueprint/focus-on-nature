import { CreateCamperDTO, CamperDTO } from "../../types";

interface ICamperService {
  /**
   * Create a camper
   * @param camper the camper to be created
   * @returns a CamperDTO with the created camper's information
   * @throws Error if user creation fails
   */
  createCamper(camper: CreateCamperDTO): Promise<CamperDTO>;
}

export default ICamperService;
