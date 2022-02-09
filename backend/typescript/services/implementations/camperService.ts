import * as firebaseAdmin from "firebase-admin";

import ICamperService from "../interfaces/camperService";
import MgUser, { Camper } from "../../models/camper.model";
import { CamperDTO, UpdateCamperDTO, DropOffType } from "../../types";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";

const Logger = logger(__filename);

/* Something similar necessary? */

/*const getMongoUserByAuthId = async (authId: string): Promise<User> => {
    const user: User | null = await MgUser.findOne({ authId });
    if (!user) {
      throw new Error(`user with authId ${authId} not found.`);
    }
    return user;
  };*/

class CamperService implements ICamperService {
  async updateCamperById(
    camperId: string,
    camper: UpdateCamperDTO,
  ): Promise<CamperDTO> {
    let oldCamper: Camper | null;
    let updatedFirebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      // must explicitly specify runValidators when updating through findByIdAndUpdate
      oldCamper = await MgUser.findByIdAndUpdate(
        camperId,
        {
          firstName: camper.firstName,
          lastName: camper.lastName,
          age: camper.age,
          parentName: camper.parentName,
          contactEmail: camper.contactEmail,
          contactNumber: camper.contactNumber,
          //camps: camper.camps,
          hasCamera: camper.hasCamera,
          hasLaptop: camper.hasLaptop,
          allergies: camper.allergies,
          additionalDetails: camper.additionalDetails,
          dropOffType: camper.dropOffType,
          registrationDate: camper.registrationDate,
          hasPaid: camper.hasPaid,
          chargeId: camper.chargeId,
        },
        { runValidators: true },
      );

      if (!oldCamper) {
        throw new Error(`camperId ${camperId} not found.`);
      }

      try {
        updatedFirebaseUser = await firebaseAdmin
          .auth()
          .updateUser(oldCamper.authId, { email: camper.contactEmail });
      } catch (error) {
        // rollback MongoDB user updates
        try {
          await MgUser.findByIdAndUpdate(
            camperId,
            {
              firstName: camper.firstName,
              lastName: camper.lastName,
              age: camper.age,
              parentName: camper.parentName,
              contactEmail: camper.contactEmail,
              contactNumber: camper.contactNumber,
              //camps: camper.camps,
              hasCamera: camper.hasCamera,
              hasLaptop: camper.hasLaptop,
              allergies: camper.allergies,
              additionalDetails: camper.additionalDetails,
              dropOffType: camper.dropOffType,
              registrationDate: camper.registrationDate,
              hasPaid: camper.hasPaid,
              chargeId: camper.chargeId,
            },
            { runValidators: true },
          );
        } catch (mongoDbError: unknown) {
          const errorMessage = [
            "Failed to rollback MongoDB user update after Firebase user update failure. Reason =",
            getErrorMessage(mongoDbError),
            "MongoDB user id with possibly inconsistent data =",
            oldCamper.id,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw error;
      }
    } catch (error: unknown) {
      Logger.error(`Failed to update user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return {
      id: camperId,
      firstName: camper.firstName,
      lastName: camper.lastName,
      //email: updatedFirebaseUser.email ?? "",
      age: camper.age,
      parentName: camper.parentName,
      contactEmail: camper.contactEmail,
      contactNumber: camper.contactNumber,
      camps: camper.camps,
      hasCamera: camper.hasCamera,
      hasLaptop: camper.hasLaptop,
      allergies: camper.allergies,
      additionalDetails: camper.additionalDetails,
      dropOffType: camper.dropOffType,
      registrationDate: camper.registrationDate,
      hasPaid: camper.hasPaid,
      chargeId: camper.chargeId,
    };
  }
}

export default CamperService;
