import { WaiverDTO } from "../../types";

interface IAdminService {
  /**
   * Creates a new waiver document or updates it if it already exists.
   * @param waiver the waver to be created or updated
   * @returns A WaiverDTO that contains the created or updated waiver.
   * @throws Error if waiver creation or update fails.
   */
  updateWaiver(waiver: WaiverDTO): Promise<WaiverDTO>;
  /**
   * Get the waiver.
   * @returns A WaiverDTO that contains the waiver.
   * @throws Error if waiver retrieval fails.
   */
  getWaiver(): Promise<WaiverDTO>;
}

export default IAdminService;
