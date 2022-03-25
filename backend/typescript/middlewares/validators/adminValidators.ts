import { Request, Response, NextFunction } from "express";
import { getApiValidationError, validatePrimitive } from "./util";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable-next-line import/prefer-default-export */
export const waiverUpdateValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const objArr: Array<any> = req.body;
  objArr.forEach((obj) => {
    if (obj.text && !validatePrimitive(obj.text, "string")) {
      return res.status(400).send(getApiValidationError("text", "string"));
    }
    if (!validatePrimitive(obj.required, "boolean")) {
      return res.status(400).send(getApiValidationError("required", "boolean"));
    }
    return null;
  });
  return next();
};
