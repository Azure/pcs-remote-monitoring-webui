// Copyright (c) Microsoft. All rights reserved.

export function isFunction(value) {
  return typeof value === 'function';
}

export function getNonFunctionalProps(props) {
  const nonFuncKeys = Object.keys(props).filter(key => !isFunction(props[key]));
  const result = {};
  nonFuncKeys.forEach(key => {
    result[key] = props[key];
  });
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
  let template =
    '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
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

export default {
  isFunction,
  debounce,
  formatDate,
  formatString,
  getRandomString
};
