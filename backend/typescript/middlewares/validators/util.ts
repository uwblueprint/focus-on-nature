type Type =
  | "string"
  | "integer"
  | "boolean"
  | "mixed"
  | "Date string"
  | "24 hr time string";

const allowableContentTypes = new Set([
  "text/plain",
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/gif",
]);

const allowableCampStatus = new Set([
  "Active",
  "Published",
  "Draft",
  "Archived",
]);

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
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

export const getCampStatusValidationError = (campStatus: string): string => {
  const allowableCampStatusString = [...allowableCampStatus].join(", ");
  return `The camp status ${campStatus} is not one of ${allowableCampStatusString}`;
};

export const getCampYearValidationError = (campYear: string): string => {
  if (parseInt(campYear, 10).toString() !== campYear) {
    return getApiValidationError("Camp Year", "string");
  }
  return `camp year ${campYear} should be of a valid year format (YYYY)`;
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

export const validateMap = (
  map: any,
  keyType: Type,
  valueType: Type,
): boolean => {
  const keys = Object.keys(map);
  const values = Object.values(map);
  for (let i = 0; i < keys.length; i += 1) {
    if (
      !validatePrimitive(values[i], valueType) ||
      !validatePrimitive(keys[i], keyType)
    ) {
      return false;
    }
  }
  return true;
};

export const validateCampYear = (campYear: string) => {
  return (
    parseInt(campYear, 10).toString() === campYear && campYear.length === 4
  );
};

export const validateCampStatus = (campStatus: string) => {
  return allowableCampStatus.has(campStatus);
};

export const checkDuplicatesInArray = (value: Array<any>): boolean => {
  return new Set(value).size !== value.length;
};
