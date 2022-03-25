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
<<<<<<< HEAD
  const valid = await validateArrayOfObjects(req.body, waiverModel)
  if (!valid) {
    return res.status(400).send(getArrayOfObjectsValidationError("Clause"));
=======
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
>>>>>>> a792a0c9b53e6ec08107e9f928d5b73962cbe38a
  }
  return next();
};
