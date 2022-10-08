import fs from "fs";
import { Request, Response, NextFunction } from "express";
import { validateFormQuestion } from "./formQuestionValidators";
import {
  getApiValidationError,
  getImageTypeValidationError,
  getImageSizeValidationError,
  validateArray,
  validatePrimitive,
  validateDate,
  validateImageType,
  validateTime,
  validateImageSize,
} from "./util";
import { getErrorMessage } from "../../utilities/errorUtils";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable-next-line import/prefer-default-export */
export const createCampDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let body;
  try {
    body = JSON.parse(req.body.data);
  } catch (e: unknown) {
    return res.status(400).send(getErrorMessage(e));
  }
  if (!validatePrimitive(body.name, "string")) {
    return res.status(400).send(getApiValidationError("name", "string"));
  }
  if (body.description && !validatePrimitive(body.description, "string")) {
    return res.status(400).send(getApiValidationError("description", "string"));
  }
  if (!validatePrimitive(body.earlyDropoff, "string")) {
    return res
      .status(400)
      .send(getApiValidationError("earlyDropoff", "string"));
  }
  if (!validateTime(body.earlyDropoff)) {
    return res
      .status(400)
      .send(getApiValidationError("earlyDropoff", "24 hr time string"));
  }
  if (!validatePrimitive(body.latePickup, "string")) {
    return res.status(400).send(getApiValidationError("latePickup", "string"));
  }
  if (!validateTime(body.latePickup)) {
    return res
      .status(400)
      .send(getApiValidationError("latePickup", "24 hr time string"));
  }
  if (!validatePrimitive(body.pickupFee, "integer")) {
    return res.status(400).send(getApiValidationError("pickupFee", "integer"));
  }
  if (!validatePrimitive(body.dropoffFee, "integer")) {
    return res.status(400).send(getApiValidationError("dropoffFee", "integer"));
  }
  if (!validatePrimitive(body.startTime, "string")) {
    return res.status(400).send(getApiValidationError("startTime", "string"));
  }
  if (!validateTime(body.startTime)) {
    return res
      .status(400)
      .send(getApiValidationError("startTime", "24 hr time string"));
  }
  if (!validatePrimitive(body.endTime, "string")) {
    return res.status(400).send(getApiValidationError("endTime", "string"));
  }
  if (!validateTime(body.endTime)) {
    return res
      .status(400)
      .send(getApiValidationError("endTime", "24 hr time string"));
  }
  if (!validatePrimitive(body.active, "boolean")) {
    return res.status(400).send(getApiValidationError("active", "boolean"));
  }
  if (body.location) {
    if (!validatePrimitive(body.location.streetAddress1, "string")) {
      return res
        .status(400)
        .send(getApiValidationError("location.streetAddress1", "string"));
    }
    if (
      body.location.streetAddress2 &&
      !validatePrimitive(body.location.streetAddress2, "string")
    ) {
      return res
        .status(400)
        .send(getApiValidationError("location.streetAddress2", "string"));
    }
    if (!validatePrimitive(body.location.city, "string")) {
      return res
        .status(400)
        .send(getApiValidationError("location.city", "string"));
    }
    if (!validatePrimitive(body.location.province, "string")) {
      return res
        .status(400)
        .send(getApiValidationError("location.province", "string"));
    }
    if (!validatePrimitive(body.location.postalCode, "string")) {
      return res
        .status(400)
        .send(getApiValidationError("location.postalCode", "string"));
    }
  }
  if (!validatePrimitive(body.ageLower, "integer")) {
    return res.status(400).send(getApiValidationError("ageLower", "integer"));
  }
  if (!validatePrimitive(body.ageUpper, "integer")) {
    return res.status(400).send(getApiValidationError("ageUpper", "integer"));
  }
  if (
    body.campCoordinators &&
    !validateArray(body.campCoordinators, "string")
  ) {
    return res
      .status(400)
      .send(getApiValidationError("campCoordinators", "string", true));
  }
  if (body.campCounsellors && !validateArray(body.campCounsellors, "string")) {
    return res
      .status(400)
      .send(getApiValidationError("campCounsellors", "string", true));
  }

  if (body.ageUpper < body.ageLower) {
    return res.status(400).send("ageUpper must be larger than ageLower");
  }
  if (!validatePrimitive(body.fee, "integer")) {
    return res.status(400).send(getApiValidationError("fee", "integer"));
  }
  if (body.fee < 0) {
    return res.status(400).send("fee cannot be negative");
  }
  if (body.volunteers && !validatePrimitive(body.volunteers, "string")) {
    return res.status(400).send(getApiValidationError("volunteers", "string"));
  }
  if (body.formQuestions) {
    return res.status(400).send("formQuestions should be empty");
  }
  if (body.campSessions) {
    return res.status(400).send("campSessions should be empty");
  }
  if (body.campers) {
    return res.status(400).send("campers should be empty");
  }
  if (body.waitlist) {
    return res.status(400).send("waitlist should be empty");
  }
  if (req.file && !validateImageType(req.file.mimetype)) {
    fs.unlinkSync(req.file.path);
    return res.status(400).send(getImageTypeValidationError(req.file.mimetype));
  }
  if (req.file && !validateImageSize(req.file.size)) {
    fs.unlinkSync(req.file.path);
    return res.status(400).send(getImageSizeValidationError());
  }
  return next();
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable-next-line import/prefer-default-export */
export const updateCampDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const body = JSON.parse(req.body.data);
  if (!validatePrimitive(body.name, "string")) {
    return res.status(400).send(getApiValidationError("name", "string"));
  }
  if (body.description && !validatePrimitive(body.description, "string")) {
    return res.status(400).send(getApiValidationError("description", "string"));
  }
  if (body.dropoffFee && !validatePrimitive(body.dropoffFee, "integer")) {
    return res.status(400).send(getApiValidationError("dropoffFee", "integer"));
  }
  if (body.pickupFee && !validatePrimitive(body.pickupFee, "integer")) {
    return res.status(400).send(getApiValidationError("pickupFee", "integer"));
  }
  if (body.location) {
    if (!validatePrimitive(body.location.streetAddress1, "string")) {
      return res
        .status(400)
        .send(getApiValidationError("location.streetAddress1", "string"));
    }
    if (
      body.location.streetAddress2 &&
      !validatePrimitive(body.location.streetAddress2, "string")
    ) {
      return res
        .status(400)
        .send(getApiValidationError("location.streetAddress2", "string"));
    }
    if (!validatePrimitive(body.location.city, "string")) {
      return res
        .status(400)
        .send(getApiValidationError("location.city", "string"));
    }
    if (!validatePrimitive(body.location.province, "string")) {
      return res
        .status(400)
        .send(getApiValidationError("location.province", "string"));
    }
    if (!validatePrimitive(body.location.postalCode, "string")) {
      return res
        .status(400)
        .send(getApiValidationError("location.postalCode", "string"));
    }
  }
  if (!validatePrimitive(body.ageLower, "integer")) {
    return res.status(400).send(getApiValidationError("ageLower", "integer"));
  }
  if (!validatePrimitive(body.ageUpper, "integer")) {
    return res.status(400).send(getApiValidationError("ageUpper", "integer"));
  }
  if (body.ageUpper < body.ageLower) {
    return res.status(400).send("ageUpper must be larger than ageLower");
  }
  if (
    body.campCoordinators &&
    !validateArray(body.campCoordinators, "string")
  ) {
    return res
      .status(400)
      .send(getApiValidationError("campCoordinators", "string", true));
  }
  if (body.campCounsellors && !validateArray(body.campCounsellors, "string")) {
    return res
      .status(400)
      .send(getApiValidationError("campCounsellors", "string", true));
  }
  if (!validatePrimitive(body.earlyDropoff, "string")) {
    return res
      .status(400)
      .send(getApiValidationError("earlyDropoff", "string"));
  }
  if (!validateTime(body.earlyDropoff)) {
    return res
      .status(400)
      .send(getApiValidationError("earlyDropoff", "24 hr time string"));
  }
  if (!validatePrimitive(body.latePickup, "string")) {
    return res.status(400).send(getApiValidationError("latePickup", "string"));
  }
  if (!validateTime(body.latePickup)) {
    return res
      .status(400)
      .send(getApiValidationError("latePickup", "24 hr time string"));
  }
  if (!validatePrimitive(body.startTime, "string")) {
    return res.status(400).send(getApiValidationError("startTime", "string"));
  }
  if (!validateTime(body.startTime)) {
    return res
      .status(400)
      .send(getApiValidationError("startTime", "24 hr time string"));
  }
  if (!validatePrimitive(body.endTime, "string")) {
    return res.status(400).send(getApiValidationError("endTime", "string"));
  }
  if (!validateTime(body.endTime)) {
    return res
      .status(400)
      .send(getApiValidationError("endTime", "24 hr time string"));
  }
  if (!validatePrimitive(body.active, "boolean")) {
    return res.status(400).send(getApiValidationError("active", "boolean"));
  }
  if (!validatePrimitive(body.fee, "integer")) {
    return res.status(400).send(getApiValidationError("fee", "integer"));
  }
  if (body.volunteers && !validatePrimitive(body.volunteers, "string")) {
    return res.status(400).send(getApiValidationError("volunteers", "string"));
  }
  if (body.fee < 0) {
    return res.status(400).send("fee cannot be negative");
  }
  if (body.formQuestions) {
    return res.status(400).send("formQuestions should be empty");
  }
  if (body.campSessions) {
    return res.status(400).send("campSessions should be empty");
  }
  if (req.file && !validateImageType(req.file.mimetype)) {
    fs.unlinkSync(req.file.path);
    return res.status(400).send(getImageTypeValidationError(req.file.mimetype));
  }
  if (req.file && !validateImageSize(req.file.size)) {
    fs.unlinkSync(req.file.path);
    return res.status(400).send(getImageSizeValidationError());
  }
  return next();
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable-next-line import/prefer-default-export */
export const createCampSessionsDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.body.campSessions) {
    for (let i = 0; i < req.body.campSessions.length; i += 1) {
      const campSession = req.body.campSessions[i];
      if (campSession.dates && !validateArray(campSession.dates, "string")) {
        return res
          .status(400)
          .send(getApiValidationError("dates", "string", true));
      }
      if (!campSession.dates.every(validateDate)) {
        return res
          .status(400)
          .send(getApiValidationError("dates", "Date string"));
      }
      if (!validatePrimitive(campSession.capacity, "integer")) {
        return res
          .status(400)
          .send(getApiValidationError("capacity", "integer"));
      }
      if (req.body.campers) {
        return res.status(400).send("campers should be empty");
      }
      if (req.body.waitlist) {
        return res.status(400).send("waitlist should be empty");
      }
    }
  } else {
    return res.status(400).send("campSessions are required");
  }
  return next();
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable-next-line import/prefer-default-export */
export const updateCampSessionDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const campSession = req.body;
  if (campSession.dates && !validateArray(campSession.dates, "string")) {
    return res.status(400).send(getApiValidationError("dates", "string", true));
  }
  if (campSession.dates && !campSession.dates.every(validateDate)) {
    return res.status(400).send(getApiValidationError("dates", "Date string"));
  }
  if (!validatePrimitive(campSession.capacity, "integer")) {
    return res.status(400).send(getApiValidationError("capacity", "integer"));
  }
  if (req.body.campers) {
    return res.status(400).send("campers should be empty");
  }
  if (req.body.waitlist) {
    return res.status(400).send("waitlist should be empty");
  }
  return next();
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable-next-line import/prefer-default-export */
export const deleteCampSessionsDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.body.campSessionIds) {
    const { campSessionIds } = req.body;
    if (!validateArray(campSessionIds, "string")) {
      return res
        .status(400)
        .send(getApiValidationError("campSessionIds", "string", true));
    }
  } else {
    return res.status(400).send("campSessionIds does not exist");
  }
  return next();
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable-next-line import/prefer-default-export */
export const updateCampSessionsDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.body.campers) {
    return res
      .status(400)
      .send("cannot directly edit campers, field should be empty");
  }
  if (req.body.waitlist) {
    return res
      .status(400)
      .send("cannot directly edit waitlist, field should be empty");
  }

  const { campSessionIds } = req.body;
  if (!campSessionIds) {
    return res.status(400).send("campSessionIds are required");
  }

  for (let index = 0; index < campSessionIds.length; index += 1) {
    const id = campSessionIds[index];
    if (!validatePrimitive(id, "string")) {
      return res.status(400).send(getApiValidationError("id", "string"));
    }
  }

  const campSessions = req.body.updatedCampSessions;

  if (!campSessions) {
    return res.status(400).send("campSessions are required");
  }

  for (let index = 0; index < campSessions.length; index += 1) {
    const campSession = campSessions[index];
    if (campSession.dates && !validateArray(campSession.dates, "string")) {
      return res
        .status(400)
        .send(getApiValidationError("dates", "string", true));
    }
    if (campSession.dates && !campSession.dates.every(validateDate)) {
      return res
        .status(400)
        .send(getApiValidationError("dates", "Date string"));
    }
    if (!validatePrimitive(campSession.capacity, "integer")) {
      return res.status(400).send(getApiValidationError("capacity", "integer"));
    }
  }
  return next();
};

export const editFormQuestionValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validateFormQuestion(req.body.formQuestion)) {
    return res
      .status(400)
      .send(getApiValidationError("formQuestion", "Form question"));
  }

  return next();
};

export const createFormQuestionsValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (
    !req.body.formQuestions ||
    !Array.isArray(req.body.formQuestions) ||
    !req.body.formQuestions.every(validateFormQuestion)
  ) {
    return res
      .status(400)
      .send(getApiValidationError("formQuestions", "Form question", true));
  }

  return next();
};
