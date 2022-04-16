import { Router } from "express";
import ICampService from "../services/interfaces/campService";
import CampService from "../services/implementations/campService";
import { getErrorMessage } from "../utilities/errorUtils";
import {
  createCampDtoValidator,
  createCampSessionDtoValidator,
  updateCampDtoValidator,
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

// Required checks:
// sort campSession by date
// dates for campSessions cannot overlap
// fee cannot change after any campSession is published (?)

/* Create a camp */
campRouter.post("/", createCampDtoValidator, async (req, res) => {
  // TODO: remove formQuestions and campSessions field
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

    res.status(200).json(newCamp);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Update a camp */
campRouter.patch("/:campId", updateCampDtoValidator, async (req, res) => {
  try {
    const newCamp = await campService.updateCamp(req.params.campId, {
      ageLower: req.body.ageLower,
      ageUpper: req.body.ageUpper,
      name: req.body.name,
      description: req.body.description,
      location: req.body.location,
      capacity: req.body.capacity,
      fee: req.body.fee,
    });

    res.status(200).json(newCamp);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Create a camp session */
campRouter.post(
  "/:campId/session/",
  createCampSessionDtoValidator,
  async (req, res) => {
    try {
      const campSession = await campService.createCampSession(
        req.params.campId,
        {
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

/* Update a camp session */
campRouter.patch(
  "/:campId/session/:campSessionId",
  updateCampSessionDtoValidator,
  async (req, res) => {
    try {
      const campSession = await campService.updateCampSessionById(
        req.params.campId,
        req.params.campSessionId,
        {
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

/* Delete a camp session */
campRouter.delete("/:campId/session/:campSessionId", async (req, res) => {
  try {
    await campService.deleteCampSessionById(req.params.campSessionId);
    res.status(204).send();
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
