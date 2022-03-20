import { Request, Response, NextFunction } from "express";
import clauseModel from "../../models/clause.model";
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
  if (!validateArrayOfObjects(req.body, clauseModel)) {
    return res.status(400).send(getArrayOfObjectsValidationError("Clause"));
  }
  return next();
};
