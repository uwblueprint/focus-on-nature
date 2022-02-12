import { Router } from "express";

import { createCamperDtoValidator } from "../middlewares/validators/camperValidators";
import CamperService from "../services/implementations/camperService";
import ICamperService from "../services/interfaces/camperService";
import { getErrorMessage } from "../utilities/errorUtils";

const camperRouter: Router = Router();
const camperService: ICamperService = new CamperService();

/* Create a camper */
camperRouter.post("/", createCamperDtoValidator, async (req, res) => {
  try {
    const newCamper = await camperService.createCamper({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      parentName: req.body.parentName,
      contactEmail: req.body.contactEmail,
      contactNumber: req.body.contactNumber,
      camp: req.body.camp,
      hasCamera: req.body.hasCamera,
      hasLaptop: req.body.hasLaptop,
      allergies: req.body.allergies,
      additionalDetails: req.body.additionalDetails,
      dropOffType: req.body.dropOffType,
      registrationDate: req.body.registrationDate,
      hasPaid: req.body.hasPaid,
      chargeId: req.body.chargeId,
    });

    res.status(201).json(newCamper);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default camperRouter;
