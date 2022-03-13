import IAdminService from "../interfaces/adminService";
import waiverModel, { Waiver } from "../../models/waiver.model";
import { WaiverDTO } from "../../types";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";

const Logger = logger(__filename);

class AdminService implements IAdminService {
    async updateWaiver(waiver: WaiverDTO): Promise<WaiverDTO> {
        let waiverDto: WaiverDTO | null;
        try{
            let stuff = await waiverModel.updateOne(
                {
                  clauses: {'$exists': true}
                },
                {
                  $set: {clauses: waiver.clauses}
                },
                {upsert: true}
            )
            waiverDto = await this.getWaiver(); 
        } catch (error: unknown) {
            Logger.error(
                `Failed to update waiver. Reason: ${getErrorMessage(error)}`,
            );
            throw error;
        }
        return waiverDto; 
    }

    async getWaiver(): Promise<WaiverDTO> {
        let waiverDto: WaiverDTO | null;
        let waiverClauses: Waiver | null;
        try {
            let waiverClauses = await waiverModel.findOne();
            if(!waiverClauses) {
                throw new Error(`Waiver not found.`);
            }
            waiverDto = {
                clauses: waiverClauses.clauses
            }
        } catch (error: unknown) {
            Logger.error(`Failed to get waiver. Reason = ${getErrorMessage(error)}`);
            throw error;
        }
        return waiverDto
    }
}

export default AdminService; 