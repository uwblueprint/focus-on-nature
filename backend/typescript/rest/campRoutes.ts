import { Router } from "express";
import ICampService from "../services/interfaces/campService";
import CampService from "../services/implementations/campService";
import { getErrorMessage } from "../utilities/errorUtils";
import { createCampDtoValidator } from "../middlewares/validators/campValidators";

const campRouter: Router = Router();

const campService: ICampService = new CampService();

campRouter.get("/csv/:id", async (req, res) => {
  try {
    const csvString = await campService.generateCampersCSV(req.params.id);
    res.status(200).json(csvString);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Create a camp */
campRouter.post("/", createCampDtoValidator, async (req, res) => {
  try {
    const newCamp = await campService.createCamp({
      campers: req.body.campers,
      waitlist: req.body.waitlist,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      active: req.body.active,
      name: req.body.name,
      description: req.body.description,
      location: req.body.location,
      capacity: req.body.capacity,
      fee: req.body.fee,
      camperInfo: req.body.camperInfo,
      camps: req.body.camps,
    });

    res.status(201).json(newCamp);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default campRouter;
