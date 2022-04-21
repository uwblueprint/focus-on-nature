import { Request, Response, NextFunction } from "express";
import {
  getApiValidationError,
  validatePrimitive,
  validateDate,
  validateMap,
  validateTime,
} from "./util";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable-next-line import/prefer-default-export */
export const createCampersDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let campSession: string;
  let chargeId: string;
  if (req.body.length === 0) {
    return res
      .status(400)
      .send("No campers sent - there must be at least one camper in the request.");
  }
  campSession = req.body[0].campSession;
  chargeId = req.body[0].chargeId;

  for (let i = 0; i < req.body.length; i += 1) {
    const camper = req.body[i];
    if (!validatePrimitive(camper.campSession, "string")) {
      return res
        .status(400)
        .send(getApiValidationError("campSession", "string"));
    }
    if (camper.campSession !== campSession) {
      return res.status(400).send("Campers must have the same camp.");
    }
    if (!validatePrimitive(camper.firstName, "string")) {
      return res.status(400).send(getApiValidationError("firstName", "string"));
    }
    if (!validatePrimitive(camper.lastName, "string")) {
      return res.status(400).send(getApiValidationError("lastName", "string"));
    }
    if (!validatePrimitive(camper.age, "integer")) {
      return res.status(400).send(getApiValidationError("age", "integer"));
    }
    if (camper.allergies && !validatePrimitive(camper.allergies, "string")) {
      return res.status(400).send(getApiValidationError("allergies", "string"));
    }
    if (camper.hasCamera && !validatePrimitive(camper.hasCamera, "boolean")) {
      return res
        .status(400)
        .send(getApiValidationError("hasCamera", "boolean"));
    }
    if (camper.hasLaptop && !validatePrimitive(camper.hasLaptop, "boolean")) {
      return res
        .status(400)
        .send(getApiValidationError("hasLaptop", "boolean"));
    }
    if (
      camper.earlyDropoff &&
      (!validatePrimitive(camper.earlyDropoff, "string") ||
        !validateTime(camper.earlyDropoff))
    ) {
      return res
        .status(400)
        .send(getApiValidationError("earlyDropoff", "24 hr time string"));
    }
    if (
      camper.latePickup &&
      (!validatePrimitive(camper.latePickup, "string") ||
        !validateTime(camper.latePickup))
    ) {
      return res
        .status(400)
        .send(getApiValidationError("latePickup", "24 hr time string"));
    }
    if (
      camper.specialNeeds &&
      !validatePrimitive(camper.specialNeeds, "string")
    ) {
      return res
        .status(400)
        .send(getApiValidationError("specialNeeds", "string"));
    }
    if (!Array.isArray(camper.contacts) || camper.contacts.length !== 2) {
      return res
        .status(400)
        .send("There must be 2 emergency contacts specified.");
    }
    for (let j = 0; j < camper.contacts.length; j += 1) {
      const contact = camper.contacts[j];
      if (!validatePrimitive(contact.firstName, "string")) {
        return res
          .status(400)
          .send(getApiValidationError("contact firstName", "string"));
      }
      if (!validatePrimitive(contact.lastName, "string")) {
        return res
          .status(400)
          .send(getApiValidationError("contact lastName", "string"));
      }
      if (!validatePrimitive(contact.email, "string")) {
        return res
          .status(400)
          .send(getApiValidationError("contact email", "string"));
      }
      if (!validatePrimitive(contact.phoneNumber, "string")) {
        return res
          .status(400)
          .send(getApiValidationError("contact phoneNumber", "string"));
      }
    }
    if (
      camper.formResponses &&
      !validateMap(camper.formResponses, "string", "string")
    ) {
      return res
        .status(400)
        .send(getApiValidationError("formResponses", "mixed", true));
    }
    if (!validateDate(camper.registrationDate)) {
      return res
        .status(400)
        .send(getApiValidationError("registrationDate", "Date string"));
    }
    if (!validatePrimitive(camper.hasPaid, "boolean")) {
      return res.status(400).send(getApiValidationError("hasPaid", "boolean"));
    }
    if (!validatePrimitive(camper.chargeId, "string")) {
      return res.status(400).send(getApiValidationError("chargeId", "string"));
    }
    if (camper.chargeId !== chargeId) {
      return res.status(400).send("Campers must have the same chargeId.");
    }
    if (camper.charges) {
      if (!validatePrimitive(camper.charges.camp, "integer")) {
        return res
          .status(400)
          .send(getApiValidationError("charges.camp", "integer"));
      }
      if (!validatePrimitive(camper.charges.earlyDropoff, "integer")) {
        return res
          .status(400)
          .send(getApiValidationError("charges.earlyDropoff", "integer"));
      }
      if (!validatePrimitive(camper.charges.latePickup, "integer")) {
        return res
          .status(400)
          .send(getApiValidationError("charges.latePickup", "integer"));
      }
    } else {
      return res.status(400).send(getApiValidationError("charges", "mixed"));
    }
  }
  return next();
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable-next-line import/prefer-default-export */
export const updateCamperDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (
    req.body.campSession &&
    !validatePrimitive(req.body.campSession, "string")
  ) {
    return res.status(400).send(getApiValidationError("camp", "string"));
  }
  if (req.body.firstName && !validatePrimitive(req.body.firstName, "string")) {
    return res.status(400).send(getApiValidationError("firstName", "string"));
  }
  if (req.body.lastName && !validatePrimitive(req.body.lastName, "string")) {
    return res.status(400).send(getApiValidationError("lastName", "string"));
  }
  if (req.body.age && !validatePrimitive(req.body.age, "integer")) {
    return res.status(400).send(getApiValidationError("age", "integer"));
  }
  if (req.body.allergies && !validatePrimitive(req.body.allergies, "string")) {
    return res.status(400).send(getApiValidationError("allergies", "string"));
  }
  if (req.body.hasCamera && !validatePrimitive(req.body.hasCamera, "boolean")) {
    return res.status(400).send(getApiValidationError("hasCamera", "boolean"));
  }
  if (req.body.hasLaptop && !validatePrimitive(req.body.hasLaptop, "boolean")) {
    return res.status(400).send(getApiValidationError("hasLaptop", "boolean"));
  }
  if (
    req.body.earlyDropoff &&
    (!validatePrimitive(req.body.earlyDropoff, "string") ||
      !validateTime(req.body.earlyDropoff))
  ) {
    return res
      .status(400)
      .send(getApiValidationError("earlyDropoff", "24 hr time string"));
  }
  if (
    req.body.latePickup &&
    (!validatePrimitive(req.body.latePickup, "string") ||
      !validateTime(req.body.latePickup))
  ) {
    return res
      .status(400)
      .send(getApiValidationError("latePickup", "24 hr time string"));
  }
  if (
    req.body.specialNeeds &&
    !validatePrimitive(req.body.specialNeeds, "string")
  ) {
    return res
      .status(400)
      .send(getApiValidationError("specialNeeds", "string"));
  }
  if (
    req.body.contacts &&
    (!Array.isArray(req.body.contacts) || req.body.contacts.length !== 2)
  ) {
    return res
      .status(400)
      .send("There must be 2 emergency contacts specified.");
  }
  if (req.body.contacts) {
    for (let i = 0; i < req.body.contacts.length; i += 1) {
      const contact = req.body.contacts[i];
      if (!validatePrimitive(contact.firstName, "string")) {
        return res
          .status(400)
          .send(getApiValidationError("contact firstName", "string"));
      }
      if (!validatePrimitive(contact.lastName, "string")) {
        return res
          .status(400)
          .send(getApiValidationError("contact lastName", "string"));
      }
      if (!validatePrimitive(contact.email, "string")) {
        return res
          .status(400)
          .send(getApiValidationError("contact email", "string"));
      }
      if (!validatePrimitive(contact.phoneNumber, "string")) {
        return res
          .status(400)
          .send(getApiValidationError("contact phoneNumber", "string"));
      }
    }
  }
  if (
    req.body.formResponses &&
    !validateMap(req.body.formResponses, "string", "string")
  ) {
    return res
      .status(400)
      .send(getApiValidationError("formResponses", "mixed", true));
  }
  if (req.body.hasPaid && !validatePrimitive(req.body.hasPaid, "boolean")) {
    return res.status(400).send(getApiValidationError("hasPaid", "boolean"));
  }
  return next();
};
