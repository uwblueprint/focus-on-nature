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
import {
  CamperDTO,
  CreateWaitlistedCamperDTO,
  WaitlistedCamperDTO,
} from "../types";
import { createWaitlistedCampersDtoValidator } from "../middlewares/validators/waitlistedCampersValidators";

const camperRouter: Router = Router();

const camperService: ICamperService = new CamperService();

// ROLES: Leaving unprotected as the registration flow probs needs this endpoint to register @dhruv
/* Create a camper */
camperRouter.post("/register", createCampersDtoValidator, async (req, res) => {
  try {
    const { campers, campSessions } = req.body;
    const data = await camperService.createCampersAndCheckout(
      campers,
      campSessions,
      req.query?.wId as string,
    );
    res.status(200).json({ ...data });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

// ROLES: Admin + CC
/* Get all campers, optionally filter by camp ID */
camperRouter.get(
  "/",
  isAuthorizedByRole(new Set(["Admin", "CampCoordinator"])),
  async (req, res) => {
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
  },
);

// ROLES: TODO- Leaving unprotected as parent might need this route for refund flow @dhruv
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

// ROLES: TODO- Leaving unprotected as parent might need this route for refund flow @dhruv
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

// ROLES: Leaving unprotected as the registration flow probs needs this endpoint to waitlist @dhruv
camperRouter.post(
  "/waitlist",
  createWaitlistedCampersDtoValidator,
  async (req, res) => {
    try {
      const waitlistCampers = req.body
        .waitlistedCampers as CreateWaitlistedCamperDTO[];
      const sessionIds = req.body.campSessions as string[];
      const newWaitlistedCampers = await camperService.createWaitlistedCampers(
        waitlistCampers,
        sessionIds,
      );

      res.status(201).json(newWaitlistedCampers);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

// ROLES: Admin
camperRouter.patch(
  "/waitlist/:waitlistedCamperId",
  isAuthorizedByRole(new Set(["Admin"])),
  async (req, res) => {
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
  },
);

// ROLES: Admin
/* Update the camper with the specified camperId */
camperRouter.patch(
  "/",
  isAuthorizedByRole(new Set(["Admin"])),
  updateCamperDtoValidator,
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

// ROLES: Leave unprotected as we'll probably need this in cancellation flow
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

// ROLES: Admin
/* Delete campers (single or multiple) */
camperRouter.delete(
  "/",
  isAuthorizedByRole(new Set(["Admin"])),
  deleteCamperDtoValidator,
  async (req, res) => {
    try {
      await camperService.deleteCampersById(req.body.camperIds);
      res.status(204).send();
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

// ROLES: Admin
/* Delete a waitlisted camper */
camperRouter.delete(
  "/waitlist/:waitlistedCamperId",
  isAuthorizedByRole(new Set(["Admin"])),
  async (req, res) => {
    try {
      await camperService.deleteWaitlistedCamperById(
        req.params.waitlistedCamperId,
      );
      res.status(204).send();
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

export default camperRouter;
