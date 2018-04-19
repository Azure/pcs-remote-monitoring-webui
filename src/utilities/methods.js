// Copyright (c) Microsoft. All rights reserved.

import Config from 'app.config';
import camelcase from 'camelcase-object';
import dot from 'dot-object';

/** Tests if a value is a function */
export const isFunc = value => typeof value === 'function';

/** Tests if a value is an object */
export const isObject = value => typeof value === 'object';

/** Tests if a value is an empty object */
export const isEmptyObject = obj => Object.keys(obj).length === 0 && obj.constructor === Object;

/** Converts a value to an integer */
export const int = (num) => parseInt(num, 10);

/** Merges css classnames into a single string */
export const joinClasses = (...classNames) => classNames.filter(name => !!name).join(' ').trim();

/** Convert a string of type 'true' or 'false' to its boolean equivalent */
export const stringToBoolean = value => {
  if (typeof value !== 'string') return value;
  const str = value.toLowerCase();
  if (str === 'true') return true;
  else if (str === 'false') return false;
};

/** Returns either Items or items from the given object, allowing for either casing from the server */
export const getItems = (response) => response.Items || response.items || [];

/**
 * The camelcase objects package will convert a base level array into an object.
 * This method prevents that from happening
 */
export const camelCaseKeys = (response = {}) => camelcase({ response }, { deep: true }).response;

/** Takes an object and converts it to another structure using dot-notation */
export const reshape = (response, model) => {
  return Object.keys(model).reduce((acc, key) => dot.copy(key, model[key], response, acc), {});
};

/** Takes an object, camel cases the keys, and converts it to another structure using dot-notation */
export const camelCaseReshape = (response, model) => {
  return reshape(camelCaseKeys(response), model);
};

/** A helper method for translating headerNames of columnDefs */
export const translateColumnDefs = (t, columnDefs) => {
  return columnDefs.map(columnDef =>
    columnDef.headerName
      ? { ...columnDef, headerName: t(columnDef.headerName) }
      : columnDef
  );
}

/** A helper method for creating comparator methods for sorting arrays of objects */
export const compareByProperty = (property, reverse) => (a, b) => {
  if (b[property] > a[property]) return reverse ? -1 : 1;
  if (b[property] < a[property]) return reverse ? 1 : -1;
  return 0;
};

/** Returns true if the value is defined */
export const isDef = (val) => typeof val !== 'undefined';

/** Return a generic config value if the value is undefined */
export const renderUndefined = (value) => !isDef(value) ? Config.emptyValue : value;

/** Converts a job status code to a translated string equivalent */
export const getStatusCode = (code, t) => {
  switch (code) {
    case 1: return t('maintenance.jobStatus.enqueued');
    case 2: return t('maintenance.jobStatus.running');
    case 3: return t('maintenance.jobStatus.completed');
    case 4: return t('maintenance.jobStatus.failed');
    case 5: return t('maintenance.jobStatus.cancelled');
    case 6: return t('maintenance.jobStatus.scheduled');
    default: return t('maintenance.jobStatus.queued');
  }
}

/* A helper method to copy text to the clipbaord */
export const copyToClipboard = (data) => {
  const textField = document.createElement('textarea');
  textField.innerText = data;
  document.body.appendChild(textField);
  textField.select();
  document.execCommand('copy');
  textField.remove();
};

export const isValidExtension = (file) => {
  if (!file) return false;
  const fileExt = file.name.split('.').pop();
  return Config.validExtensions.indexOf('.' + fileExt) > -1;
};

// Helper construct from and to parameters for time intervals
export const getIntervalParams = (timeInterval) => {
  switch (timeInterval) {
    case 'P1D':
      return [
        { from: 'NOW-P1D', to: 'NOW' },
        { from: 'NOW-P2D', to: 'NOW-P1D' }
      ];

    case 'P7D':
      return [
        { from: 'NOW-P7D', to: 'NOW' },
        { from: 'NOW-P14D', to: 'NOW-P7D' }
      ];

    case 'P1M':
      return [
        { from: 'NOW-P1M', to: 'NOW' },
        { from: 'NOW-P2M', to: 'NOW-P1M' }
      ];

    default: // Use PT1H as the default case
      return [
        { from: 'NOW-PT1H', to: 'NOW' },
        { from: 'NOW-PT2H', to: 'NOW-PT1H' }
      ];
  }
};
