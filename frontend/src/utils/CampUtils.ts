import type { Location } from "../types/CampsTypes";

const locationToString = (location: Location): string => {
  return `${location.streetAddress1}, ${location.streetAddress2 ?? ""}
    ${location.city} ${location.province}, ${location.postalCode}`;
};

export default locationToString;
