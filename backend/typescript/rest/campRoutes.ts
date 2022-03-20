import fs from "fs";
import multer from "multer";
import { Router } from "express";
import FileStorageService from "../services/implementations/fileStorageService";
import IFileStorageService from "../services/interfaces/fileStorageService";
import ICampService from "../services/interfaces/campService";
import CampService from "../services/implementations/campService";
import { getErrorMessage } from "../utilities/errorUtils";
import { createCampDtoValidator } from "../middlewares/validators/campValidators";

const upload = multer({ dest: "uploads/" });

const campRouter: Router = Router();

const defaultBucket = process.env.FIREBASE_STORAGE_DEFAULT_BUCKET || "";
const fileStorageService: IFileStorageService = new FileStorageService(
  defaultBucket,
);

const campService: ICampService = new CampService(fileStorageService);

/* Create a camp */
campRouter.post(
  "/",
  upload.single("file"),
  createCampDtoValidator,
  async (req, res) => {
    try {
      const body = JSON.parse(req.body.body);
      const newCamp = await campService.createCamp({
        active: body.active,
        ageLower: body.ageLower,
        ageUpper: body.ageUpper,
        name: body.name,
        description: body.description,
        location: body.location,
        capacity: body.capacity,
        startTime: body.startTime,
        endTime: body.endTime,
        dates: body.dates,
        fee: body.fee,
        formQuestions: body.formQuestions,
        camps: body.camps,
        filePath: req.file?.path,
        fileContentType: req.file?.mimetype,
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
