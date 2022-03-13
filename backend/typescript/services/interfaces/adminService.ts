import {WaiverDTO } from "../../types";

interface IAdminService {
    updateWaiver(waiver: WaiverDTO): Promise<WaiverDTO>

    getWaiver(): Promise<WaiverDTO>
}

export default IAdminService;