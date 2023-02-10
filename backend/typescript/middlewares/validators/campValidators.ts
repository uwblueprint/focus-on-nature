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
  validateCampYear,
  getCampYearValidationError,
} from "./util";
import { getErrorMessage } from "../../utilities/errorUtils";

enum CreateOrUpdate {
  CREATE = 1,
  UPDATE = 2,
}

const createUpdateCampSessionDTOValidator = (
  campSession: { [key: string]: any }, // eslint-disable-line @typescript-eslint/no-explicit-any
  type: CreateOrUpdate,
): boolean => {
  if (!validateArray(campSession.dates, "string")) {
    throw new Error(getApiValidationError("dates", "string", true));
  }
  if (!campSession.dates?.every(validateDate)) {
    throw new Error(getApiValidationError("dates", "Date string"));
  }
  if (!validatePrimitive(campSession.capacity, "integer")) {
    throw new Error(getApiValidationError("capacity", "integer"));
  }
  if (type === CreateOrUpdate.CREATE) {
    if (campSession.campers) {
      throw new Error("campers should be empty");
    }
    if (campSession.waitlist) {
      throw new Error("waitlist should be empty");
    }
  }
  return true;
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable-next-line import/prefer-default-export */
export const getCampDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.query.campYear && !validateCampYear(req.query.campYear as string)) {
    return res
      .status(400)
      .send(getCampYearValidationError(req.query.campYear as string));
  }
  return next();
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable-next-line import/prefer-default-export */
export const createUpdateCampDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
  type: CreateOrUpdate,
) => {
  let body;
  try {
    body = JSON.parse(req.body.data);
  } catch (e: unknown) {
    return res.status(400).send(getErrorMessage(e));
  }
  if (!body) {
    return res.status(400).send("JSON parsing failed");
  }
  if (!validatePrimitive(body.name, "string")) {
    return res.status(400).send(getApiValidationError("name", "string"));
  }
  if (!validatePrimitive(body.description, "string")) {
    return res.status(400).send(getApiValidationError("description", "string"));
  }
  if (body.earlyDropoff && !validatePrimitive(body.earlyDropoff, "string")) {
    return res
      .status(400)
      .send(getApiValidationError("earlyDropoff", "string"));
  }
  if (body.earlyDropoff && !validateTime(body.earlyDropoff)) {
    return res
      .status(400)
      .send(getApiValidationError("earlyDropoff", "24 hr time string"));
  }
  if (body.latePickup && !validatePrimitive(body.latePickup, "string")) {
    return res.status(400).send(getApiValidationError("latePickup", "string"));
  }
  if (body.latePickup && !validateTime(body.latePickup)) {
    return res
      .status(400)
      .send(getApiValidationError("latePickup", "24 hr time string"));
  }
  if (body.pickupFee && !validatePrimitive(body.pickupFee, "number")) {
    return res.status(400).send(getApiValidationError("pickupFee", "number"));
  }
  if (body.dropoffFee && !validatePrimitive(body.dropoffFee, "number")) {
    return res.status(400).send(getApiValidationError("dropoffFee", "number"));
  }
  if (
    (body.earlyDropoff && !body.dropoffFee) ||
    (body.dropoffFee && !body.earlyDropoff)
  ) {
    return res
      .status(400)
      .send(
        "You must provide either both the early dropoff timing and fee, or neither",
      );
  }
  if (
    (body.latePickup && !body.pickupFee) ||
    (body.pickupFee && !body.latePickup)
  ) {
    return res
      .status(400)
      .send(
        "You must provide either both the late pickup timing and fee, or neither",
      );
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
    if (!validatePrimitive(body.location.streetAddress2, "string")) {
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
  if (!validateArray(body.campCoordinators, "string")) {
    return res
      .status(400)
      .send(getApiValidationError("campCoordinators", "string", true));
  }
  if (!validateArray(body.campCounsellors, "string")) {
    return res
      .status(400)
      .send(getApiValidationError("campCounsellors", "string", true));
  }

  if (body.ageUpper < body.ageLower) {
    return res.status(400).send("ageUpper must be larger than ageLower");
  }
  if (!validatePrimitive(body.fee, "number")) {
    return res.status(400).send(getApiValidationError("fee", "number"));
  }
  if (body.fee < 0) {
    return res.status(400).send("fee cannot be negative");
  }
  if (body.volunteers && !validatePrimitive(body.volunteers, "string")) {
    return res.status(400).send(getApiValidationError("volunteers", "string"));
  }
  if (!body.formQuestions) {
    return res.status(400).send("formQuestions is required");
  }
  for (let i = 0; i < body.formQuestions.length; i += 1) {
    const formQuestion = body.formQuestions[i];
    const isValid = validateFormQuestion(formQuestion);
    if (!isValid) {
      return res.status(400).send("formQuestion is formatted incorrectly");
    }
  }

  if (body.campSessions) {
    for (let i = 0; i < body.campSessions.length; i += 1) {
      const campSession = body.campSessions[i];
      try {
        createUpdateCampSessionDTOValidator(campSession, type);
      } catch (err: any) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        res.status(400).send(err.message);
      }
    }
  } else {
    return res.status(400).send("campSessions are required");
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

export const createCampDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  return createUpdateCampDtoValidator(req, res, next, CreateOrUpdate.CREATE);
};

export const updateCampDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  return createUpdateCampDtoValidator(req, res, next, CreateOrUpdate.UPDATE);
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
      if (!validateArray(campSession.dates, "string")) {
        return res
          .status(400)
          .send(getApiValidationError("dates", "string", true));
      }
      if (!campSession.dates?.every(validateDate)) {
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
  if (!campSession.dates && !campSession.capacity) {
    return res.status(400).send("no fields to update included in request body");
  }
  if (!validateArray(campSession.dates, "string")) {
    return res.status(400).send(getApiValidationError("dates", "string", true));
  }
  if (!campSession.dates?.every(validateDate)) {
    return res.status(400).send(getApiValidationError("dates", "Date string"));
  }
  if (
    campSession.capacity &&
    !validatePrimitive(campSession.capacity, "integer")
  ) {
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
  const body = req.body.data;
  if (!body) {
    return res.status(400).send("no data found in request body");
  }

  const campSessions = body.updatedCampSessions;

  if (!campSessions) {
    return res.status(400).send("updatedCampSessions is a required field");
  }

  for (let index = 0; index < campSessions.length; index += 1) {
    const campSession = campSessions[index];
    if (!campSession.id) {
      return res
        .status(400)
        .send("id is a required field for all camp sessions");
    }
    if (!validatePrimitive(campSession.id, "string")) {
      return res.status(400).send(getApiValidationError("id", "string"));
    }
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
    if (campSession.campers) {
      return res
        .status(400)
        .send("cannot directly edit campers, remove field on request object");
    }
    if (campSession.waitlist) {
      return res
        .status(400)
        .send("cannot directly edit waitlist, remove field on request object");
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
