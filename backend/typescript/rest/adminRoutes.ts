import { Router } from "express";

import AdminService from "../services/implementations/adminService";
import IAdminService from "../services/interfaces/adminService";
import { getErrorMessage } from "../utilities/errorUtils";
import nodemailerConfig from "../nodemailer.config";
import { waiverUpdateValidator } from "../middlewares/validators/adminValidators";
import EmailService from "../services/implementations/emailService";
import IEmailService from "../services/interfaces/emailService";

const adminRouter: Router = Router();
const adminService: IAdminService = new AdminService();
const emailService: IEmailService = new EmailService(nodemailerConfig);
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

adminRouter.get("/email", async (req, res) => {
  try {
    const waiver = await emailService.registrationInviteEmail("umaryousafzai@uwblueprint.org", "waterloo", "list", "2012-2014", "www.google.ca")
    res.status(200).json(waiver);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default adminRouter;
