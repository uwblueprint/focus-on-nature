import { Router } from "express";

import { isAuthorizedByRole } from "../middlewares/auth";
import { createCamperDtoValidator, updateCamperDtoValidator } from "../middlewares/validators/camperValidators";
import CamperService from "../services/implementations/camperService";
import ICamperService from "../services/interfaces/camperService";
import { getErrorMessage } from "../utilities/errorUtils";
import { sendResponseByMimeType } from "../utilities/responseUtil";
import { CamperDTO } from "../types";

const camperRouter: Router = Router();
camperRouter.use(isAuthorizedByRole(new Set(["Admin"])))

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

/* Update the camper with the specified camperId */
camperRouter.put("/:camperId", updateCamperDtoValidator, async (req, res) => {
  try {
    const updatedCamper = await camperService.updateCamperById(
      req.params.camperId,
      {
        camp: req.body.camp,
        formResponses: req.body.formResponses,
        dropOffType: req.body.dropOffType,
        registrationDate: req.body.registrationDate,
        hasPaid: req.body.hasPaid,
        chargeId: req.body.chargeId,
      },
    );
    res.status(200).json(updatedCamper);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default camperRouter;
