// Copyright (c) Microsoft. All rights reserved.

import moment from 'moment';
import 'moment-timezone';
import Config from './config';

export function isFunction(value) {
  return typeof value === 'function';
}

export function getBoundaryChars(str) {
  if (!str) return;
  const len = str.length;
  const same = str.charAt(0) === str.charAt(len - 1);
  return same ? str.charAt(0) : null;
}

export function getTypeOf(val) {
  if (!val) return;
  if (typeof val === 'number') {
    return 'Int';
  } else if (typeof val === 'string' && (getBoundaryChars(val) === '"' || getBoundaryChars(val) === "'")) {
    return 'Text';
  }
  return 'Text';
}

export function typeComputation(cond) {
  cond.type = typeof cond.Value === 'number' ? 'Number' : 'Text';
}

export function getNonFunctionalProps(props) {
  const nonFuncKeys = Object.keys(props).filter(key => !isFunction(props[key]));
  const result = {};
  nonFuncKeys.forEach(key => result[key] = props[key]);
  return result;
}

export function debounce(fn, delay) {
  var timer = null;
  return function() {
    var context = this,
      args = arguments;
    args[0].persist();
    clearTimeout(timer);
    timer = setTimeout(function() {
      fn.apply(context, args);
    }, delay);
  };
}

export function formatString(input, ...values) {
  const matchs = /{\d}/g.exec(input);

  if (!matchs) {
    return input;
  }

  for (let i = 0; i < values.length; i++) {
    let regex = new RegExp(`{[${i}]}`, 'g');
    input = input.replace(regex, values[i]);
  }
  return input;
}

export function formatDate(date) {
  if (!date) {
    date = new Date();
  }
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date);
  }
  if (date instanceof Date) {
    return `${date.getMonth() +
      1}${date.getDate()}${date.getFullYear()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
  }
}

export function getRandomString(length) {
  let template = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  length = length || 10;
  let retVal = '';
  for (let i = 0; i < length; i++) {
    let rnd = Math.floor(Math.random() * 61);
    retVal = retVal.concat(template[rnd]);
  }
  return retVal;
}

export function jsonEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function sanitizeJobName(jobName) {
  return jobName.replace(/[\W_]/g, "");
}

export function copyToClipboard(data) {
  const textField = document.createElement('textarea');
  textField.innerText = data;
  document.body.appendChild(textField);
  textField.select();
  document.execCommand('copy');
  textField.remove();
};

/* Returns date set to local timezone and in format of locale */
export function getLocalTimeFormat(date, isUTC, timezone) {
  const localDate = getLocalTime(date, isUTC, timezone);
  return localDate.format("l") + " " + localDate.format("LTS");
}

/* Returns date set to local timezone and formatted in standard format of YYYY-MM-DDTHH:mm:ss */
export function getStandardTimeFormat(date, isUTC, timezone) {
  const localDate = getLocalTime(date, isUTC, timezone);
  return localDate.format(Config.DEFAULT_TIME_FORMAT);
}

/* Return date as moment object, transformed to local time zone. 
date: date in some time zone
isUTC: bool if date is in UTC time zone. 
      This is only needed to set if the date does
      not have offset in string/object already
timezone: desired timezone to set date to. 
          If not set, function will guess timezone */
export function getLocalTime(date, isUTC, timezone) {
  if(!timezone) {
    timezone = moment.tz.guess();
  }
  if (isUTC) {
    date = moment.utc(date);
  }
  return moment.tz(date, timezone);
}

export default {
  isFunction,
  debounce,
  formatDate,
  formatString,
  getRandomString,
  getLocalTimeFormat,
  getStandardTimeFormat
};
