/* eslint-disable no-underscore-dangle */
import mongoose, { Schema, ClientSession } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import IFileStorageService from "../interfaces/fileStorageService";
import {
  CreateCampDTO,
  CamperCSVInfoDTO,
  CampDTO,
  CampSessionDTO,
  UpdateCampSessionDTO,
  GetCampDTO,
  UpdateCampDTO,
  CreateCampSessionsDTO,
  FormQuestionDTO,
  UpdateCampSessionsDTO,
  CreateFormQuestionDTO,
} from "../../types";

import ICampService from "../interfaces/campService";
import { getErrorMessage } from "../../utilities/errorUtils";
import { generateCSV } from "../../utilities/CSVUtils";
import logger from "../../utilities/logger";
import MgCamp, { Camp } from "../../models/camp.model";
import MgCampSession, { CampSession } from "../../models/campSession.model";
import MgFormQuestion, { FormQuestion } from "../../models/formQuestion.model";
import MgCamper, { Camper } from "../../models/camper.model";
import {
  createStripePrice,
  updateStripeCampProduct,
  createStripeCampProduct,
  createStripeDropoffProduct,
  createStripePickupProduct,
  updateStripeDropoffProduct,
  updateStripePickupProduct,
} from "../../utilities/stripeUtils";

import MgWaitlistedCamper, {
  WaitlistedCamper,
} from "../../models/waitlistedCamper.model";

const Logger = logger(__filename);

class CampService implements ICampService {
  storageService: IFileStorageService;

  constructor(storageService: IFileStorageService) {
    this.storageService = storageService;
  }

