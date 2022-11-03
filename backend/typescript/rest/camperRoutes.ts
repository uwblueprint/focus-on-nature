import { Router } from "express";

import { isAuthorizedByRole } from "../middlewares/auth";
import {
  cancelCamperDtoValidator,
  createCampersDtoValidator,
  updateCamperDtoValidator,
  deleteCamperDtoValidator,
} from "../middlewares/validators/camperValidators";
// eslint-disable-next-line import/no-named-as-default
import CamperService from "../services/implementations/camperService";
import ICamperService from "../services/interfaces/camperService";
import { getErrorMessage } from "../utilities/errorUtils";
import { sendResponseByMimeType } from "../utilities/responseUtil";
import { CamperDTO, CreateCampersDTO, WaitlistedCamperDTO } from "../types";
import { createWaitlistedCamperDtoValidator } from "../middlewares/validators/waitlistedCamperValidators";

const camperRouter: Router = Router();

const camperService: ICamperService = new CamperService();

/* Create a camper */
camperRouter.post("/register", createCampersDtoValidator, async (req, res) => {
  try {
    const campers = req.body as CreateCampersDTO;
    const newCampers = await camperService.createCampers(
      campers,
      req.query?.wId as string,
    );
    res.status(201).json(newCampers);
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

/* Get campers that have the specified charge ID and session ID */
camperRouter.get("/:chargeId/:sessionId", async (req, res) => {
  const { chargeId, sessionId } = req.params;
  try {
    const camper = await camperService.getCampersByChargeIdAndSessionId(
      (chargeId as unknown) as string,
      (sessionId as unknown) as string,
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
        status: "NotRegistered",
      });

      res.status(201).json(newWaitlistedCamper);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

camperRouter.patch("/waitlist/:waitlistedCamperId", async (req, res) => {
  try {
    const updatedWaitlistedCamper = await camperService.inviteWaitlistedCamper(
      req.params.waitlistedCamperId,
    );
    res.status(200).json(updatedWaitlistedCamper);
  } catch (error: unknown) {
    res.status(500).json({
      error: getErrorMessage(error),
      id: req.params.waitlistedCamperId,
    });
  }
});

/* Update the camper with the specified camperId */
camperRouter.patch(
  "/",
  updateCamperDtoValidator,
  isAuthorizedByRole(new Set(["Admin"])),
  async (req, res) => {
    try {
      const updatedCampers = await camperService.updateCampersById(
        req.body.camperIds,
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          age: req.body.age,
          allergies: req.body.allergies,
          specialNeeds: req.body.specialNeeds,
          campSession: req.body.campSession,
          formResponses: req.body.formResponses,
          hasPaid: req.body.hasPaid,
        },
      );
      res.status(200).json(updatedCampers);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

/* Cancel registration for the list of campers with the chargeId */
camperRouter.delete(
  "/cancel-registration",
  cancelCamperDtoValidator,
  async (req, res) => {
    try {
      await camperService.cancelRegistration(
        req.body.chargeId,
        req.body.camperIds,
      );
      res.status(204).send();
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

/* Delete campers (single or multiple) */
camperRouter.delete("/", deleteCamperDtoValidator, async (req, res) => {
  try {
    await camperService.deleteCampersById(req.body.camperIds);
    res.status(204).send();
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Delete a waitlisted camper */
camperRouter.delete("/waitlist/:waitlistedCamperId", async (req, res) => {
  try {
    await camperService.deleteWaitlistedCamperById(
      req.params.waitlistedCamperId,
    );
    res.status(204).send();
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default camperRouter;
