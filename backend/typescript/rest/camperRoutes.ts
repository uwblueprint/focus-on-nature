import { Router } from "express";

import { createCamperDtoValidator } from "../middlewares/validators/camperValidators";
import CamperService from "../services/implementations/camperService";
import ICamperService from "../services/interfaces/camperService";
import { getErrorMessage } from "../utilities/errorUtils";
import { sendResponseByMimeType } from "../utilities/responseUtil";
import { CamperDTO } from "../types";
import { createWaitlistedCamperDtoValidator } from "../middlewares/validators/waitlistedCamperValidators";

const camperRouter: Router = Router();
const camperService: ICamperService = new CamperService();

/* Create a camper */
camperRouter.post("/register", createCamperDtoValidator, async (req, res) => {
  try {
    const newCamper = await camperService.createCamper({
      camp: req.body.camp,
      registrationDate: req.body.registrationDate,
      hasPaid: req.body.hasPaid,
      chargeId: req.body.chargeId,
      formResponses: req.body.formResponses,
    });

    res.status(201).json(newCamper);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Get all campers, optionally filter by camp ID */
camperRouter.get("/", async (req, res) => {
  const { campId } = req.query;
  const contentType = req.headers["content-type"];
  if (!campId) {
    // get all campers from all camps
    try {
      const campers = await camperService.getAllCampers();
      await sendResponseByMimeType<CamperDTO>(res, 200, contentType, campers);
    } catch (error: unknown) {
      await sendResponseByMimeType(res, 500, contentType, [
        {
          error: getErrorMessage(error),
        },
      ]);
    }
    return;
  }

  if (campId) {
    if (typeof campId !== "string") {
      res
        .status(400)
        .json({ error: "campId query parameter must be a string." });
    } else {
      try {
        const campers = await camperService.getCampersByCampId(campId);
        await sendResponseByMimeType<CamperDTO>(res, 200, contentType, campers);
      } catch (error: unknown) {
        await sendResponseByMimeType(res, 500, contentType, [
          {
            error: getErrorMessage(error),
          },
        ]);
      }
    }
  }
});

camperRouter.post(
  "/waitlist",
  createWaitlistedCamperDtoValidator,
  async (req, res) => {
    try {
      const newWaitlistedCamper = await camperService.createWaitlistedCamper({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        contactName: req.body.contactName,
        contactEmail: req.body.contactEmail,
        contactNumber: req.body.contactNumber,
        camp: req.body.camp,
      });

      res.status(201).json(newWaitlistedCamper);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

/* Delete all campers with the chargeId */
camperRouter.delete("/cancel/:chargeId", async (req, res) => {
  try {
    await camperService.deleteCampersByChargeId(req.params.chargeId);
    res.status(204).send();
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Delete a camper */
camperRouter.delete("/:camperId", async (req, res) => {
  try {
    await camperService.deleteCamperById(req.params.camperId);
    res.status(204).send();
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});


export default camperRouter;
