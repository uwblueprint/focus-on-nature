import { Router } from "express";

import AdminService from "../services/implementations/adminService";
import IAdminService from "../services/interfaces/adminService";
import { getErrorMessage } from "../utilities/errorUtils";
import {
  waiverUpdateValidator,
  formTemplateUpdateValidator,
  formTemplateAddQuestionValidator,
  formTemplateRemoveQuestionValidator,
} from "../middlewares/validators/adminValidators";
import { isAuthorizedByRole } from "../middlewares/auth";

const adminRouter: Router = Router();
const adminService: IAdminService = new AdminService();

// ROLES: Admin
adminRouter.post("/waiver", waiverUpdateValidator, async (req, res) => {
  try {
    const waiver = await adminService.updateWaiver({
      clauses: req.body.clauses,
    });
    res.status(200).json(waiver);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

// ROLES: Unprotected
adminRouter.get("/waiver", async (req, res) => {
  try {
    const waiver = await adminService.getWaiver();
    res.status(200).json(waiver);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

// ROLES: Admin
adminRouter.post(
  "/formTemplate",
  formTemplateUpdateValidator,
  async (req, res) => {
    try {
      const form = await adminService.updateFormTemplate({
        formQuestions: req.body.formQuestions,
      });
      res.status(200).json(form);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

// ROLES: Admin + CC
adminRouter.get("/formTemplate", async (req, res) => {
  try {
    const form = await adminService.getFormTemplate();
    res.status(200).json(form);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

// ROLES: Admin
adminRouter.delete(
  "/formTemplate/formQuestion/:formQuestionId",
  formTemplateRemoveQuestionValidator,
  isAuthorizedByRole(new Set(["Admin"])),
  async (req, res) => {
    try {
      await adminService.removeQuestionFromTemplate(req.params.formQuestionId);
      res.status(200).json(req.params.formQuestionId);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

// ROLES: Admin
adminRouter.patch(
  "/formTemplate/formQuestion",
  formTemplateAddQuestionValidator,
  isAuthorizedByRole(new Set(["Admin"])),
  async (req, res) => {
    try {
      const newQuestion = await adminService.addQuestionToTemplate({
        question: req.body.formQuestion.question,
        required: req.body.formQuestion.required,
        category: req.body.formQuestion.category,
        options: req.body.formQuestion.options,
        description: req.body.formQuestion.description,
        type: req.body.formQuestion.type,
      });
      res.status(200).json(newQuestion);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

export default adminRouter;
