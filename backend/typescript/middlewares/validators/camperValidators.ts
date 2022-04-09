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
export const createCamperDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validatePrimitive(req.body.campSession, "string")) {
    return res.status(400).send(getApiValidationError("campSession", "string"));
  }
  if (!validatePrimitive(req.body.firstName, "string")) {
    return res.status(400).send(getApiValidationError("firstName", "string"));
  }
  if (!validatePrimitive(req.body.lastName, "string")) {
    return res.status(400).send(getApiValidationError("lastName", "string"));
  }
  if (!validatePrimitive(req.body.age, "integer")) {
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
  if (!Array.isArray(req.body.contacts) || req.body.contacts.length !== 2) {
    return res
      .status(400)
      .send("There must be 2 emergency contacts specified.");
  }
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
  if (
    req.body.formResponses &&
    !validateMap(req.body.formResponses, "string", "string")
  ) {
    return res
      .status(400)
      .send(getApiValidationError("formResponses", "mixed", true));
  }
  if (!validateDate(req.body.registrationDate)) {
    return res
      .status(400)
      .send(getApiValidationError("registrationDate", "Date string"));
  }
  if (!validatePrimitive(req.body.hasPaid, "boolean")) {
    return res.status(400).send(getApiValidationError("hasPaid", "boolean"));
  }
  if (!validatePrimitive(req.body.chargeId, "string")) {
    return res.status(400).send(getApiValidationError("chargeId", "string"));
  }
  if (req.body.charges) {
    if (!validatePrimitive(req.body.charges.camp, "integer")) {
      return res
        .status(400)
        .send(getApiValidationError("charges.camp", "integer"));
    }
    if (!validatePrimitive(req.body.charges.earlyDropoff, "integer")) {
      return res
        .status(400)
        .send(getApiValidationError("charges.earlyDropoff", "integer"));
    }
    if (!validatePrimitive(req.body.charges.latePickup, "integer")) {
      return res
        .status(400)
        .send(getApiValidationError("charges.latePickup", "integer"));
    }
  } else {
    return res.status(400).send(getApiValidationError("charges", "mixed"));
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
  if (req.body.camp && !validatePrimitive(req.body.camp, "string")) {
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
