import { Router } from "express";

import { isAuthorizedByRole } from "../middlewares/auth";
import {
  cancelCamperDtoValidator,
  createCampersDtoValidator,
  updateCamperDtoValidator,
} from "../middlewares/validators/camperValidators";
// eslint-disable-next-line import/no-named-as-default
import CamperService from "../services/implementations/camperService";
import ICamperService from "../services/interfaces/camperService";
import { getErrorMessage } from "../utilities/errorUtils";
import { sendResponseByMimeType } from "../utilities/responseUtil";
import { CamperDTO, CreateCampersDTO, WaitlistedCamperDTO } from "../types";
import { createWaitlistedCamperDtoValidator } from "../middlewares/validators/waitlistedCamperValidators";
import StripeClient from "../utilities/stripeClient";

import MgCampSession, { CampSession } from "../models/campSession.model";

import Stripe from "stripe";

const camperRouter: Router = Router();
const camperService: ICamperService = new CamperService();

const stripe = new Stripe(process.env.STRIPE_SECRET_TEST_KEY ?? "", {
  apiVersion: "2020-08-27",
});

const endpointSecret = new Stripe(
  process.env.STRIPE_SECRET_ENDPOINT_KEY ?? "",
  {
    apiVersion: "2020-08-27",
  },
);

const bodyParser = require("body-parser");

const fulfillOrder = (session: Stripe.Event.Data.Object) => {
  // TODO: fill me in
  console.log("Fulfilling order", session);
};

const createOrder = (session: Stripe.Event.Data.Object) => {
  // TODO: fill me in
  console.log("Creating order", session);
};

const emailCustomerAboutFailedPayment = (session: Stripe.Event.Data.Object) => {
  // TODO: fill me in
  console.log("Emailing customer", session);
};

camperRouter.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  (req, res) => {
    const payload = req.body;
    const sig = req.headers["stripe-signature"];

    console.log("Got payload: " + payload);
    console.log("sig: " + sig);

    let event;

    try {
      if (sig) {
        event = stripe.webhooks.constructEvent(
          payload,
          sig,
          endpointSecret.toString(),
        );
      } else {
        console.log("no sig");
      }
    } catch (error: unknown) {
      return res.status(400).send(`Webhook Error: ${error}`);
    }

    console.log("event: " + event);

    if (event) {
      switch (event.type) {
        case "checkout.session.completed": {
          const session: Stripe.Event.Data.Object = event.data.object;
          // Save an order in your database, marked as 'awaiting payment'
          console.log("hi");
          createOrder(session); // put these functions in camper service

          // Check if the order is paid (for example, from a card payment)
          //
          // A delayed notification payment will have an `unpaid` status, as
          // you're still waiting for funds to be transferred from the customer's
          // account.
          if (Object(session).payment === "paid") {
            fulfillOrder(session);
          }

          break;
        }

        case "checkout.session.async_payment_succeeded": {
          const session = event.data.object;

          // Fulfill the purchase...
          fulfillOrder(session);

          break;
        }

        case "checkout.session.async_payment_failed": {
          const session = event.data.object;

          // Send an email to the customer asking them to retry their order
          emailCustomerAboutFailedPayment(session);

          break;
        }
      }
    }

    res.status(200);
  },
);

/* Create a camper */
camperRouter.post("/register", createCampersDtoValidator, async (req, res) => {
  try {
    const campers = req.body as CreateCampersDTO;
    const newCampers = await camperService.createCampers(campers);

    let campSession: CampSession | null = await MgCampSession.findById(
      req.body[0].campSession,
    );

    let priceId: string;
    campSession ? (priceId = campSession.priceId) : (priceId = "");

    let quantity: number = Object.keys(req.body).length;
    console.log(quantity);

    let checkoutSession = await StripeClient.createCheckoutSession(
      priceId,
      quantity,
    );

    console.log(checkoutSession.url);

    // ** expected behavior - redirect to the checkoutSession.url **
    // if (checkoutSession.url !== null) {
    //   res.redirect(303, checkoutSession.url);
    // }

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
  "/:camperId",
  updateCamperDtoValidator,
  isAuthorizedByRole(new Set(["Admin"])),
  async (req, res) => {
    try {
      const updatedCamper = await camperService.updateCamperById(
        req.params.camperId,
        {
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
        },
      );
      res.status(200).json(updatedCamper);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

/* Delete list of campers with the chargeId */
camperRouter.delete("/cancel", cancelCamperDtoValidator, async (req, res) => {
  try {
    await camperService.deleteCampersByChargeId(
      req.body.chargeId,
      req.body.camperIds,
    );
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
