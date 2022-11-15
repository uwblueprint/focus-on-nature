import { Request, Response, NextFunction } from "express";
import { validateFormQuestion } from "./formQuestionValidators";
import { validatePrimitive, getApiValidationError } from "./util";

const validateClause = (clause: any): boolean => {
  if (!validatePrimitive(clause.text, "string")) {
    return false;
  }
  if (!validatePrimitive(clause.required, "boolean")) {
    return false;
  }
  return true;
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable-next-line import/prefer-default-export */
export const waiverUpdateValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (
    !req.body.clauses ||
    req.body.clauses.length === 0 ||
    !req.body.clauses.every(validateClause)
  ) {
    return res
      .status(400)
      .send(
        "One or more objects in the clauses array does not match the Clause schema!",
      );
  }
  return next();
};

export const formTemplateUpdateValidator = async (
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
      .send(getApiValidationError("formQuestion", "string", true));
  }
  return next();
};

export const formTemplateAddQuestionValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.body.formQuestion || !validateFormQuestion(req.body.formQuestion)) {
    return res.status(400).send("Invalid format provided for form question");
  }
  return next();
};

export const formTemplateRemoveQuestionValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (
    !req.params.formQuestionId ||
    !validatePrimitive(req.params.formQuestionId, "string")
  ) {
    return res.status(400).send("formQuestionId param must be a string");
  }
  return next();
};

export const formTemplateEditQuestionValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (
    !req.params.oldQuestionId ||
    !validatePrimitive(req.params.oldQuestionId, "string")
  ) {
    return res.status(400).send("oldQuestionId param must be a string");
  }

  if (
    !req.body.newFormQuestion ||
    !validateFormQuestion(req.body.newFormQuestion)
  ) {
    return res.status(400).send("new form question details invalid");
  }

  return next();
};
