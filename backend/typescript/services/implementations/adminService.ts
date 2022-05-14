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
    let formTemplateDTO: FormTemplateDTO | null;
    try {
      /* eslint no-underscore-dangle: 0 */
      const formQuestions: Array<FormQuestionDTO> = [];
      let oldFormQuestion = await this.getFormTemplate()
        await Promise.all(
          oldFormQuestion.formQuestions.map(async question => {
            await formQuestionModel.remove(question)
          }),
        );
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
      await formTemplateModel.remove({});
      await formTemplateModel.create({formQuestions})
      formTemplateDTO = await this.getFormTemplate();
    } catch (error: unknown) {
      Logger.error(
        `Failed to update form template. Reason: ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return formTemplateDTO;
  }

  async getFormTemplate(): Promise<FormTemplateDTO> {
    let formTemplateDTO: FormTemplateDTO | null;
    let form: FormTemplateDTO | null;
    try {
      form = await formTemplateModel.findOne().populate({
        path: "formQuestions",
        model: MgFormQuestion,
      });
      if (!form) {
        throw new Error(`Form not found.`);
      }
      formTemplateDTO = {
        formQuestions: form.formQuestions,
      };
    } catch (error: unknown) {
      Logger.error(
        `Failed to get form template. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return formTemplateDTO;
  }
}

export default AdminService;
