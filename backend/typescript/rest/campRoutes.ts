import { Router } from "express";
import ICampService from "../services/interfaces/campService";
import CampService from "../services/implementations/campService";
import { getErrorMessage } from "../utilities/errorUtils";
import { createCampDtoValidator } from "../middlewares/validators/campValidators";

const campRouter: Router = Router();

const campService: ICampService = new CampService();

/* Create a camp */
campRouter.post("/", createCampDtoValidator, async (req, res) => {
  try {
    const newCamp = await campService.createCamp({
      ageLower: req.body.ageLower,
      ageUpper: req.body.ageUpper,
      name: req.body.name,
      description: req.body.description,
      location: req.body.location,
      capacity: req.body.capacity,
      fee: req.body.fee,
      formQuestions: req.body.formQuestions,
      campSessions: req.body.campSessions,
    });

    res.status(201).json(newCamp);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Returns a CSV string containing all campers within a specific camp */
campRouter.get("/csv/:id", async (req, res) => {
  try {
    const csvString = await campService.generateCampersCSV(req.params.id);
    res.status(200).set("Content-Type", "text/csv").send(csvString);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default campRouter;
