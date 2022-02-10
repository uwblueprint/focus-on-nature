import { Router } from "express";
import { updateCamperDtoValidator } from "../middlewares/validators/camperValidators";
import CamperService from "../services/implementations/camperService";
import CammperService from "../services/implementations/camperService";
import ICamperService from "../services/interfaces/camperService";
import { getErrorMessage } from "../utilities/errorUtils";

const camperRouter: Router = Router();

const camperService: ICamperService = new CamperService(); 

/* Update the camper with the specified camperId */
camperRouter.put("/:camperId", updateCamperDtoValidator, async (req, res) => {
    try {
      const updatedCamper = await camperService.updateCamperById(req.params.camperId, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        parentName: req.body.parentName,
        contactEmail: req.body.contactEmail,
        contactNumber: req.body.contactNumber,
        camps: req.body.camps,
        hasCamera: req.body.hasCamera,
        hasLaptop: req.body.hasLaptop,
        allergies: req.body.allergies,
        additionalDetails: req.body.additionalDetails,
        dropOffType: req.body.dropOffType,
        registrationDate: req.body.registrationDate,
        hasPaid: req.body.hasPaid,
        chargeId: req.body.chargeId,
      });
      res.status(200).json(updatedCamper);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  });