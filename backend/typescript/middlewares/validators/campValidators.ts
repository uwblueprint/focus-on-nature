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
  if (!validatePrimitive(req.body.data.name, "string")) {
    return res.status(400).send(getApiValidationError("name", "string"));
  }
  if (
    req.body.data.description &&
    !validatePrimitive(req.body.data.description, "string")
  ) {
    return res.status(400).send(getApiValidationError("description", "string"));
  }
  if (!validatePrimitive(req.body.data.location, "string")) {
    return res.status(400).send(getApiValidationError("location", "string"));
  }
  if (!validatePrimitive(req.body.data.ageLower, "integer")) {
    return res.status(400).send(getApiValidationError("ageLower", "integer"));
  }
  if (!validatePrimitive(req.body.data.ageUpper, "integer")) {
    return res.status(400).send(getApiValidationError("ageUpper", "integer"));
  }
  if (req.body.data.ageUpper < req.body.data.ageLower) {
    return res.status(400).send("ageUpper must be larger than ageLower");
  }
  if (
    req.body.data.campCoordinators &&
    !validateArray(req.body.data.campCoordinators, "string")
  ) {
    return res
      .status(400)
      .send(getApiValidationError("campCoordinators", "string", true));
  }
  if (
    req.body.data.campCounsellors &&
    !validateArray(req.body.data.campCounsellors, "string")
  ) {
    return res
      .status(400)
      .send(getApiValidationError("campCounsellors", "string", true));
  }

  if (!validatePrimitive(req.body.earlyDropoff, "string")) {
    return res
      .status(400)
      .send(getApiValidationError("earlyDropoff", "string"));
  }
  if (!validateTime(req.body.data.earlyDropoff)) {
    return res
      .status(400)
      .send(getApiValidationError("earlyDropoff", "24 hr time string"));
  }
  if (!validatePrimitive(req.body.data.latePickup, "string")) {
    return res.status(400).send(getApiValidationError("latePickup", "string"));
  }
  if (!validateTime(req.body.data.latePickup)) {
    return res
      .status(400)
      .send(getApiValidationError("latePickup", "24 hr time string"));
  }
  if (!validatePrimitive(req.body.data.startTime, "string")) {
    return res.status(400).send(getApiValidationError("startTime", "string"));
  }
  if (!validateTime(req.body.data.startTime)) {
    return res
      .status(400)
      .send(getApiValidationError("startTime", "24 hr time string"));
  }
  if (!validatePrimitive(req.body.data.endTime, "string")) {
    return res.status(400).send(getApiValidationError("endTime", "string"));
  }
  if (!validateTime(req.body.data.endTime)) {
    return res
      .status(400)
      .send(getApiValidationError("endTime", "24 hr time string"));
  }
  if (!validatePrimitive(req.body.data.active, "boolean")) {
    return res.status(400).send(getApiValidationError("active", "boolean"));
  }
  if (req.body.fee && !validatePrimitive(req.body.fee, "integer")) {
    return res.status(400).send(getApiValidationError("fee", "integer"));
  }
  if (req.body.data.volunteers && !validateArray(req.body.data.volunteers, "string")) {
    return res
      .status(400)
      .send(getApiValidationError("volunteers", "string", true));
  }
  if (req.body.data.fee < 0) {
    return res.status(400).send("fee cannot be negative");
  }
  if (req.body.data.formQuestions) {
    return res.status(400).send("formQuestions should be empty");
  }
  if (req.body.data.campSessions) {
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

export const editFormQuestionValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.body.formQuestion && !validateFormQuestion(req.body.formQuestion)) {
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
    req.body.formQuestions &&
    Array.isArray(req.body.formQuestions) &&
    !req.body.formQuestions.every(validateFormQuestion)
  ) {
    return res
      .status(400)
      .send(getApiValidationError("formQuestions", "Form question", true));
  }

  return next();
};
