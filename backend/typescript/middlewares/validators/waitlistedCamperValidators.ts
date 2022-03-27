import { Request, Response, NextFunction } from "express";
import { getApiValidationError, validatePrimitive } from "./util";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable-next-line import/prefer-default-export */
export const createWaitlistedCamperDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validatePrimitive(req.body.firstName, "string")) {
    return res.status(400).send(getApiValidationError("firstName", "string"));
  }
  if (!validatePrimitive(req.body.lastName, "string")) {
    return res.status(400).send(getApiValidationError("lastName", "string"));
  }
  if (!validatePrimitive(req.body.age, "integer")) {
    return res.status(400).send(getApiValidationError("age", "integer"));
  }
  if (!validatePrimitive(req.body.contactName, "string")) {
    return res.status(400).send(getApiValidationError("contactName", "string"));
  }
  if (!validatePrimitive(req.body.contactEmail, "string")) {
    return res
      .status(400)
      .send(getApiValidationError("contactEmail", "string"));
  }
  if (!validatePrimitive(req.body.contactNumber, "string")) {
    return res
      .status(400)
      .send(getApiValidationError("contactNumber", "string"));
  }
  if (!validatePrimitive(req.body.camp, "string")) {
    return res.status(400).send(getApiValidationError("camp", "string"));
  }

  return next();
};
