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
  deleteCampSessionsDtoValidator,
  editFormQuestionValidator,
  getCampDtoValidator,
  updateCampDtoValidator,
  updateCampSessionDtoValidator,
  updateCampSessionsDtoValidator,
} from "../middlewares/validators/campValidators";

const upload = multer({ dest: "uploads/" });

const campRouter: Router = Router();

const defaultBucket = process.env.FIREBASE_STORAGE_DEFAULT_BUCKET || "";
const fileStorageService: IFileStorageService = new FileStorageService(
  defaultBucket,
);

const campService: ICampService = new CampService(fileStorageService);
/* Get all camps */
campRouter.get("/", getCampDtoValidator, async (req, res) => {
  try {
    const { campYear } = req.query;
    const camps = await campService.getCamps(parseInt(campYear as string, 10));
    res.status(200).json(camps);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

campRouter.get("/:id", async (req, res) => {
  try {
    if (req.query?.wId && req.query?.session) {
      const camp = await campService.getCampById(
        req.params.id,
        req.query?.session as string,
        req.query?.wId as string,
      );

      res.status(200).json(camp);
    } else if (req.query?.wId || req.query?.session) {
      const error = new Error(`missing wId or session query param`);
      res.status(401).json({ error: getErrorMessage(error) });
    } else {
      const camp = await campService.getCampById(req.params.id);
      res.status(200).json(camp);
    }
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
        name: body.name,
        description: body.description,
        earlyDropoff: body.earlyDropoff,
        dropoffFee: body.dropoffFee,
        pickupFee: body.pickupFee,
        latePickup: body.latePickup,
        location: body.location,
        fee: body.fee,
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
campRouter.patch(
  "/:campId",
  upload.single("file"),
  updateCampDtoValidator,
  async (req, res) => {
    try {
      const body = JSON.parse(req.body.data);
      const newCamp = await campService.updateCampById(req.params.campId, {
        active: body.active,
        ageLower: body.ageLower,
        ageUpper: body.ageUpper,
        campCoordinators: body.campCoordinators,
        campCounsellors: body.campCounsellors,
        name: body.name,
        description: body.description,
        dropoffFee: body.dropoffFee,
        pickupFee: body.pickupFee,
        earlyDropoff: body.earlyDropoff,
        latePickup: body.latePickup,
        location: body.location,
        fee: body.fee,
        filePath: req.file?.path,
        fileContentType: req.file?.mimetype,
        startTime: body.startTime,
        endTime: body.endTime,
        volunteers: body.volunteers,
      });
      if (req.file?.path) {
        fs.unlinkSync(req.file.path);
      }
      res.status(200).json(newCamp);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

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

/* Update camp sessions */
campRouter.patch(
  "/:campId/session/",
  updateCampSessionsDtoValidator,
  async (req, res) => {
    try {
      const campSession = await campService.updateCampSessionsByIds(
        req.params.campId,
        req.body.updatedCampSessions,
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

/* Delete camp sessions */
campRouter.delete(
  "/:campId/session/",
  deleteCampSessionsDtoValidator,
  async (req, res) => {
    try {
      await campService.deleteCampSessionsByIds(
        req.params.campId,
        req.body.campSessionIds,
      );
      res.status(204).send();
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

campRouter.post(
  "/:campId/form/",
  createFormQuestionsValidator,
  async (req, res) => {
    try {
      const successfulFormQuestions = await campService.createFormQuestions(
        req.params.campId,
        req.body.formQuestions,
      );
      res.status(200).json(successfulFormQuestions);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

campRouter.put(
  "/:campId/form/:formQuestionId/",
  editFormQuestionValidator,
  async (req, res) => {
    try {
      const successfulFormQuestion = await campService.editFormQuestion(
        req.params.formQuestionId,
        req.body.formQuestion,
      );

      res.status(200).json(successfulFormQuestion);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

campRouter.delete("/:campId/form/:formQuestionId/", async (req, res) => {
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
        req.body.formQuestions,
      );
      res.status(200).json(successfulFormQuestions);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

/* Delete a camp */
campRouter.delete("/:id", async (req, res) => {
  try {
    await campService.deleteCamp(req.params.id);
    res.status(204).send();
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default campRouter;
