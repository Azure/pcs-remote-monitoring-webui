// Copyright (c) Microsoft. All rights reserved.

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
  } else if (typeof val === 'string' && (val.toLowerCase() === 'y' || val.toLowerCase() === 'n')) {
    return 'Boolean';
  } else if (typeof val === 'string' && (getBoundaryChars(val) === '"' || getBoundaryChars(val) === "'")) {
    return 'String';
  }
  return 'String';
}

export function typeComputation(cond) {
  if (getBoundaryChars(cond.Value) === '"' || getBoundaryChars(cond.Value) === "'") {
    cond.type = 'string';
    cond.Value = cond.Value.substring(1, cond.Value.length - 1);
  } else {
    cond.type = 'int';
  }
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

export default {
  isFunction,
  debounce,
  formatDate,
  formatString,
  getRandomString
};
