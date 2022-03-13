import { Router } from "express";
import ICampService from "../services/interfaces/campService";
import CampService from "../services/implementations/campService";
import { getErrorMessage } from "../utilities/errorUtils";
import { createCampDtoValidator } from "../middlewares/validators/campValidators";
import waiverModel from "../models/waiver.model";
import { runInNewContext } from "vm";

const campRouter: Router = Router();

const campService: ICampService = new CampService();

/* Create a camp */
campRouter.post("/", createCampDtoValidator, async (req, res) => {
  try {
    const newCamp = await campService.createCamp({
      active: req.body.active,
      ageLower: req.body.ageLower,
      ageUpper: req.body.ageUpper,
      name: req.body.name,
      description: req.body.description,
      location: req.body.location,
      capacity: req.body.capacity,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      dates: req.body.dates,
      fee: req.body.fee,
      camperInfo: req.body.camperInfo,
      camps: req.body.camps,
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

campRouter.post("/waiver", async (req, res) => {
  try {
    console.log(req.body)
    const waiver = await waiverModel.updateOne(
      {
        paragraphs: {'$exists': true}
      },
      {
        $set: {paragraphs: req.body}
      },
      {upsert: true}
    )
    // const waiver = await waiverModel.updateOne(
    //   {
    //     ...req.body,
    //   },
    //   {
    //     ...req.body,
    //   },
    //   { upsert: true },
    // );
    res.status(200).json(waiver);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

campRouter.get("/waiver", async (req, res) => {
  try {
    const waiver = await waiverModel.findOne();
    res.status(200).json(waiver);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default campRouter;
