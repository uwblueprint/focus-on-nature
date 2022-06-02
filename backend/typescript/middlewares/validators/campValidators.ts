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
  if (!validatePrimitive(body.earlyDropOff, "string")) {
    return res
      .status(400)
      .send(getApiValidationError("earlyDropOff", "string"));
  }
  if (!validateTime(body.earlyDropOff)) {
    return res
      .status(400)
      .send(getApiValidationError("earlyDropOff", "24 hr time string"));
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
  if (!validatePrimitive(body.location, "string")) {
    return res.status(400).send(getApiValidationError("location", "string"));
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
  if (body.volunteers && !validateArray(body.volunteers, "string")) {
    return res
      .status(400)
      .send(getApiValidationError("volunteers", "string", true));
  }
  if (
    body.formQuestions &&
    Array.isArray(body.formQuestions) &&
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    !body.formQuestions.every((formQuestion: { [key: string]: any }) => {
      return validateFormQuestion(formQuestion);
    })
  ) {
    return res
      .status(400)
      .send(getApiValidationError("formQuestion", "string", true));
  }

  if (body.campSessions) {
    for (let i = 0; i < body.campSessions.length; i += 1) {
      const campSession = body.campSessions[i];
      if (!validatePrimitive(campSession.capacity, "integer")) {
        return res
          .status(400)
          .send(getApiValidationError("capacity", "integer"));
      }
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
    }
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
  if (!validatePrimitive(req.body.name, "string")) {
    return res.status(400).send(getApiValidationError("name", "string"));
  }
  if (
    req.body.description &&
    !validatePrimitive(req.body.description, "string")
  ) {
    return res.status(400).send(getApiValidationError("description", "string"));
  }
  if (!validatePrimitive(req.body.location, "string")) {
    return res.status(400).send(getApiValidationError("location", "string"));
  }
  if (!validatePrimitive(req.body.ageLower, "integer")) {
    return res.status(400).send(getApiValidationError("ageLower", "integer"));
  }
  if (!validatePrimitive(req.body.ageUpper, "integer")) {
    return res.status(400).send(getApiValidationError("ageUpper", "integer"));
  }
  if (req.body.ageUpper < req.body.ageLower) {
    return res.status(400).send("ageUpper must be larger than ageLower");
  }
  if (
    req.body.campCoordinators &&
    !validateArray(req.body.campCoordinators, "string")
  ) {
    return res
      .status(400)
      .send(getApiValidationError("campCoordinators", "string", true));
  }
  if (
    req.body.campCounsellors &&
    !validateArray(req.body.campCounsellors, "string")
  ) {
    return res
      .status(400)
      .send(getApiValidationError("campCounsellors", "string", true));
  }
  if (!validatePrimitive(req.body.earlyDropOff, "string")) {
    return res
      .status(400)
      .send(getApiValidationError("earlyDropOff", "string"));
  }
  if (!validateTime(req.body.earlyDropOff)) {
    return res
      .status(400)
      .send(getApiValidationError("earlyDropOff", "24 hr time string"));
  }
  if (!validatePrimitive(req.body.latePickup, "string")) {
    return res.status(400).send(getApiValidationError("latePickup", "string"));
  }
  if (!validateTime(req.body.latePickup)) {
    return res
      .status(400)
      .send(getApiValidationError("latePickup", "24 hr time string"));
  }
  if (!validatePrimitive(req.body.startTime, "string")) {
    return res.status(400).send(getApiValidationError("startTime", "string"));
  }
  if (!validateTime(req.body.startTime)) {
    return res
      .status(400)
      .send(getApiValidationError("startTime", "24 hr time string"));
  }
  if (!validatePrimitive(req.body.endTime, "string")) {
    return res.status(400).send(getApiValidationError("endTime", "string"));
  }
  if (!validateTime(req.body.endTime)) {
    return res
      .status(400)
      .send(getApiValidationError("endTime", "24 hr time string"));
  }
  if (!validatePrimitive(req.body.active, "boolean")) {
    return res.status(400).send(getApiValidationError("active", "boolean"));
  }
  if (req.body.fee && !validatePrimitive(req.body.fee, "integer")) {
    return res.status(400).send(getApiValidationError("fee", "integer"));
  }
  if (req.body.volunteers && !validateArray(req.body.volunteers, "string")) {
    return res
      .status(400)
      .send(getApiValidationError("volunteers", "string", true));
  }
  if (req.body.fee < 0) {
    return res.status(400).send("fee cannot be negative");
  }
  if (req.body.formQuestions) {
    return res.status(400).send("formQuestions should be empty");
  }
  if (req.body.campSessions) {
    return res.status(400).send("campSessions should be empty");
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
