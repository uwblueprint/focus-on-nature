import { Request, Response, NextFunction } from "express";
import {
  getApiValidationError,
  validatePrimitive
} from "./util";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable-next-line import/prefer-default-export */
export const waiverUpdateValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let objArr: Array<Object> = req.body
  let obj: any;
  for(obj in objArr) {
    if (
      obj.text &&
      !validatePrimitive(obj.text, "string")
    ) {
      return res.status(400).send(getApiValidationError("text", "string"));
    }
    if (!validatePrimitive(obj.required, "boolean")) {
      return res.status(400).send(getApiValidationError("required", "boolean"));
    }
  }
  return next();
};