  /* eslint-disable class-methods-use-this */
  async getCamps(year: number): Promise<GetCampDTO[]> {
    try {
      let camps: Camp[] | null = await MgCamp.find({})
        .populate({
          path: "campSessions",
          model: MgCampSession,
          populate: [
            { path: "campers", model: MgCamper },
            { path: "waitlist", model: MgWaitlistedCamper },
          ],
        })
        .populate({
          path: "formQuestions",
          model: MgFormQuestion,
        });

      if (!camps) {
        return [];
      }

      if (year) {
        // Filter camps that have at least one camp session in the desired year
        /* eslint-disable no-param-reassign */
        camps = camps.filter((camp) => {
          // TODO: Remove the undefined and null checks once MongoDB data all have createdAt fields
          if (camp.campSessions.length === 0) {
            if (camp.createdAt !== undefined && camp.createdAt !== null)
              return camp.createdAt.getFullYear() === year;
          }

          // Go through every camp session in a camp. If at least one camp session has the desired year, include the camp in the final filtered camps.
          /* eslint-disable no-param-reassign */
          camp.campSessions = (camp.campSessions as CampSession[]).filter(
            (campSession) => {
              return campSession.dates.every((campDate) => {
                return campDate.getFullYear() === year;
              });
            },
          );
          return camp.campSessions.length > 0;
        });
      }

      return await Promise.all(
        camps.map(async (camp) => {
          const formQuestions = (camp.formQuestions as FormQuestion[]).map(
            (formQuestion: FormQuestion) => {
              return {
                id: formQuestion.id,
                category: formQuestion.category,
                type: formQuestion.type,
                question: formQuestion.question,
                required: formQuestion.required,
                description: formQuestion.description,
                options: formQuestion.options,
              };
            },
          );

          const campSessions = (camp.campSessions as CampSession[]).map(
            (campSession) => {
              const campers = (campSession.campers as Camper[]).map(
                (camper) => {
                  return {
                    id: camper.id,
                    campSession: campSession.id,
                    firstName: camper.firstName,
                    lastName: camper.lastName,
                    age: camper.age,
                    allergies: camper.allergies,
                    earlyDropoff: camper.earlyDropoff.map((date) =>
                      date.toString(),
                    ),
                    latePickup: camper.latePickup.map((date) =>
                      date.toString(),
                    ),
                    specialNeeds: camper.specialNeeds,
                    contacts: camper.contacts,
                    registrationDate: camper.registrationDate.toString(),
                    hasPaid: camper.hasPaid,
                    chargeId: camper.chargeId,
                    formResponses: camper.formResponses,
                    charges: camper.charges,
                    optionalClauses: camper.optionalClauses,
                  };
                },
              );
              const waitlist = (campSession.waitlist as WaitlistedCamper[]).map(
                (waitlistedCamper) => {
                  return {
                    id: waitlistedCamper.id,
                    campSession: campSession.id,
                    firstName: waitlistedCamper.firstName,
                    lastName: waitlistedCamper.lastName,
                    age: waitlistedCamper.age,
                    contactName: waitlistedCamper.contactName,
                    contactEmail: waitlistedCamper.contactEmail,
                    contactNumber: waitlistedCamper.contactNumber,
                    status: waitlistedCamper.status,
                  };
                },
              );
              return {
                id: campSession.id,
                camp: camp.id,
                capacity: campSession.capacity,
                dates: campSession.dates.map((date) => date.toString()),
                campPriceId: campSession.campPriceId,
                campers,
                waitlist,
              };
            },
          );

          let campPhotoUrl;
          if (camp.fileName) {
            try {
              campPhotoUrl = await this.storageService.getFile(camp.fileName);
            } catch (error: unknown) {
              Logger.error(
                `Failed to get camp photo for camp with id ${
                  camp.id
                }. Reason = ${getErrorMessage(error)}`,
              );
            }
          }

          return {
            id: camp.id,
            active: camp.active,
            ageLower: camp.ageLower,
            ageUpper: camp.ageUpper,
            campCoordinators: camp.campCoordinators.map((coordinator) =>
              coordinator.toString(),
            ),
            campCounsellors: camp.campCounsellors.map((counsellor) =>
              counsellor.toString(),
            ),
            name: camp.name,
            description: camp.description,
            earlyDropoff: camp.earlyDropoff,
            latePickup: camp.latePickup,
            dropoffFee: camp.dropoffFee,
            pickupFee: camp.pickupFee,
            location: camp.location,
            campProductId: camp.campProductId,
            dropoffPriceId: camp.dropoffPriceId,
            dropoffProductId: camp.dropoffProductId,
            pickupPriceId: camp.pickupPriceId,
            pickupProductId: camp.pickupProductId,
            startTime: camp.startTime,
            endTime: camp.endTime,
            fee: camp.fee,
            formQuestions,
            campSessions,
            volunteers: camp.volunteers,
            campPhotoUrl,
          };
        }),
      );
    } catch (error: unknown) {
      Logger.error(`Failed to get camps. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getCampById(
    campId: string,
    campSessionId?: string,
    waitlistedCamperId?: string,
  ): Promise<GetCampDTO> {
    if (waitlistedCamperId && campSessionId) {
      try {
        const waitlistedCamper: WaitlistedCamper | null = await MgWaitlistedCamper.findById(
          waitlistedCamperId,
        );

        if (!waitlistedCamper || !waitlistedCamper?.linkExpiry) {
          throw new Error(
            `Waitlisted Camper with Id ${waitlistedCamperId} does not exist or does not have an invite link.`,
          );
        }

        if (campSessionId !== waitlistedCamper.campSession.toString()) {
          throw new Error(
            `Given waitlisted camper is not on the waitlist for given camp session.`,
          );
        }

        const linkExpiryDate = new Date(waitlistedCamper.linkExpiry);
        const currentDate = new Date();
        if (linkExpiryDate < currentDate) {
          throw new Error(
            `Invite link has expired, please contact us to resolve this issue.`,
          );
        }
      } catch (error: unknown) {
        Logger.error(
          `Failed to verify waitlisted camper. Reason = ${getErrorMessage(
            error,
          )}`,
        );
        throw error;
      }
    }

    let camp: Camp | null;
    try {
      camp = await MgCamp.findById(campId)
        .populate({
          path: "campSessions",
          model: MgCampSession,
          populate: [
            { path: "campers", model: MgCamper },
            { path: "waitlist", model: MgWaitlistedCamper },
          ],
        })
        .populate({
          path: "formQuestions",
          model: MgFormQuestion,
        });

      if (!camp) {
        throw new Error(`Camp' with campId ${campId} not found.`);
      }
    } catch (error: unknown) {
      Logger.error(`Failed to get camp. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    const campSessions = (camp.campSessions as CampSession[]).map(
      (campSession) => {
        const campers = (campSession.campers as Camper[]).map((camper) => {
          return {
            id: camper.id,
            campSession: campSession.id,
            firstName: camper.firstName,
            lastName: camper.lastName,
            age: camper.age,
            allergies: camper.allergies,
            earlyDropoff: camper.earlyDropoff.map((date) => date.toString()),
            latePickup: camper.latePickup.map((date) => date.toString()),
            specialNeeds: camper.specialNeeds,
            contacts: camper.contacts,
            registrationDate: camper.registrationDate.toString(),
            hasPaid: camper.hasPaid,
            chargeId: camper.chargeId,
            formResponses: camper.formResponses,
            charges: camper.charges,
            optionalClauses: camper.optionalClauses,
          };
        });
        const waitlist = (campSession.waitlist as WaitlistedCamper[]).map(
          (waitlistedCamper) => {
            return {
              id: waitlistedCamper.id,
              campSession: campSession.id,
              firstName: waitlistedCamper.firstName,
              lastName: waitlistedCamper.lastName,
              age: waitlistedCamper.age,
              contactName: waitlistedCamper.contactName,
              contactEmail: waitlistedCamper.contactEmail,
              contactNumber: waitlistedCamper.contactNumber,
              status: waitlistedCamper.status,
            };
          },
        );
        return {
          id: campSession.id,
          camp: campId,
          capacity: campSession.capacity,
          dates: campSession.dates.map((date) => date.toString()),
          campPriceId: campSession.campPriceId,
          campers,
          waitlist,
        };
      },
    );

    let campPhotoUrl;
    if (camp.fileName) {
      try {
        campPhotoUrl = await this.storageService.getFile(camp.fileName);
      } catch (error: unknown) {
        Logger.error(
          `Failed to get camp photo for camp with id ${
            camp.id
          }. Reason = ${getErrorMessage(error)}`,
        );
      }
    }

    if (waitlistedCamperId) {
      camp.campSessions = (camp.campSessions as CampSession[]).filter(
        (campSession) =>
          campSession.id === campSessionId &&
          campSession.capacity > campSession.campers.length,
      );

      if (camp.campSessions.length === 0) {
        throw new Error(
          `No camp session with space matches with session ${campSessionId}`,
        );
      }
    }

    return {
      id: campId,
      active: camp.active,
      ageLower: camp.ageLower,
      ageUpper: camp.ageUpper,
      campCoordinators: camp.campCoordinators.map((coordinator) =>
        coordinator.toString(),
      ),
      campCounsellors: camp.campCounsellors.map((counsellor) =>
        counsellor.toString(),
      ),
      campProductId: camp.campProductId,
      dropoffPriceId: camp.dropoffPriceId,
      dropoffProductId: camp.dropoffProductId,
      pickupPriceId: camp.pickupPriceId,
      pickupProductId: camp.pickupProductId,
      name: camp.name,
      description: camp.description,
      earlyDropoff: camp.earlyDropoff,
      latePickup: camp.latePickup,
      dropoffFee: camp.dropoffFee,
      pickupFee: camp.pickupFee,
      location: camp.location,
      startTime: camp.startTime,
      endTime: camp.endTime,
      fee: camp.fee,
      campSessions,
      formQuestions: (camp.formQuestions as FormQuestion[]).map(
        (formQuestion: FormQuestion) => {
          return {
            id: formQuestion.id,
            category: formQuestion.category,
            type: formQuestion.type,
            question: formQuestion.question,
            required: formQuestion.required,
            description: formQuestion.description,
            options: formQuestion.options,
          };
        },
      ),
      volunteers: camp.volunteers,
      campPhotoUrl,
    };
  }

  async updateCampById(campId: string, camp: UpdateCampDTO): Promise<CampDTO> {
    let oldCamp: Camp | null;
    let newCamp: Camp | null;
    let newCampSessions: CampSessionDTO[] = [];
    let newFormQuestions: string[] = [];

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      oldCamp = await MgCamp.findById(campId, {}, { session });

      if (!oldCamp) {
        throw new Error(`Camp' with campId ${campId} not found.`);
      }

      if (
        oldCamp.active &&
        (camp.fee !== oldCamp.fee ||
          camp.dropoffFee !== oldCamp.dropoffFee ||
          camp.pickupFee !== oldCamp.pickupFee)
      ) {
        throw new Error(`Error - cannot update fees of active camp`);
      }

      const fileName = oldCamp.fileName ?? uuidv4();
      if (camp.filePath && !oldCamp.fileName) {
        await this.storageService.createFile(
          fileName,
          camp.filePath,
          camp.fileContentType,
        );
      } else if (camp.filePath && oldCamp.fileName) {
        await this.storageService.updateFile(
          fileName,
          camp.filePath,
          camp.fileContentType,
        );
      }

      // Update base camp level info
      newCamp = await MgCamp.findByIdAndUpdate(
        campId,
        {
          $set: {
            name: camp.name,
            active: camp.active,
            ageLower: camp.ageLower,
            ageUpper: camp.ageUpper,
            campCoordinators: camp.campCoordinators,
            campCounsellors: camp.campCounsellors,
            description: camp.description,
            earlyDropoff: camp.earlyDropoff,
            latePickup: camp.latePickup,
            dropoffFee: camp.dropoffFee,
            pickupFee: camp.pickupFee,
            location: camp.location,
            startTime: camp.startTime,
            endTime: camp.endTime,
            volunteers: camp.volunteers,
            fee: camp.fee,
            fileName: camp.filePath || oldCamp.fileName ? fileName : null,
          },
        },
        {
          new: true,
          session,
        },
      ).populate({
        path: "campSessions",
        model: MgCampSession,
      });

      if (!newCamp) {
        throw new Error(`Camp' with campId ${campId} not found.`);
      }

      // Update the campSessions by deleting all current sessions and creating new sessions
      const currCampSessionIds = (newCamp.campSessions as CampSession[]).map(
        (cs) => cs.id,
      );
      await this.deleteCampSessionsByIds(
        newCamp.id,
        currCampSessionIds,
        session,
      );
      newCampSessions = await this.createCampSessions(
        newCamp.id,
        camp.campSessions,
        session,
      );

      // Update the FormQuestions by deleting all the current questions and creating new ones
      const currFormQuestions = (newCamp.formQuestions as FormQuestion[]).map(
        (fq) => fq.toString(),
      );
      await this.deleteFormQuestionsByIds(currFormQuestions);
      newFormQuestions = await this.addFormQuestionsToCamp(
        newCamp.id,
        camp.formQuestions,
        session,
      );

      // Update names of existing Stripe products
      if (oldCamp.campProductId) {
        updateStripeCampProduct({
          productId: oldCamp.campProductId,
          campName: camp.name,
          campDescription: camp.description,
        });
      }

      if (oldCamp.dropoffProductId) {
        updateStripeDropoffProduct({
          productId: oldCamp.dropoffProductId,
          campName: camp.name,
        });
      }

      if (oldCamp.pickupProductId) {
        updateStripePickupProduct({
          productId: oldCamp.pickupProductId,
          campName: camp.name,
        });
      }

      // Create Price Objects if switching from inactive to active
      if (!oldCamp.active && camp.active) {
        const {
          campProductId,
          dropoffProductId,
          pickupProductId,
          dropoffFee,
          pickupFee,
        } = newCamp;

        const campFee = newCamp.fee;

        const dropoffPriceObject = await createStripePrice(
          dropoffProductId,
          dropoffFee * 100,
        );

        const pickupPriceObject = await createStripePrice(
          pickupProductId,
          pickupFee * 100,
        );

        await MgCamp.findByIdAndUpdate(
          campId,
          {
            dropoffPriceId: dropoffPriceObject.id,
            pickupPriceId: pickupPriceObject.id,
          },
          { session },
        );

        await Promise.all(
          (newCamp.campSessions as CampSession[]).map(async (campSession) => {
            const campSessionFeeInCents =
              campFee * campSession.dates.length * 100;
            const priceObject = await createStripePrice(
              campProductId,
              campSessionFeeInCents,
            );

            await MgCampSession.findByIdAndUpdate(
              campSession.id,
              {
                campPriceId: priceObject.id,
              },
              {
                runValidators: true,
                session,
              },
            );
          }),
        );
      }

      await session.commitTransaction();
    } catch (error: unknown) {
      Logger.error(`Failed to update camp. Reason = ${getErrorMessage(error)}`);
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    return {
      id: campId,
      active: newCamp.active,
      ageLower: newCamp.ageLower,
      ageUpper: newCamp.ageUpper,
      campCoordinators: newCamp.campCoordinators?.map((coordinator) =>
        coordinator.toString(),
      ),
      campCounsellors: newCamp.campCounsellors?.map((counsellor) =>
        counsellor.toString(),
      ),
      campSessions: newCampSessions.map((cs) => cs.id),
      name: newCamp.name,
      description: newCamp.description,
      earlyDropoff: newCamp.earlyDropoff,
      latePickup: newCamp.latePickup,
      dropoffFee: newCamp.dropoffFee,
      pickupFee: newCamp.pickupFee,
      location: newCamp.location,
      campProductId: newCamp.campProductId,
      dropoffPriceId: newCamp.dropoffPriceId,
      dropoffProductId: newCamp.dropoffProductId,
      pickupPriceId: newCamp.pickupPriceId,
      pickupProductId: newCamp.pickupProductId,
      startTime: newCamp.startTime,
      endTime: newCamp.endTime,
      fee: newCamp.fee,
      formQuestions: newFormQuestions,
      volunteers: newCamp.volunteers,
    };
  }

  async deleteCamp(campId: string): Promise<void> {
    let camp: Camp | null;

    try {
      camp = await MgCamp.findById(campId);
      if (!camp) {
        throw new Error(`Camp with camp ID ${campId} not found.`);
      }

      // delete the camp's file, if it exists
      if (camp.fileName) {
        await this.storageService.deleteFile(camp.fileName);
      }
    } catch (error: unknown) {
      Logger.error(`Failed to delete camp. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    try {
      try {
        // delete the form questions and camp sessions
        if (camp.formQuestions.length) {
          await Promise.all(
            camp.formQuestions.map(async (formQuestionId) => {
              try {
                await MgFormQuestion.findByIdAndDelete(formQuestionId);
              } catch (deleteFormQuestionErr: unknown) {
                // log error but don't throw
                Logger.error(
                  `Issues with form question deletion. Reason = ${getErrorMessage(
                    deleteFormQuestionErr,
                  )}`,
                );
              }
            }),
          );
        }
        if (camp.campSessions.length) {
          await Promise.all(
            camp.campSessions.map(async (campSessionId) => {
              try {
                await this.deleteCampSessionById(
                  campId,
                  campSessionId.toString(),
                );
              } catch (deleteCampSessionErr: unknown) {
                Logger.error(
                  `Issues with delete camp session deletion. Reason = ${getErrorMessage(
                    deleteCampSessionErr,
                  )}`,
                );
              }
            }),
          );
        }
      } catch (deleteError: unknown) {
        // don't do anything
      }

      await MgCamp.findByIdAndDelete(campId); // delete camp itself
    } catch (error: unknown) {
      Logger.error(`Failed to delete camp. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async createCampSessions(
    campId: string,
    campSessions: CreateCampSessionsDTO,
    dbSession?: mongoose.ClientSession,
  ): Promise<CampSessionDTO[]> {
    const insertCampSessions: Omit<CampSessionDTO, "id">[] = [];

    campSessions.forEach((campSession) => {
      insertCampSessions.push({
        camp: campId,
        campers: [],
        capacity: campSession.capacity,
        waitlist: [],
        dates: campSession.dates.sort(),
        campPriceId: "",
      });
    });

    const camp = await MgCamp.findById(campId, {}, { session: dbSession });
    if (!camp) {
      throw new Error(`camp with id ${campId} not found`);
    }

    if (camp.active) {
      await Promise.all(
        campSessions.map(async (campSession, i) => {
          const campSessionFeeInCents =
            camp.fee * campSession.dates.length * 100;

          try {
            const priceObject = await createStripePrice(
              camp.campProductId,
              campSessionFeeInCents,
            );
            insertCampSessions[i] = {
              camp: campId,
              campers: [],
              capacity: campSession.capacity,
              waitlist: [],
              dates: campSession.dates.sort(),
              campPriceId: priceObject.id,
            };
          } catch (err: unknown) {
            Logger.error(
              `Stripe price object creation failed. Reason = ${getErrorMessage(
                err,
              )}`,
            );
          }
        }),
      );
    }

    let newCampSessions: Array<CampSession> = [];
    let newCampSessionsIds: Array<string>;

    try {
      newCampSessions = await MgCampSession.insertMany(insertCampSessions, {
        session: dbSession,
      });
      newCampSessionsIds = newCampSessions.map((session) => session.id);

      await MgCamp.findByIdAndUpdate(
        campId,
        {
          $push: { campSessions: newCampSessionsIds },
        },
        { runValidators: true, session: dbSession },
      );
    } catch (error: unknown) {
      Logger.error(
        `Failed to create CampSession. Reason = ${getErrorMessage(error)}`,
      );
      throw new Error(
        `Could not create CampSessions. Reason = ${getErrorMessage(error)}`,
      );
    }

    return newCampSessions.map(
      (session) =>
        <CampSessionDTO>{
          id: session.id,
          camp: campId,
          campers: [],
          capacity: session.capacity,
          waitlist: [],
          dates: session.dates.map((date) => date.toString()),
          campPriceId: session.campPriceId,
        },
    );
  }

  async updateCampSessionById(
    campId: string,
    campSessionId: string,
    campSession: UpdateCampSessionDTO,
  ): Promise<CampSessionDTO> {
    try {
      const oldCamp: Camp | null = await MgCamp.findById(campId);
      if (!oldCamp) {
        throw new Error(`Camp with campId ${campId} not found.`);
      }
      const oldSessions = oldCamp.campSessions as Schema.Types.ObjectId[];
      if (
        !oldSessions.find((session) => session.toString() === campSessionId)
      ) {
        throw new Error(
          `CampSession with campSessionId ${campSessionId} not found for Camp with id ${campId}.`,
        );
      }

      if (oldCamp.active) {
        const oldCampSession: CampSession | null = await MgCampSession.findById(
          campSessionId,
        );
        if (oldCampSession) {
          if (
            oldCampSession.campers &&
            campSession.capacity &&
            campSession.capacity < oldCampSession.campers.length
          ) {
            throw new Error(
              `Cannot decrease capacity to less than current number of registered campers. Requested capacity change: ${campSession.capacity}, current number of registed campers: ${oldCampSession.campers.length}`,
            );
          }
          if (
            campSession.dates &&
            oldCampSession.dates.length !== campSession.dates.length
          ) {
            throw new Error(
              `Cannot change the number of dates for an active camp. Requested dates length: ${campSession.dates.length}, current number of dates ${oldCampSession.dates.length}`,
            );
          }
        } else {
          throw new Error(
            `CampSession with campSessionId ${campSessionId} not found.`,
          );
        }
      }

      const newCampSession: CampSession | null = await MgCampSession.findByIdAndUpdate(
        campSessionId,
        {
          ...(campSession.capacity && { capacity: campSession.capacity }),
          ...(campSession.dates && {
            dates: campSession.dates.sort(
              (dateA, dateB) =>
                new Date(dateA).getTime() - new Date(dateB).getTime(),
            ),
          }),
        },
        { runValidators: true, new: true },
      );

      if (!newCampSession) {
        throw new Error(
          `CampSession with campSessionId ${campSessionId} not found.`,
        );
      }

      return {
        id: campSessionId,
        camp: newCampSession.camp.toString(),
        campers: newCampSession.campers.map((camper) => camper.toString()),
        capacity: newCampSession.capacity,
        waitlist: newCampSession.waitlist.map((camper) => camper.toString()),
        dates: newCampSession.dates.map((date) => date.toString()),
        campPriceId: newCampSession.campPriceId,
      };
    } catch (error: unknown) {
      Logger.error(
        `Failed to edit CampSession. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async updateCampSessionsByIds(
    campId: string,
    updatedCampSessions: Array<UpdateCampSessionsDTO>,
  ): Promise<Array<CampSessionDTO>> {
    let dbSession: ClientSession | null = null;
    try {
      const campSessionIds = updatedCampSessions.map((session) => session.id);
      dbSession = await mongoose.startSession();

      if (!dbSession) {
        throw new Error("Unable to start database session");
      }
      await dbSession.startTransaction();

      const oldCampSessions = await MgCampSession.find({
        _id: { $in: campSessionIds },
        camp: { _id: campId },
      }).session(dbSession);

      if (oldCampSessions.length !== campSessionIds.length) {
        throw new Error(
          `Failed to update camp sessions. Could not find all camp sessions in ${campSessionIds} belonging to camp with id ${campId}`,
        );
      }

      const camp = await MgCamp.findById(campId).session(dbSession);
      if (!camp) {
        throw new Error(`Could not find camp with id=${campId}`);
      }

      const newCampSessionPromises = updatedCampSessions.map(
        async (session): Promise<CampSessionDTO> => {
          if (camp.active) {
            const oldCampSession: CampSession | null = await MgCampSession.findById(
              session.id,
            ).session(dbSession);
            if (oldCampSession) {
              if (
                (session.capacity || session.capacity === 0) &&
                oldCampSession.campers &&
                session.capacity < oldCampSession.campers.length
              ) {
                throw new Error(
                  `Cannot decrease capacity to less than current number of registered campers. Requested capacity change: ${session.capacity}, current number of registed campers: ${oldCampSession.campers.length}`,
                );
              }
              if (
                session.dates &&
                oldCampSession.dates.length !== session.dates.length
              ) {
                throw new Error(
                  `Cannot change the number of dates for an active camp. Requested dates length: ${session.dates.length}, current number of dates ${oldCampSession.dates.length}`,
                );
              }
            } else {
              throw new Error(
                `Failed to update camp sessions with ids=${campSessionIds}. CampSession with campSessionId ${session.id} and campId ${campId} not found.`,
              );
            }
          }

          const newCampSession: CampSession | null = await MgCampSession.findByIdAndUpdate(
            session.id,
            {
              ...(session.capacity && { capacity: session.capacity }),
              ...(session.dates && {
                dates: session.dates.sort(
                  (dateA, dateB) =>
                    new Date(dateA).getTime() - new Date(dateB).getTime(),
                ),
              }),
            },
            { runValidators: true, new: true },
          ).session(dbSession);

          if (!newCampSession) {
            throw new Error(
              `Could not update campSession with campSessionId ${session.id}.`,
            );
          }

          return {
            id: session.id,
            camp: newCampSession.camp.toString(),
            campers: newCampSession.campers.map((camper) => camper.toString()),
            capacity: newCampSession.capacity,
            waitlist: newCampSession.waitlist.map((camper) =>
              camper.toString(),
            ),
            dates: newCampSession.dates.map((date) => date.toString()),
            campPriceId: newCampSession.campPriceId,
          };
        },
      );

      const newCampSessions: Array<CampSessionDTO> = [];

      // eslint-disable-next-line no-restricted-syntax
      for await (const updatedSession of newCampSessionPromises) {
        newCampSessions.push(updatedSession);
      }

      if (newCampSessions.length !== campSessionIds.length) {
        throw new Error(
          `Could not update all camp sessions in ${campSessionIds} belonging to camp with id ${campId}`,
        );
      }

      await dbSession.commitTransaction();

      return newCampSessions;
    } catch (error: unknown) {
      await dbSession?.abortTransaction();
      Logger.error(
        `Failed to update camp sessions. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    } finally {
      await dbSession?.endSession();
    }
  }

  async deleteCampSessionById(
    campId: string,
    campSessionId: string,
  ): Promise<void> {
    let campSession: CampSession | null;
    try {
      const oldCamp: Camp | null = await MgCamp.findById(campId);
      if (!oldCamp) {
        throw new Error(`Camp with campId ${campId} not found.`);
      }
      const oldSessions = oldCamp.campSessions as Schema.Types.ObjectId[];
      if (
        !oldSessions.find((session) => session.toString() === campSessionId)
      ) {
        throw new Error(
          `CampSession with campSessionId ${campSessionId} not found for Camp with id ${campId}.`,
        );
      }
      campSession = await MgCampSession.findByIdAndRemove(campSessionId);
      if (!campSession) {
        throw new Error(
          `CampSession' with campSessionID ${campSessionId} not found.`,
        );
      }

      await MgCamp.findByIdAndUpdate(campId, {
        $pullAll: { campSessions: [campSession.id] },
      });
    } catch (error: unknown) {
      Logger.error(
        `Failed to delete CampSession ${campSessionId} properly. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }

    // delete all the campers belonging to the camp session
    const existingCampers = [...campSession.campers];
    let numberOfCampersDeleted = 0;

    try {
      Promise.all(
        existingCampers.map(async (camperId) => {
          await MgCamper.findByIdAndDelete(camperId);
          numberOfCampersDeleted += 1;
        }),
      );
    } catch (error: unknown) {
      // log but don't throw error
      const errorMessage = [
        `Failed to delete all campers belonging to camp session ${campSessionId}. Campers not deleted, although CampSession has been deleted`,
        "Campers not yet deleted:",
        existingCampers.slice(numberOfCampersDeleted),
      ];
      Logger.error(errorMessage.join(" "));
    }
  }

  async deleteCampSessionsByIds(
    campId: string,
    campSessionIds: Array<string>,
    dbSession?: mongoose.ClientSession,
  ): Promise<void> {
    try {
      const campSessions: Array<CampSession> | null = await MgCampSession.find(
        {
          _id: {
            $in: campSessionIds,
          },
          camp: {
            _id: campId,
          },
        },
        {},
        { session: dbSession },
      );

      if (
        campSessions == null ||
        campSessions.length !== campSessionIds.length
      ) {
        throw new Error(
          `Could not find all camp sessions with IDs in [${campSessionIds}] and belonging to camp with ID ${campId}.`,
        );
      }

      const camp: Camp | null = await MgCamp.findById(
        campId,
        {},
        { session: dbSession },
      );
      if (!camp) {
        throw new Error(`Camp with campId ${campId} not found.`);
      }

      // This is an edge case, where the camp session has a campId but the the session does not appear on that camp
      const currentCampSessionsSet = new Set(
        camp.campSessions.map((sessionObjectId) => sessionObjectId.toString()),
      );

      campSessionIds.forEach((sessionId) => {
        if (!currentCampSessionsSet.has(sessionId)) {
          throw new Error(
            `Not all camp sessions with IDs in [${campSessionIds}] were found in camp with ID ${campId}.`,
          );
        }
      });

      const oldCampSessions = camp.campSessions; // clone the full array of camp sessions for rollback

      try {
        const sessionsToDeleteSet = new Set(campSessionIds);

        const newCampSessions = camp.campSessions.filter(
          (session) => !sessionsToDeleteSet.has(session.toString()),
        );

        camp.campSessions = newCampSessions;
        const updatedCamp = await camp.save({ session: dbSession });

        if (!updatedCamp) {
          throw new Error(
            `Failed to update ${camp} with deleted camp sessions.`,
          );
        }
      } catch (mongoDbError: unknown) {
        try {
          camp.campSessions = oldCampSessions;
          await camp.save();
        } catch (rollbackDbError: unknown) {
          const errorMessage = [
            "Failed to rollback MongoDB update to camp to restore deleted campSessionIds. Reason =",
            getErrorMessage(rollbackDbError),
            "MongoDB campSessionIdsthat could not be restored in the camp Session=",
            campSessionIds,
          ];
          Logger.error(errorMessage.join(" "));
        }
        throw mongoDbError;
      }

      // deleting camp sessions from the camp session table
      try {
        await MgCampSession.deleteMany(
          {
            _id: {
              $in: campSessionIds,
            },
          },
          { session: dbSession },
        );
      } catch (mongoDbError: unknown) {
        try {
          await MgCampSession.create(campSessionIds);
        } catch (rollbackDbError: unknown) {
          const errorMessage = [
            "Failed to rollback MongoDB camp session deletion. Reason =",
            getErrorMessage(rollbackDbError),
            "MongoDB camp sessions that could not be re-created =",
            campSessionIds,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw mongoDbError;
      }

      const oldCamperIds = campSessions.flatMap((session) => session.campers);
      // deleting all campers with given camp session ID
      try {
        await MgCamper.deleteMany(
          {
            _id: { $in: oldCamperIds },
          },
          { session: dbSession },
        );
      } catch (mongoDbError: unknown) {
        try {
          await MgCamper.create(oldCamperIds);
        } catch (rollbackDbError: unknown) {
          const errorMessage = [
            `Failed to rollback MongoDB campers deletion. Reason =`,
            getErrorMessage(mongoDbError),
            "MongoDB campers that could not be re-created =",
            oldCamperIds,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw mongoDbError;
      }
    } catch (error: unknown) {
      Logger.error(
        `Failed to delete camp sessions with camper IDs [${campSessionIds}]. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async getCampersByCampSessionId(
    campSessionId: string,
  ): Promise<CamperCSVInfoDTO[]> {
    try {
      const campSession: CampSession | null = await MgCampSession.findById(
        campSessionId,
      ).populate({
        path: "campers",
        model: MgCamper,
      });

      if (!campSession) {
        throw new Error(`Camp Session with id ${campSessionId} not found.`);
      }
      const campers = campSession.campers as Camper[];
      const camp: Camp | null = await MgCamp.findById(campSession.camp);
      if (!camp) {
        throw new Error(`Camp with id ${campSessionId} not found.`);
      }

      const formQuestionsData = await MgFormQuestion.find({
        _id: { $in: camp.formQuestions },
      });

      const campersWithSpecficQuestions: string[] = [];
      campers.forEach((camper) => {
        camper.formResponses.forEach((value, key) => {
          const campQuestion = formQuestionsData.find(
            (item) => item.question === key,
          );
          if (campQuestion?.category === "CampSpecific") {
            campersWithSpecficQuestions.push(camper.id);
          }
        });
      });

      return await Promise.all(
        campers.map(async (camper) => {
          return {
            "Registration Date": camper.registrationDate
              .toLocaleDateString("en-CA")
              .toString(),
            "Camper Name": `${camper.firstName} ${camper.lastName}`,
            "Camper Age": camper.age,
            "Primary Emergency Contact Name": `${camper.contacts[0].firstName} ${camper.contacts[0].lastName}`,
            "Primary Emergency Contact Phone #": camper.contacts[0].phoneNumber,
            "Primary Emergency Contact Email": camper.contacts[0].email,
            "Secondary Emergency Contact Name":
              camper.contacts.length > 1
                ? `${camper.contacts[1].firstName} ${camper.contacts[1].lastName}`
                : "",
            "Secondary Emergency Contact Phone #":
              camper.contacts.length > 1 ? camper.contacts[1].phoneNumber : "",
            "Requires Early Drop-off":
              camper.earlyDropoff.length > 0 ? "Y" : "N",
            "Requires Late Pick-up": camper.earlyDropoff.length > 0 ? "Y" : "N",
            // eslint-disable-next-line
            "Allergies": camper.allergies,
            "Additional Accomodations": camper.specialNeeds,
            "Amount Paid":
              camper.charges.camp +
              camper.charges.earlyDropoff +
              camper.charges.latePickup,
            "Additional Camp-Specific Q's": campersWithSpecficQuestions.includes(
              camper.id,
            )
              ? "Y"
              : "N",
            "Additional Waiver Clauses":
              camper.optionalClauses.length > 0 ? "Y" : "N",
          };
        }),
      );
    } catch (error: unknown) {
      Logger.error(`Failed to get campers. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async createCamp(camp: CreateCampDTO): Promise<CampDTO> {
    let newCamp: Camp;
    let newSessions: CampSessionDTO[];
    let newFormQuestions: string[];

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const fileName = camp.filePath ? uuidv4() : "";
      if (camp.filePath) {
        await this.storageService.createFile(
          fileName,
          camp.filePath,
          camp.fileContentType,
        );
      }

      const stripeCampProduct = await createStripeCampProduct({
        campName: camp.name,
        campDescription: camp.description,
      });
      const stripeDropoffProduct = await createStripeDropoffProduct(camp.name);
      const stripePickupProduct = await createStripePickupProduct(camp.name);

      let priceIds = { dropoffPriceId: "", pickupPriceId: "" };
      if (camp.active) {
        const dropoffPriceObject = await createStripePrice(
          stripeDropoffProduct.id,
          camp.dropoffFee * 100,
        );

        const pickupPriceObject = await createStripePrice(
          stripePickupProduct.id,
          camp.pickupFee * 100,
        );

        priceIds = {
          dropoffPriceId: dropoffPriceObject.id,
          pickupPriceId: pickupPriceObject.id,
        };
      }

      // Create a camp with the default values first for FormQuestions + CampSessions
      newCamp = new MgCamp({
        name: camp.name,
        active: camp.active,
        ageLower: camp.ageLower,
        ageUpper: camp.ageUpper,
        campCoordinators: camp.campCoordinators,
        campCounsellors: camp.campCounsellors,
        description: camp.description,
        dropoffProductId: stripeDropoffProduct.id,
        earlyDropoff: camp.earlyDropoff,
        dropoffFee: camp.dropoffFee,
        pickupFee: camp.pickupFee,
        endTime: camp.endTime,
        latePickup: camp.latePickup,
        location: camp.location,
        campProductId: stripeCampProduct.id,
        pickupProductId: stripePickupProduct.id,
        startTime: camp.startTime,
        fee: camp.fee,
        formQuestions: [],
        volunteers: camp.volunteers,
        ...(camp.filePath && { fileName }),
        ...priceIds,
      });

      newCamp = await newCamp.save({ session });
      newSessions = await this.createCampSessions(
        newCamp.id,
        camp.campSessions,
        session,
      );
      newFormQuestions = await this.addFormQuestionsToCamp(
        newCamp.id,
        camp.formQuestions,
        session,
      );

      await session.commitTransaction();
    } catch (error: unknown) {
      Logger.error(`Failed to create camp. Reason = ${getErrorMessage(error)}`);
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    return {
      id: newCamp.id,
      active: newCamp.active,
      ageLower: newCamp.ageLower,
      ageUpper: newCamp.ageUpper,
      campSessions: newSessions.map((s) => s.toString()),
      campCoordinators: newCamp.campCoordinators.map((coordinator) =>
        coordinator.toString(),
      ),
      campCounsellors: newCamp.campCounsellors.map((counsellor) =>
        counsellor.toString(),
      ),
      name: newCamp.name,
      description: newCamp.description,
      dropoffFee: newCamp.dropoffFee,
      pickupFee: newCamp.pickupFee,
      earlyDropoff: newCamp.earlyDropoff,
      latePickup: newCamp.latePickup,
      location: newCamp.location,
      fee: newCamp.fee,
      formQuestions: newFormQuestions,
      fileName: newCamp.fileName,
      startTime: newCamp.startTime,
      endTime: newCamp.endTime,
      campProductId: newCamp.campProductId,
      dropoffPriceId: newCamp.dropoffPriceId,
      dropoffProductId: newCamp.dropoffProductId,
      pickupPriceId: newCamp.pickupPriceId,
      pickupProductId: newCamp.pickupProductId,
      volunteers: newCamp.volunteers,
    };
  }

  async generateCampersCSV(campSessionId: string): Promise<string> {
    try {
      const campers = await this.getCampersByCampSessionId(campSessionId);
      if (campers.length === 0) {
        // if there are no campers, we return an empty string.
        return "";
      }
      const csvHeaders = Object.keys(campers[0]);
      const csvString = await generateCSV({
        data: campers,
        fields: csvHeaders,
      });
      return csvString;
    } catch (error: unknown) {
      Logger.error(
        `Failed to generate CSV. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async addFormQuestionsToCamp(
    campId: string,
    formQuestions: CreateFormQuestionDTO[],
    dbSession?: mongoose.ClientSession,
  ): Promise<string[]> {
    const formQuestionIds: string[] = [];

    try {
      await Promise.all(
        formQuestions.map(async (formQuestion) => {
          const question = new MgFormQuestion({
            category: formQuestion.category,
            type: formQuestion.type,
            question: formQuestion.question,
            required: formQuestion.required,
            description: formQuestion.description,
            options: formQuestion.options,
          });
          const createdQuestion = await question.save({ session: dbSession });
          formQuestionIds.push(createdQuestion._id);
        }),
      );
    } catch (error: unknown) {
      Logger.error(
        `Failed to create form questions. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }

    try {
      await MgCamp.findByIdAndUpdate(
        campId,
        {
          formQuestions: formQuestionIds,
        },
        { session: dbSession },
      );
    } catch (error: unknown) {
      Logger.error(
        `Failed to insert question ids into camp ${campId}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }

    return formQuestionIds;
  }

  async editFormQuestion(
    formQuestionId: string,
    formQuestion: FormQuestionDTO,
  ): Promise<FormQuestionDTO> {
    try {
      const newFormQuestion: FormQuestion | null = await MgFormQuestion.findByIdAndUpdate(
        formQuestionId,
        {
          category: formQuestion.category,
          type: formQuestion.type,
          question: formQuestion.question,
          required: formQuestion.required,
          description: formQuestion?.description,
          options: formQuestion?.options,
        },
        { runValidators: true, new: true },
      );

      if (!newFormQuestion) {
        throw new Error(
          `FormQuestion with formQuestionId ${formQuestionId} not found.`,
        );
      }

      return {
        id: formQuestionId,
        category: newFormQuestion.category,
        type: newFormQuestion.type,
        question: newFormQuestion.question,
        required: newFormQuestion.required,
        description: newFormQuestion?.description,
        options: newFormQuestion?.options,
      };
    } catch (error: unknown) {
      Logger.error(
        `Failed to edit FormQuestion. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async deleteFormQuestion(
    campId: string,
    formQuestionId: string,
  ): Promise<void> {
    try {
      const oldCamp: Camp | null = await MgCamp.findById(campId);
      if (!oldCamp) {
        throw new Error(`Camp with campId ${campId} not found.`);
      }

      const oldFormQuestions = oldCamp.formQuestions as FormQuestion[];
      if (
        !oldFormQuestions.find(
          (question) => question.toString() === formQuestionId,
        )
      ) {
        throw new Error(
          `FormQuestion with formQuestionId ${formQuestionId} not found for Camp with id ${campId}.`,
        );
      }

      const deletedFormQuestion = await MgFormQuestion.findByIdAndRemove(
        formQuestionId,
      );
      if (!deletedFormQuestion) {
        throw new Error(
          `FormQuestion with formQuestionId ${formQuestionId} not found.`,
        );
      }

      await MgCamp.findByIdAndUpdate(campId, {
        $pullAll: { formQuestions: [deletedFormQuestion.id] },
      });
    } catch (error: unknown) {
      Logger.error(
        `Failed to delete FormQuestion. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async deleteFormQuestionsByIds(
    formQuestionIds: string[],
    dbSession?: mongoose.ClientSession,
  ): Promise<void> {
    try {
      await MgFormQuestion.deleteMany(
        {
          _id: { $in: formQuestionIds },
        },
        { session: dbSession },
      );
    } catch (error: unknown) {
      Logger.error(
        `Failed to delete form questions. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async appendFormQuestions(
    campId: string,
    formQuestions: FormQuestionDTO[],
  ): Promise<string[]> {
    const formQuestionIds: string[] = [];

    try {
      await Promise.all(
        formQuestions.map(async (formQuestion) => {
          const question = await MgFormQuestion.create({
            category: formQuestion.category,
            type: formQuestion.type,
            question: formQuestion.question,
            required: formQuestion.required,
            description: formQuestion.description,
            options: formQuestion.options,
          });
          formQuestionIds.push(question._id);
        }),
      );
    } catch (error: unknown) {
      Logger.error(
        `Failed to create form questions. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }

    try {
      await MgCamp.findByIdAndUpdate(campId, {
        $push: { formQuestions: formQuestionIds },
      });
    } catch (error: unknown) {
      Logger.error(
        `Failed to append question ids into camp ${campId}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }

    return formQuestionIds;
  }
}

export default CampService;
