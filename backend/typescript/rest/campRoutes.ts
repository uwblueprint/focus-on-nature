import fs from "fs";
import multer from "multer";
import { Router } from "express";
import FileStorageService from "../services/implementations/fileStorageService";
import IFileStorageService from "../services/interfaces/fileStorageService";
import ICampService from "../services/interfaces/campService";
import CampService from "../services/implementations/campService";
import { getErrorMessage } from "../utilities/errorUtils";
import {
  createCampDtoValidator,
  createCampSessionsDtoValidator,
  createFormQuestionsValidator,
  updateCampDtoValidator,
  updateCampSessionDtoValidator,
} from "../middlewares/validators/campValidators";
import { validateFormQuestion } from "../middlewares/validators/formQuestionValidators";

const upload = multer({ dest: "uploads/" });

const campRouter: Router = Router();

const defaultBucket = process.env.FIREBASE_STORAGE_DEFAULT_BUCKET || "";
const fileStorageService: IFileStorageService = new FileStorageService(
  defaultBucket,
);

const campService: ICampService = new CampService(fileStorageService);
/* Get all camps */
campRouter.get("/", async (req, res) => {
  try {
    const camps = await campService.getCamps();
    res.status(200).send(camps);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

// TODO: Functionality
// Create/update/delete formQuestions

// TODO: Required checks:
// dates for campSessions cannot overlap
// fee cannot change after any campSession is published (?)

/* Create a camp */
campRouter.post(
  "/",
  upload.single("file"),
  createCampDtoValidator,
  async (req, res) => {
    // TODO: remove formQuestions and campSessions field

    try {
      const body = JSON.parse(req.body.data);
      const newCamp = await campService.createCamp({
        active: body.active,
        ageLower: body.ageLower,
        ageUpper: body.ageUpper,
        campCoordinators: body.campCoordinators,
        campCounsellors: body.campCounsellors,
        campSessions: body.campSessions,
        name: body.name,
        description: body.description,
        earlyDropoff: body.earlyDropoff,
        latePickup: body.latePickup,
        location: body.location,
        fee: body.fee,
        formQuestions: body.formQuestions,
        filePath: req.file?.path,
        fileContentType: req.file?.mimetype,
        startTime: body.startTime,
        endTime: body.endTime,
        volunteers: body.volunteers,
      });

      if (req.file?.path) {
        fs.unlinkSync(req.file.path);
      }
      res.status(201).json(newCamp);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

/* Update a camp */
campRouter.patch("/:campId", updateCampDtoValidator, async (req, res) => {
  try {
    const newCamp = await campService.updateCampById(req.params.campId, {
      active: req.body.active,
      ageLower: req.body.ageLower,
      ageUpper: req.body.ageUpper,
      campCoordinators: req.body.campCoordinators,
      campCounsellors: req.body.campCounsellors,
      name: req.body.name,
      description: req.body.description,
      earlyDropoff: req.body.earlyDropoff,
      latePickup: req.body.latePickup,
      location: req.body.location,
      fee: req.body.fee,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      volunteers: req.body.volunteers,
    });

    res.status(200).json(newCamp);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Create camp sessions */
campRouter.post(
  "/:campId/session/",
  createCampSessionsDtoValidator,
  async (req, res) => {
    try {
      const campSession = await campService.createCampSessions(
        req.params.campId,
        req.body.campSessions,
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
          capacity: req.body.capacity,
          dates: req.body.dates,
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
    await campService.deleteCampSessionById(
      req.params.campId,
      req.params.campSessionId,
    );
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

campRouter.post(
  "/:campId/form/",
  createFormQuestionsValidator,
  async (req, res) => {
    try {
      const successfulFormQuestions = await campService.createFormQuestions(
        req.params.campId,
        req.body.data.formQuestions,
      );
      res.status(200).json(successfulFormQuestions);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

campRouter.put(
  "/:campId/form/:formQuestionId",
  validateFormQuestion,
  async (req, res) => {
    try {
      const successfulFormQuestion = await campService.editFormQuestion(
        req.params.formQuestionId,
        req.body.data.formQuestion,
      );

      res.status(200).json(successfulFormQuestion);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

campRouter.delete("/:campId/form/:formQuestionId", async (req, res) => {
  try {
    await campService.deleteFormQuestion(
      req.params.campId,
      req.params.formQuestionId,
    );
    res.status(204).send();
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

campRouter.patch(
  "/:campId/form/",
  createFormQuestionsValidator,
  async (req, res) => {
    try {
      const successfulFormQuestions = await campService.appendFormQuestions(
        req.params.campId,
        req.body.data.formQuestions,
      );
      res.status(200).json(successfulFormQuestions);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

export default campRouter;
