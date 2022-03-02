import { Router } from "express";

import { createWaitlistedCamperDtoValidator } from "../middlewares/validators/camperValidators";
import WaitlistService from "../services/implementations/waitlistService";
import IWaitlistService from "../services/interfaces/waitlistService";
import { getErrorMessage } from "../utilities/errorUtils";

const waitlistRouter: Router = Router();
const waitlistService: IWaitlistService = new WaitlistService();

/* Create a camper */
waitlistRouter.post(
  "/register",
  createWaitlistedCamperDtoValidator,
  async (req, res) => {
    try {
      const newWaitlistedCamper = await waitlistService.createWaitlistedCamper({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        contactName: req.body.contactName,
        contactEmail: req.body.contactEmail,
        contactNumber: req.body.contactNumber,
        camp: req.body.camp,
      });

      res.status(201).json(newWaitlistedCamper);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

export default waitlistRouter;
