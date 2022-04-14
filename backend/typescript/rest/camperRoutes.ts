import { Router } from "express";

import { isAuthorizedByRole } from "../middlewares/auth";
import {
  createCamperDtoValidator,
  updateCamperDtoValidator,
} from "../middlewares/validators/camperValidators";
// eslint-disable-next-line import/no-named-as-default
import CamperService from "../services/implementations/camperService";
import ICamperService from "../services/interfaces/camperService";
import { getErrorMessage } from "../utilities/errorUtils";
import { sendResponseByMimeType } from "../utilities/responseUtil";
import { CamperDTO, WaitlistedCamperDTO } from "../types";
import { createWaitlistedCamperDtoValidator } from "../middlewares/validators/waitlistedCamperValidators";

const camperRouter: Router = Router();

const camperService: ICamperService = new CamperService();

/* Create a camper */
camperRouter.post("/register", createCamperDtoValidator, async (req, res) => {
  try {
    const newCamper = await camperService.createCamper({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      allergies: req.body.allergies,
      hasCamera: req.body.hasCamera,
      hasLaptop: req.body.hasLaptop,
      earlyDropoff: req.body.earlyDropoff,
      latePickup: req.body.latePickup,
      specialNeeds: req.body.specialNeeds,
      contacts: req.body.contacts,
      campSession: req.body.campSession,
      registrationDate: req.body.registrationDate,
      hasPaid: req.body.hasPaid,
      chargeId: req.body.chargeId,
      formResponses: req.body.formResponses,
      charges: req.body.charges,
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
        await sendResponseByMimeType<{
          campers: CamperDTO[];
          waitlist: WaitlistedCamperDTO[];
        }>(res, 200, contentType, campers);
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

camperRouter.get("/refund-confirm/:chargeId", async (req, res) => {
  const { chargeId } = req.params;
  try {
    const camper = await camperService.getCampersByChargeId(
      (chargeId as unknown) as string,
    );
    res.status(200).json(camper);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
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
        campSession: req.body.campSession,
      });

      res.status(201).json(newWaitlistedCamper);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

/* Update the camper with the specified camperId */
camperRouter.put(
  "/update",
  updateCamperDtoValidator,
  isAuthorizedByRole(new Set(["Admin"])),
  async (req, res) => {
    try {
      const camperIds = req.body.ids as Array<string>;
      const updatedCampers = await camperService.updateCampersById(camperIds, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        allergies: req.body.allergies,
        hasCamera: req.body.hasCamera,
        hasLaptop: req.body.hasLaptop,
        earlyDropoff: req.body.earlyDropoff,
        latePickup: req.body.latePickup,
        specialNeeds: req.body.specialNeeds,
        contacts: req.body.contacts,
        campSession: req.body.campSession,
        formResponses: req.body.formResponses,
        hasPaid: req.body.hasPaid,
      });
      res.status(200).json(updatedCampers);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

/* Cancel registration for all campers if given conditions are met */
camperRouter.delete("/cancelRegistration", async (req, res) => {
  try {
    const camperIds = req.body as Array<string>;
    await camperService.cancelRegistration(camperIds);
    res.status(204).send();
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Delete a camper */
camperRouter.delete("/delete", async (req, res) => {
  try {
    const camperIds = req.body as Array<string>;
    await camperService.deleteCampersById(camperIds);
    res.status(204).send();
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default camperRouter;
