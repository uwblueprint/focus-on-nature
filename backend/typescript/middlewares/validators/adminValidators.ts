import { Request, Response, NextFunction } from "express";
import waiverModel from "../../models/waiver.model";
import {
  getArrayOfObjectsValidationError,
  validateArrayOfObjects,
} from "./util";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable-next-line import/prefer-default-export */
export const waiverUpdateValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const valid = await validateArrayOfObjects(req.body, waiverModel)
  if (!valid) {
    return res.status(400).send(getArrayOfObjectsValidationError("Clause"));
  }
  return next();
};
