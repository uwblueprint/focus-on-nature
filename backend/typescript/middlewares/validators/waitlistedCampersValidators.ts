import { Request, Response, NextFunction } from "express";
import { getApiValidationError, validatePrimitive } from "./util";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable-next-line import/prefer-default-export */
export const createWaitlistedCampersDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const campers = req.body.waitlistedCampers;
  const sessionIds = req.body.campSessions;

  if (!Array.isArray(campers) || campers.length < 1) {
    return res
      .status(400)
      .send("Campers must be an array with at least 1 object");
  }
  if (
    !Array.isArray(sessionIds) ||
    !sessionIds.every((id) => validatePrimitive(id, "string"))
  ) {
    return res.status(400).send("sessionIds must be an array of strings");
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const camper of campers) {
    if (!validatePrimitive(camper.firstName, "string")) {
      return res.status(400).send(getApiValidationError("firstName", "string"));
    }
    if (!validatePrimitive(camper.lastName, "string")) {
      return res.status(400).send(getApiValidationError("lastName", "string"));
    }
    if (!validatePrimitive(camper.age, "integer")) {
      return res.status(400).send(getApiValidationError("age", "integer"));
    }
    if (!validatePrimitive(camper.contactName, "string")) {
      return res
        .status(400)
        .send(getApiValidationError("contactName", "string"));
    }
    if (!validatePrimitive(camper.contactEmail, "string")) {
      return res
        .status(400)
        .send(getApiValidationError("contactEmail", "string"));
    }
    if (!validatePrimitive(camper.contactNumber, "string")) {
      return res
        .status(400)
        .send(getApiValidationError("contactNumber", "string"));
    }
    if (camper.campSession) {
      return res
        .status(400)
        .send(
          "Can not specify camp session when waitlisting campers. Use the campSessions field in the request instead",
        );
    }
  }
  return next();
};
