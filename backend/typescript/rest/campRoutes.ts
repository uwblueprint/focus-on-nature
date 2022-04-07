import { Router } from "express";
import ICampService from "../services/interfaces/campService";
import CampService from "../services/implementations/campService";
import { getErrorMessage } from "../utilities/errorUtils";
import {
  createCampDtoValidator,
  updateCampSessionDtoValidator,
} from "../middlewares/validators/campValidators";

const campRouter: Router = Router();

const campService: ICampService = new CampService();

/* Get all camps */
campRouter.get("/", async (req, res) => {
  try {
    const camps = await campService.getCamps();
    res.status(200).json(camps);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

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

/* Delete a camp session */
campRouter.delete("/session/:campId", async (req, res) => {
  console.log(req.params.campId);
  try {
    await campService.deleteCampSessionById(req.params.campId);
    res.status(204).send();
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Update a camp session */
campRouter.put(
  "/session/:campId",
  updateCampSessionDtoValidator,
  async (req, res) => {
    try {
      const campSession = await campService.editCampSessionById(
        req.params.campId,
        {
          campers: req.body.campers,
          waitlist: req.body.waitlist,
          dates: req.body.dates,
          startTime: req.body.startTime,
          endTime: req.body.endTime,
          active: req.body.active,
        },
      );
      res.status(200).json(campSession);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

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
