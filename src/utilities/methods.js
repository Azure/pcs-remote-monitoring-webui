// Copyright (c) Microsoft. All rights reserved.
import dot from 'dot-object';

/** Tests if a value is a function */
export const isFunc = value => typeof value === 'function';

/** Tests if a value is an object */
export const isObject = value => typeof value === 'object';

/** Converts a value to an integer */
export const int = (num) => parseInt(num, 10);

/** Merges css classnames into a single string */
export const joinClasses = (...classNames) => classNames.join(' ').trim();

/** Convert a string of type 'true' or 'false' to its boolean equivalent */
export const stringToBoolean = value => {
  if (typeof value !== 'string') return value;
  const str = value.toLowerCase();
  if (str === "true") return true;
  else if (str === "false") return false;
};

/** Takes an object and converts it to another structure using dot-notation */
export const reshape = (reponse, model) => {
  return Object.keys(model).reduce((acc, key) => dot.copy(key, model[key], reponse, acc), {});
};

/** A helper method for translating headerNames of columnDefs */
export const translateColumnDefs = (t, columnDefs) => {
  return columnDefs.map(columnDef =>
    columnDef.headerName
      ? { ...columnDef, headerName: t(columnDef.headerName) }
      : columnDef
  );
}

/* A helper method for creating comparator methods for sorting arrays of objects */
export const compareByProperty = (property) => (a, b) => {
  if (b[property] > a[property]) return 1;
  if (b[property] < a[property]) return -1;
  return 0;
};
