import mongoose, { Model } from "mongoose";

type Type =
  | "string"
  | "integer"
  | "boolean"
  | "Date string"
  | "24 hr time string";

const allowableContentTypes = new Set([
  "text/plain",
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/gif",
]);

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable func-names */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-prototype-builtins */
export const validatePrimitive = (value: any, type: Type): boolean => {
  if (value === undefined || value === null) return false;

  switch (type) {
    case "string": {
      return typeof value === "string";
    }
    case "boolean": {
      return typeof value === "boolean";
    }
    case "integer": {
      return typeof value === "number" && Number.isInteger(value);
    }
    default: {
      return false;
    }
  }
};

export const validateModel = async(obj: Object, model:Model<any>): Promise<boolean> => {
  try {
    await Model.validate(obj);
  } catch (err) {
    return false;
  }
  return true;
}

export const validateArrayOfObjects = async(
  objArr: Array<any>,
  objectModel: Model<any>,
): Promise<boolean> => {
  for(const obj of objArr) {
    const valid = await validateModel(obj, objectModel)
    if(!valid) {
      console.log("about to return false")
      return false
    }
  }
  return true;
};

export const validateArray = (value: any, type: Type): boolean => {
  return (
    value !== undefined &&
    value !== null &&
    typeof value === "object" &&
    Array.isArray(value) &&
    value.every((item) => validatePrimitive(item, type))
  );
};

export const validateFileType = (mimetype: string): boolean => {
  return allowableContentTypes.has(mimetype);
};

export const getApiValidationError = (
  fieldName: string,
  type: Type,
  isArray = false,
): string => {
  return `The ${fieldName} is not a ${type}${isArray ? " Array" : ""}`;
};

export const getFileTypeValidationError = (mimetype: string): string => {
  const allowableContentTypesString = [...allowableContentTypes].join(", ");
  return `The file type ${mimetype} is not one of ${allowableContentTypesString}`;
};

export const getArrayOfObjectsValidationError = (modelName: string): string => {
  return `One or more objects in the array does not follow the schema of a ${modelName} object.`;
};

export const validateDate = (value: string): boolean => {
  return !!Date.parse(value);
};

export const validateTime = (value: string): boolean => {
  const regex = new RegExp("^([01][0-9]|2[0-3]):([0-5][0-9])$");
  return regex.test(value);
};

// server side validation for email domains
export const validateUserEmail = (userEmail: string): boolean => {
  return (
    userEmail.split("@")[1] === "focusonnature.ca" ||
    userEmail.split("@")[1] === "uwblueprint.org"
  );
};
