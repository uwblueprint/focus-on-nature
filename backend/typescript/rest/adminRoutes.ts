import { Router } from "express";

import AdminService from "../services/implementations/adminService";
import IAdminService from "../services/interfaces/adminService";
import { getErrorMessage } from "../utilities/errorUtils";
import { sendResponseByMimeType } from "../utilities/responseUtil";
import { WaiverDTO } from "../types";

const adminRouter: Router = Router();
const adminService: IAdminService = new AdminService(); 



adminRouter.post("/waiver", async (req, res) => {
    try {
      console.log(req.body)
      const waiver = await adminService.updateWaiver({
          clauses: req.body
      })
      res.status(200).json(waiver);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  });
  
  adminRouter.get("/waiver", async (req, res) => {
    try {
      const waiver = await adminService.getWaiver()
      res.status(200).json(waiver);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  });

  export default adminRouter;