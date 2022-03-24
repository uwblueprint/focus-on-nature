import { Request, Response, NextFunction } from "express";
import {
  getApiValidationError,
  validatePrimitive,
  validateDate,
  validateMap,
} from "./util";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable-next-line import/prefer-default-export */
export const createCamperDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let camp: string;
  if (req.body.length > 0) {
    camp = req.body[0].camp;
  }
  req.body.forEach(
    (camper: {
      camp: string;
      formResponses: Map<string, string>;
      registrationDate: string;
      hasPaid: boolean;
      chargeId: string;
    }) => {
      if (!validatePrimitive(camper.camp, "string")) {
        return res.status(400).send(getApiValidationError("camp", "string"));
      }
      if (camper.camp !== camp) {
        return res.status(400).send("Campers must have the same camp.");
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
        return res
          .status(400)
          .send(getApiValidationError("hasPaid", "boolean"));
      }
      if (!validatePrimitive(camper.chargeId, "string")) {
        return res
          .status(400)
          .send(getApiValidationError("chargeId", "string"));
      }
      return true;
    },
  );
  return next();
};
