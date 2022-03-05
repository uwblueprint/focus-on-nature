import ICamperService from "../interfaces/camperService";
import MgCamper, { Camper } from "../../models/camper.model";
import MgCamp, { Camp } from "../../models/camp.model";
import { CreateCamperDTO, CamperDTO } from "../../types";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";

const Logger = logger(__filename);

class CamperService implements ICamperService {
  /* eslint-disable class-methods-use-this */
  async createCamper(camper: CreateCamperDTO): Promise<CamperDTO> {
    let newCamper: Camper;
    let existingCamp: Camp | null;
    try {
      newCamper = await MgCamper.create({
        firstName: camper.firstName,
        lastName: camper.lastName,
        age: camper.age,
        contactName: camper.contactName,
        contactEmail: camper.contactEmail,
        contactNumber: camper.contactNumber,
        camp: camper.camp,
        hasCamera: camper.hasCamera,
        hasLaptop: camper.hasLaptop,
        allergies: camper.allergies,
        additionalDetails: camper.additionalDetails,
        dropOffType: camper.dropOffType,
        registrationDate: camper.registrationDate,
        hasPaid: camper.hasPaid,
        chargeId: camper.chargeId,
      });

      try {
        existingCamp = await MgCamp.findByIdAndUpdate(
          camper.camp,
          {
            $push: { campers: newCamper.id },
          },
          { runValidators: true },
        );

        if (!existingCamp) {
          throw new Error(`Camp ${camper.camp} not found.`);
        }
      } catch (mongoDbError: unknown) {
        // rollback user creation
        try {
          const deletedCamper: Camper | null = await MgCamper.findByIdAndDelete(
            newCamper.id,
          );

          if (!deletedCamper) {
            throw new Error(`Camper ${newCamper.id} not found.`);
          }
        } catch (rollbackDbError) {
          const errorMessage = [
            "Failed to rollback MongoDB camper creation after update camp failure. Reason =",
            getErrorMessage(rollbackDbError),
            "MongoDB camper id that could not be deleted =",
            newCamper.id,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw mongoDbError;
      }
    } catch (error: unknown) {
      Logger.error(
        `Failed to create camper. Reason: ${getErrorMessage(error)}`,
      );
      throw error;
    }

    return {
      id: newCamper.id,
      firstName: newCamper.firstName,
      lastName: newCamper.lastName,
      age: newCamper.age,
      contactName: newCamper.contactName,
      contactEmail: newCamper.contactEmail,
      contactNumber: newCamper.contactNumber,
      camp: camper.camp,
      hasCamera: newCamper.hasCamera,
      hasLaptop: newCamper.hasLaptop,
      allergies: newCamper.allergies,
      additionalDetails: newCamper.additionalDetails,
      dropOffType: newCamper.dropOffType,
      registrationDate: newCamper.registrationDate,
      hasPaid: newCamper.hasPaid,
      chargeId: newCamper.chargeId,
    };
  }

  async getAllCampers(): Promise<Array<CamperDTO>> {
    let camperDtos: Array<CamperDTO> = [];

    try {
      const campers: Array<Camper> = await MgCamper.find();
      camperDtos = campers.map((camper) => {
        return {
          id: camper.id,
          firstName: camper.firstName,
          lastName: camper.lastName,
          age: camper.age,
          contactName: camper.contactName,
          contactEmail: camper.contactEmail,
          contactNumber: camper.contactNumber,
          camp: camper.camp ? camper.camp.toString() : "",
          hasCamera: camper.hasCamera,
          hasLaptop: camper.hasLaptop,
          allergies: camper.allergies,
          additionalDetails: camper.additionalDetails,
          dropOffType: camper.dropOffType,
          registrationDate: camper.registrationDate,
          hasPaid: camper.hasPaid,
          chargeId: camper.chargeId,
        };
      });
    } catch (error: unknown) {
      Logger.error(`Failed to get campers. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return camperDtos;
  }

  async getCampersByCampId(campId: string): Promise<Array<CamperDTO>> {
    let camperDtos: Array<CamperDTO> = [];

    try {
      const existingCamp: Camp | null = await MgCamp.findById(campId).populate({
        path: "campers",
        model: MgCamper,
      });

      if (!existingCamp) {
        throw new Error(`Camp ${existingCamp} not found.`);
      }

      const campers = existingCamp.campers as Camper[];

      camperDtos = campers.map((camper) => {
        return {
          id: camper.id,
          firstName: camper.firstName,
          lastName: camper.lastName,
          age: camper.age,
          contactName: camper.contactName,
          contactEmail: camper.contactEmail,
          contactNumber: camper.contactNumber,
          camp: camper.camp ? camper.camp.toString() : "",
          hasCamera: camper.hasCamera,
          hasLaptop: camper.hasLaptop,
          allergies: camper.allergies,
          additionalDetails: camper.additionalDetails,
          dropOffType: camper.dropOffType,
          registrationDate: camper.registrationDate,
          hasPaid: camper.hasPaid,
          chargeId: camper.chargeId,
        };
      });
    } catch (error: unknown) {
      Logger.error(`Failed to get campers. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return camperDtos;
  }
}

export default CamperService;
