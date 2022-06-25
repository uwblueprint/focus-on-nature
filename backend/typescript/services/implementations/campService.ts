/* eslint-disable no-underscore-dangle */
import { Schema } from "mongoose";
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
} from "../../types";

import ICampService from "../interfaces/campService";
import { getErrorMessage } from "../../utilities/errorUtils";
import { generateCSV } from "../../utilities/CSVUtils";
import logger from "../../utilities/logger";
import MgCamp, { Camp } from "../../models/camp.model";
import MgCampSession, { CampSession } from "../../models/campSession.model";
import MgFees, { Fees } from "../../models/fees.model";
import MgFormQuestion, { FormQuestion } from "../../models/formQuestion.model";
import MgCamper, { Camper } from "../../models/camper.model";
import {
  createStripeCampProducts,
  createStripePrice,
  IStripeCampProducts,
} from "../../utilities/stripeUtils";

const Logger = logger(__filename);

class CampService implements ICampService {
  storageService: IFileStorageService;

  constructor(storageService: IFileStorageService) {
    this.storageService = storageService;
  }

  /* eslint-disable class-methods-use-this */
  async getCamps(): Promise<GetCampDTO[]> {
    try {
      const camps: Camp[] | null = await MgCamp.find({})
        .populate({
          path: "campSessions",
          model: MgCampSession,
        })
        .populate({
          path: "formQuestions",
          model: MgFormQuestion,
        });

      if (!camps) {
        return [];
      }

      return camps.map((camp) => {
        const formQuestions = (camp.formQuestions as FormQuestion[]).map(
          (formQuestion: FormQuestion) => {
            return {
              id: formQuestion.id,
              type: formQuestion.type,
              question: formQuestion.question,
              required: formQuestion.required,
              description: formQuestion.description,
              options: formQuestion.options,
            };
          },
        );

        const campSessions = (camp.campSessions as CampSession[]).map(
          (campSession) => ({
            id: campSession.id,
            capacity: campSession.capacity,
            dates: campSession.dates.map((date) => date.toString()),
            registrations: campSession.campers.length,
            waitlist: campSession.waitlist.length,
            campPriceId: "",
            dropoffPriceId: "",
            pickUpPriceId: "",
          }),
        );

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
          location: camp.location,
          campProductId: camp.campProductId,
          dropoffProductId: camp.dropoffProductId,
          pickUpProductId: camp.pickUpProductId,
          startTime: camp.startTime,
          endTime: camp.endTime,
          fee: camp.fee,
          formQuestions,
          campSessions,
          volunteers: camp.volunteers,
        };
      });
    } catch (error: unknown) {
      Logger.error(`Failed to get camps. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async updateCampById(campId: string, camp: UpdateCampDTO): Promise<CampDTO> {
    let oldCamp: Camp | null;
    let newCamp: Camp | null;
    try {
      oldCamp = await MgCamp.findById(campId);

      if (!oldCamp) {
        throw new Error(`Camp' with campId ${campId} not found.`);
      }

      if (oldCamp.active && camp.fee) {
        throw new Error(`Error - cannot update fee of active camp`);
      }

      newCamp = await MgCamp.findByIdAndUpdate(campId, {
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
          location: camp.location,
          startTime: camp.startTime,
          endTime: camp.endTime,
          volunteers: camp.volunteers,
          fee: camp.fee,
        },
      });
    } catch (error: unknown) {
      Logger.error(`Failed to update camp. Reason = ${getErrorMessage(error)}`);
      throw error;
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
      campSessions: oldCamp.campSessions.map((session) => session.toString()),
      name: camp.name,
      description: camp.description,
      earlyDropoff: camp.earlyDropoff,
      latePickup: camp.latePickup,
      location: camp.location,
      campProductId: newCamp?.campProductId || "",
      dropoffProductId: newCamp?.dropoffProductId || "",
      pickUpProductId: newCamp?.pickUpProductId || "",
      startTime: camp.startTime,
      endTime: camp.endTime,
      fee: camp.fee,
      formQuestions: oldCamp.formQuestions.map((formQuestion) =>
        formQuestion.toString(),
      ),
      volunteers: camp.volunteers,
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
        dropoffPriceId: "",
        pickUpPriceId: "",
      });
    });

    let newCampSessions: Array<CampSession> = [];
    let newCampSessionsIds: Array<string>;

    try {
      newCampSessions = await MgCampSession.insertMany(insertCampSessions);
      newCampSessionsIds = newCampSessions.map((session) => session.id);
      await MgCamp.findByIdAndUpdate(
        campId,
        {
          $push: { campSessions: newCampSessionsIds },
        },
        { runValidators: true },
      );
    } catch (error: unknown) {
      try {
        Promise.all(
          newCampSessions.map(async (session) => {
            MgCampSession.findByIdAndDelete(session.id);
          }),
        );
      } catch (rollbackError: unknown) {
        Logger.error(
          `Failed to rollback camp session creation error. Reason = ${getErrorMessage(
            rollbackError,
          )}`,
        );
      }

      Logger.error(
        `Failed to create CampSession. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
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
          dropoffPriceId: session.dropoffPriceId,
          pickUpPriceId: session.pickUpPriceId,
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
            oldCampSession.campers !== null &&
            campSession.capacity < oldCampSession.campers.length
          ) {
            throw new Error(
              `Cannot decrease capacity to current number of registered campers. Requested capacity change: ${campSession.capacity}, current number of registed campers: ${oldCampSession.campers.length}`,
            );
          }
          if (oldCampSession.dates.length != campSession.dates.length) {
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
          capacity: campSession.capacity,
          dates: campSession.dates ? campSession.dates.sort() : undefined,
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
        dropoffPriceId: newCampSession.dropoffPriceId,
        pickUpPriceId: newCampSession.pickUpPriceId,
      };
    } catch (error: unknown) {
      Logger.error(
        `Failed to edit CampSession. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
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
        throw new Error(`Camp with id ${campSessionId} not found.`);
      }
      const campers = campSession.campers as Camper[];

      const questionIds = new Set(
        campers.length > 0
          ? campers.reduce((prevCamper, currCamper) => {
              return [
                ...prevCamper,
                ...Array.from(currCamper.formResponses.keys()),
              ];
            }, Array.from(campers[0].formResponses.keys()))
          : [],
      );

      const formQuestions = await MgFormQuestion.find({
        _id: Array.from(questionIds),
      });

      const formQuestionMap: { [id: string]: string } = {};

      formQuestions.forEach((formQuestion) => {
        formQuestionMap[formQuestion._id] = formQuestion.question;
      });

      return await Promise.all(
        campers.map(async (camper) => {
          const { formResponses } = camper;
          const formResponseObject: { [key: string]: string } = {};

          Array.from(formResponses.keys()).forEach((questionId) => {
            const question = formQuestionMap[questionId];
            const answer = formResponses.get(questionId);
            formResponseObject[question] = answer as string;
          });

          return {
            firstName: camper.firstName,
            lastName: camper.lastName,
            age: camper.age,
            allergies: camper.allergies,
            hasCamera: camper.hasCamera,
            hasLaptop: camper.hasLaptop,
            earlyDropoff: camper.earlyDropoff.map((date) => date.toString()),
            latePickup: camper.latePickup.map((date) => date.toString()),
            specialNeeds: camper.specialNeeds,
            contacts: camper.contacts,
            formResponses: formResponseObject,
            registrationDate: camper.registrationDate.toString(),
            hasPaid: camper.hasPaid,
            chargeId: camper.chargeId,
            optionalClauses: camper.optionalClauses,
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

    try {
      const fileName = camp.filePath ? uuidv4() : "";
      if (camp.filePath) {
        await this.storageService.createFile(
          fileName,
          camp.filePath,
          camp.fileContentType,
        );
      }

      const stripeProducts: IStripeCampProducts = await createStripeCampProducts(
        camp.name,
        camp.description,
      );

      newCamp = new MgCamp({
        name: camp.name,
        active: camp.active,
        ageLower: camp.ageLower,
        ageUpper: camp.ageUpper,
        campCoordinators: camp.campCoordinators,
        campCounsellors: camp.campCounsellors,
        description: camp.description,
        dropoffProductId: stripeProducts.dropoffProductId,
        earlyDropoff: camp.earlyDropoff,
        endTime: camp.endTime,
        latePickup: camp.latePickup,
        location: camp.location,
        campProductId: stripeProducts.campProductId,
        pickUpProductId: stripeProducts.pickUpProductId,
        startTime: camp.startTime,
        fee: camp.fee,
        formQuestions: [],
        volunteers: camp.volunteers,
        ...(camp.filePath && { fileName }),
      });

      /* eslint no-underscore-dangle: 0 */
      if (camp.formQuestions) {
        await Promise.all(
          camp.formQuestions.map(async (formQuestion, i) => {
            const question = await MgFormQuestion.create({
              type: formQuestion.type,
              question: formQuestion.question,
              required: formQuestion.required,
              description: formQuestion.description,
              options: formQuestion.options,
            });
            newCamp.formQuestions[i] = question._id;
          }),
        );
      }

      if (camp.campSessions) {
        await Promise.all(
          camp.campSessions.map(async (campSession, i) => {
            let priceIds = {};
            if (camp.active) {
              const fees = await MgFees.findOne();
              if (!fees) {
                throw new Error("No fees found in Fees collection");
              }

              const campSessionFeeInCents =
                camp.fee * campSession.dates.length * 100;

              const priceObject = await createStripePrice(
                stripeProducts.campProductId,
                campSessionFeeInCents,
              );

              const dropoffPriceObject = await createStripePrice(
                stripeProducts.dropoffProductId,
                fees.dropoffFee,
              );

              const pickUpPriceObject = await createStripePrice(
                stripeProducts.dropoffProductId,
                fees.pickUpFee,
              );

              priceIds = {
                pickUpPriceId: pickUpPriceObject.id,
                dropoffPriceId: dropoffPriceObject.id,
                campPriceId: priceObject.id,
              };
              // 1. need to save these in the models
              // 2. need to update validators
              // 3. need to add this to editCamp
              // testing
            }

            const session = await MgCampSession.create({
              camp: newCamp,
              campers: [],
              waitlist: [],
              dates: campSession.dates,
              ...priceIds,
            });
            newCamp.campSessions[i] = session._id;
          }),
        );
      }

      try {
        await newCamp.save();
      } catch (error: unknown) {
        // rollback incomplete camp creation

        try {
          newCamp.formQuestions.forEach((formQuestionID) =>
            MgFormQuestion.findByIdAndDelete(formQuestionID),
          );
          newCamp.campSessions.forEach((campSessionID) =>
            MgCampSession.findByIdAndDelete(campSessionID),
          );

          MgCamp.findByIdAndDelete(newCamp.id);
        } catch (rollbackError: unknown) {
          Logger.error(
            `Failed to rollback camp creation error. Reason = ${getErrorMessage(
              rollbackError,
            )}`,
          );
        }

        Logger.error(
          `Failed to create camp. Reason = ${getErrorMessage(error)}`,
        );
        throw error;
      }
    } catch (error: unknown) {
      Logger.error(`Failed to create camp. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return {
      id: newCamp.id,
      active: newCamp.active,
      ageLower: newCamp.ageLower,
      ageUpper: newCamp.ageUpper,
      campSessions: newCamp.campSessions.map((session) => session.toString()),
      campCoordinators: newCamp.campCoordinators.map((coordinator) =>
        coordinator.toString(),
      ),
      campCounsellors: newCamp.campCounsellors.map((counsellor) =>
        counsellor.toString(),
      ),
      name: newCamp.name,
      description: newCamp.description,
      earlyDropoff: newCamp.earlyDropoff,
      latePickup: newCamp.latePickup,
      location: newCamp.location,
      fee: newCamp.fee,
      formQuestions: newCamp.formQuestions.map((formQuestion) =>
        formQuestion.toString(),
      ),
      fileName: newCamp.fileName,
      startTime: newCamp.startTime,
      endTime: newCamp.endTime,
      campProductId: newCamp.campProductId,
      dropoffProductId: newCamp.dropoffProductId,
      pickUpProductId: newCamp.pickUpProductId,
      volunteers: newCamp.volunteers,
    };
  }

  async generateCampersCSV(campSessionId: string): Promise<string> {
    try {
      const campers = await this.getCampersByCampSessionId(campSessionId);
      if (campers.length === 0) {
        // if there are no campers, we return an empty string
        return "";
      }
      let csvHeaders: string[] = [];
      const flattenedCampers = campers.map((camper) => {
        const { formResponses, ...formObj } = camper;
        // grabbing column names
        csvHeaders = [
          ...csvHeaders,
          ...Object.keys(formResponses),
          ...Object.keys(formObj),
        ];
        return {
          ...formResponses,
          ...formObj,
        };
      });
      csvHeaders = Array.from(new Set(csvHeaders));
      const csvString = await generateCSV({
        data: flattenedCampers,
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

  async createFormQuestions(
    campId: string,
    formQuestions: FormQuestionDTO[],
  ): Promise<string[]> {
    const formQuestionIds: string[] = [];

    try {
      await Promise.all(
        formQuestions.map(async (formQuestion) => {
          const question = await MgFormQuestion.create({
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
        formQuestions: formQuestionIds,
      });
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

  async appendFormQuestions(
    campId: string,
    formQuestions: FormQuestionDTO[],
  ): Promise<string[]> {
    const formQuestionIds: string[] = [];

    try {
      await Promise.all(
        formQuestions.map(async (formQuestion) => {
          const question = await MgFormQuestion.create({
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
