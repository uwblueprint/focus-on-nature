import { Request, Response, NextFunction } from "express";
import {
  getApiValidationError,
  validatePrimitive,
  validateDate,
  validateMap,
} from "./util";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable-next-line import/prefer-default-export */
export const createCampersDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!Array.isArray(req.body) || req.body.length === 0) {
    return res
      .status(400)
      .send(
        "No campers sent - there must be at least one camper in the request array.",
      );
  }
  const { campSession, chargeId } = req.body[0];

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
    if (!Array.isArray(camper.earlyDropoff)) {
      return res.status(400).send("early dropoff is not an array");
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const dropoffDate of camper.earlyDropoff) {
      if (
        !validatePrimitive(dropoffDate, "string") ||
        !validateDate(dropoffDate)
      ) {
        return res
          .status(400)
          .send(getApiValidationError("earlyDropoff", "Date string"));
      }
    }
    if (!Array.isArray(camper.latePickup)) {
      return res.status(400).send("late pickup is not an array");
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const pickupDate of camper.latePickup) {
      if (
        !validatePrimitive(pickupDate, "string") ||
        !validateDate(pickupDate)
      ) {
        return res
          .status(400)
          .send(getApiValidationError("latePickup", "Date string"));
      }
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
      if (!validatePrimitive(contact.relationshipToCamper, "string")) {
        return res
          .status(400)
          .send(
            getApiValidationError("contact relationshipToCamper", "string"),
          );
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
      if (!validatePrimitive(camper.charges.camp, "number")) {
        return res
          .status(400)
          .send(getApiValidationError("charges.camp", "number"));
      }
      if (!validatePrimitive(camper.charges.earlyDropoff, "number")) {
        return res
          .status(400)
          .send(getApiValidationError("charges.earlyDropoff", "number"));
      }
      if (!validatePrimitive(camper.charges.latePickup, "number")) {
        return res
          .status(400)
          .send(getApiValidationError("charges.latePickup", "number"));
      }
    } else {
      return res.status(400).send(getApiValidationError("charges", "mixed"));
    }
    if (!Array.isArray(camper.optionalClauses)) {
      return res.status(400).send("optional clauses must be an array");
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const optionalClause of camper.optionalClauses) {
      if (!validatePrimitive(optionalClause.clause, "string")) {
        return res
          .status(400)
          .send(getApiValidationError("optionalClause.clause", "string"));
      }
      if (!validatePrimitive(optionalClause.agreed, "boolean")) {
        return res
          .status(400)
          .send(getApiValidationError("optionalClause.agreed", "boolean"));
      }
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
  if (!Array.isArray(req.body.camperIds) || req.body.camperIds.length === 0) {
    return res
      .status(400)
      .send("There must be at least one camperId specified.");
  }
  if (!req.body.camperIds.every((id: any) => validatePrimitive(id, "string"))) {
    return res
      .status(400)
      .send(getApiValidationError("camperIds", "string", true));
  }
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
  if (
    req.body.specialNeeds &&
    !validatePrimitive(req.body.specialNeeds, "string")
  ) {
    return res
      .status(400)
      .send(getApiValidationError("specialNeeds", "string"));
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

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable-next-line import/prefer-default-export */
export const cancelCamperDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validatePrimitive(req.body.chargeId, "string")) {
    return res.status(400).send(getApiValidationError("chargeId", "string"));
  }
  if (!Array.isArray(req.body.camperIds) || req.body.camperIds.length === 0) {
    return res
      .status(400)
      .send("There must be at least one camperId specified.");
  }
  for (let i = 0; i < req.body.camperIds.length; i += 1) {
    if (!validatePrimitive(req.body.camperIds[i], "string")) {
      return res.status(400).send(getApiValidationError("camperIds", "string"));
    }
  }

  return next();
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable-next-line import/prefer-default-export */
export const deleteCamperDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!Array.isArray(req.body.camperIds) || req.body.camperIds.length === 0) {
    return res
      .status(400)
      .send("There must be at least one camperId specified.");
  }
  if (!req.body.camperIds.every((id: any) => validatePrimitive(id, "string"))) {
    return res
      .status(400)
      .send(getApiValidationError("camperIds", "string", true));
  }
  return next();
};
