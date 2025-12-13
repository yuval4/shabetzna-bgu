import { isObject, some } from "lodash";

export const hasTrueValue = (obj: object = {}): boolean => {
  return some(obj, (value) => {
    if (value === true) {
      return true;
    } else if (isObject(value)) {
      return hasTrueValue(value);
    }

    return false;
  });
};
