import {
  FormQuestionDTO,
  FormTemplateDTO,
  WaiverDTO,
  CreateFormQuestionDTO,
} from "../../types";

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

  /**
   * Creates a new form template or updates it if it already exists.
   * @returns A FormTemplateDTO that contains the waiver.
   * @throws Error if form template retrieval fails.
   */
  updateFormTemplate(form: FormTemplateDTO): Promise<FormTemplateDTO>;

  /**
   * Get the form.
   * @returns A FormTemplateDTO that contains the waiver.
   * @throws Error if form template retrieval fails.
   */
  getFormTemplate(): Promise<FormTemplateDTO>;

  /**
   * Add a question to the form template
   * @returns a FormQuestionDTO for the new form
   * @param formQuestion is an object with the fields of the new question to be added to the template
   * @throws Error if adding the form question fails
   */
  addQuestionToTemplate(
    formQuestion: CreateFormQuestionDTO,
  ): Promise<FormQuestionDTO>;
}

export default IAdminService;
