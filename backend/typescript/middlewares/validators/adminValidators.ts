import { Request, Response, NextFunction } from "express";
import { validatePrimitive } from "./util";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable-next-line import/prefer-default-export */
const validateClause = (obj: any): boolean => {
  if (!validatePrimitive(obj.text, "string")) {
    return false;
  }
  if (!validatePrimitive(obj.required, "boolean")) {
    return false;
  }
  return true;
};

export const waiverUpdateValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.body.clauses || req.body.clauses.length === 0 || !req.body.clauses.every(validateClause)) {
    return res
      .status(400)
      .send(
        "One or more objects in the clauses array does not match the Clause schema!",
      );
  }
  return next();
};
