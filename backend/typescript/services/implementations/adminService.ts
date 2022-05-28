import IAdminService from "../interfaces/adminService";
import MgWaiver, { Waiver } from "../../models/waiver.model";
import { FormQuestionDTO, FormTemplateDTO, WaiverDTO } from "../../types";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import MgFormTemplate from "../../models/formTemplate.model";
import MgFormQuestion from "../../models/formQuestion.model";

const Logger = logger(__filename);

class AdminService implements IAdminService {
  /* eslint-disable class-methods-use-this */
  async updateWaiver(waiver: WaiverDTO): Promise<WaiverDTO> {
    let waiverDto: WaiverDTO | null;
    try {
      await MgWaiver.updateOne(
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
      waiver = await MgWaiver.findOne();
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
      const oldFormTemplate = await MgFormTemplate.findOne();
      if (oldFormTemplate) {
        await MgFormQuestion.deleteMany({
          _id: {
            $in: oldFormTemplate.formQuestions,
          },
        });
      }
      /* eslint-disable no-underscore-dangle */
      await Promise.all(
        form.formQuestions.map(async (formQuestion, i) => {
          const question = await MgFormQuestion.create({
            type: formQuestion.type,
            question: formQuestion.question,
            required: formQuestion.required,
            description: formQuestion.description,
            options: formQuestion.options,
          });
          formQuestions[i] = question._id;
        }),
      );
      await MgFormTemplate.updateOne(
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
    const formTemplate: FormTemplateDTO = await this.getFormTemplate();
    return formTemplate;
  }

  async getFormTemplate(): Promise<FormTemplateDTO> {
    let form: FormTemplateDTO | null;
    try {
      form = await MgFormTemplate.findOne().populate({
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
