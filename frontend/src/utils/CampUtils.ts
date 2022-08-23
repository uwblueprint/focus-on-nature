import type { Location } from "../types/CampsTypes";

const locationToString = (location?: Location): string => {
  if (location) {
    return `${location.streetAddress1} ${location.streetAddress2} ${location.city} ${location.province} ${location.postalCode}`;
  }
  return "";
};

export default locationToString;
