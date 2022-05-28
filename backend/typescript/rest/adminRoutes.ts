import { Router } from "express";

import AdminService from "../services/implementations/adminService";
import IAdminService from "../services/interfaces/adminService";
import { getErrorMessage } from "../utilities/errorUtils";
import {
  waiverUpdateValidator,
  formTemplateUpdateValidator,
} from "../middlewares/validators/adminValidators";

const adminRouter: Router = Router();
const adminService: IAdminService = new AdminService();
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

adminRouter.get("/waiver", async (req, res) => {
  try {
    const waiver = await adminService.getWaiver();
    res.status(200).json(waiver);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

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

adminRouter.get("/formTemplate", async (req, res) => {
  try {
    const form = await adminService.getFormTemplate();
    res.status(200).json(form);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default adminRouter;
