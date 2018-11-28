// Copyright (c) Microsoft. All rights reserved.

import Config from 'app.config';
import dot from 'dot-object';
import toCamelcase from './camelcase';

/** Tests if a value is a function */
export const isFunc = value => typeof value === 'function';

/** Tests if a value is an object */
export const isObject = value => typeof value === 'object';

/** Tests if a value is an empty object */
export const isEmptyObject = obj => Object.keys(obj).length === 0 && obj.constructor === Object;

/** Converts a value to an integer */
export const int = (num) => parseInt(num, 10);

/** Converts a value to a float */
export const float = (num) => parseFloat(num, 10);

/** Merges css classnames into a single string */
export const joinClasses = (...classNames) => classNames.filter(name => !!name).join(' ').trim();

/** Convert a string of type 'true' or 'false' to its boolean equivalent */
export const stringToBoolean = value => {
  if (typeof value !== 'string') return value;
  const str = value.toLowerCase();
  if (str === 'true') return true;
  else if (str === 'false') return false;
};

/** Returns true if value is an email address */
export const isValidEmail = value => {
  return value.match(/^$|^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}

/** Returns either Items or items from the given object, allowing for either casing from the server */
export const getItems = (response) => response.Items || response.items || [];

/**
 * Convert object keys to be camelCased
 */
export const camelCaseKeys = (data) => {
  if (Array.isArray(data)) {
    return data.map(camelCaseKeys);
  } else if (data !== null && isObject(data)) {
    return Object.entries(data)
      .reduce((acc, [key, value]) => {
        acc[toCamelcase(key)] = camelCaseKeys(value);
        return acc;
      }, {});
  }
  return data;
};

/** Takes an object and converts it to another structure using dot-notation */
export const reshape = (response, model) => {
  return Object.keys(model).reduce((acc, key) => dot.copy(key, model[key], response, acc), {});
};

/** Takes an object, camel cases the keys, and converts it to another structure using dot-notation */
export const camelCaseReshape = (response, model) => {
  return reshape(camelCaseKeys(response), model);
};

/**
 * A helper method for translating headerNames and headerTooltips of columnDefs.
 * If headerTooltip is provided, it will be translated.
 * If headerTooltip is not provided, the headerName will be used to ensure headers
 * can be deciphered even when the column is too narrow to show the entire header.
 */
export const translateColumnDefs = (t, columnDefs) => {
  return columnDefs.map(columnDef => {
    const headerName = columnDef.headerName ? t(columnDef.headerName) : undefined;
    const headerTooltip = columnDef.headerTooltip ? t(columnDef.headerTooltip) : headerName;
    return { ...columnDef, headerName, headerTooltip };
  });
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

/** Converts an enum string with its translated string. */
export const getEnumTranslation = (t, rootPath, name, defaultVal) => {
  const fullPath = `${rootPath}.${name}`;
  const val = t(fullPath);
  if (val === fullPath) {
    return defaultVal || name;
  }
  return val;
}

/** Converts a packageType enum to a translated string equivalent */
export const getPackageTypeTranslation = (packageType, t) => getEnumTranslation(t, 'packageTypes', toCamelcase(packageType), t('packageTypes.unknown'));

/** Converts a packageType enum to a translated string equivalent */
export const getConfigTypeTranslation = (configType, t) => getEnumTranslation(t, 'configTypes', toCamelcase(configType), configType);

/** Converts a deployment status code to a translated string equivalent */
export const getEdgeAgentStatusCode = (code, t) => getEnumTranslation(t, 'edgeAgentStatus', code, t('edgeAgentStatus.unknown'));

/** Converts a job status code to a translated string equivalent */
export const getStatusCode = (code, t) => getEnumTranslation(t, 'maintenance.jobStatus', code, t('maintenance.jobStatus.queued'));

/** Converts a device status to a translated string equivalent */
export const getDeviceStatusTranslation = (status, t) => getEnumTranslation(t, 'deployments.details', status, status);

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
  const fileExt = file.name.split('.').pop().toLowerCase();
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

// Helper to format conditions for display
export const formatConditions = (rule) => {
  if (rule && Array.isArray(rule.conditions) && rule.conditions.length) {
    return rule.conditions.map(trigger => trigger['field'] || Config.emptyFieldValue).join(' & ');
  }
  return Config.emptyFieldValue;
};
