import IAdminService from "../interfaces/adminService";
import waiverModel, { Waiver } from "../../models/waiver.model";
import { FormQuestionDTO, FormTemplateDTO, WaiverDTO } from "../../types";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import formTemplateModel from "../../models/formTemplate.model";
/* eslint-disable import/no-duplicates */
import formQuestionModel from "../../models/formQuestion.model";
import MgFormQuestion from "../../models/formQuestion.model";

const Logger = logger(__filename);

class AdminService implements IAdminService {
  /* eslint-disable class-methods-use-this */
  async updateWaiver(waiver: WaiverDTO): Promise<WaiverDTO> {
    let waiverDto: WaiverDTO | null;
    try {
      await waiverModel.updateOne(
        {
          clauses: { $exists: true },
        },
        {
          $set: { clauses: waiver.clauses },
        },
        { upsert: true, runValidators: true },
      );
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
    let waiver: Waiver | null;
    try {
      waiver = await waiverModel.findOne();
      if (!waiver) {
        throw new Error(`Waiver not found.`);
      }
      waiverDto = {
        clauses: waiver.clauses,
      };
    } catch (error: unknown) {
      Logger.error(`Failed to get waiver. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
    return waiverDto;
  }

  async updateFormTemplate(form: FormTemplateDTO): Promise<FormTemplateDTO> {
    try {
      const formQuestions: Array<FormQuestionDTO> = [];
      // Delete old questions before creating new ones
      let oldFormTemplate = await formTemplateModel.findOne();
      if (oldFormTemplate) {
        await formQuestionModel.deleteMany({
          _id: {
            $in: oldFormTemplate.formQuestions,
          },
        });
      }
      await Promise.all(
        form.formQuestions.map(async (formQuestion, i) => {
          const question = await formQuestionModel.create({
            type: formQuestion.type,
            question: formQuestion.question,
            required: formQuestion.required,
            description: formQuestion.description,
            options: formQuestion.options,
          });
          formQuestions[i] = question._id;
        }),
      );
      await formTemplateModel.updateOne(
        {},
        { $set: { formQuestions } },
        { runValidators: true, upsert: true },
      );
    } catch (error: unknown) {
      Logger.error(
        `Failed to update form template. Reason: ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return await this.getFormTemplate();
  }

  async getFormTemplate(): Promise<FormTemplateDTO> {
    let form: FormTemplateDTO | null;
    try {
      form = await formTemplateModel.findOne().populate({
        path: "formQuestions",
        model: MgFormQuestion,
      });
      if (!form) {
        throw new Error(`Form not found.`);
      }
    } catch (error: unknown) {
      Logger.error(
        `Failed to get form template. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return form;
  }
}

export default AdminService;
