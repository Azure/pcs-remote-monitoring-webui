/* eslint-disable */

// Copyright (c) Microsoft. All rights reserved.

// Polyfills for cross browser support

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (searchString, position) {
    return this.substr(position || 0, searchString.length) === searchString;
  };
}

if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function (searchElement, fromIndex) {

      if (this == null) throw new TypeError('"this" is null or not defined');

      var o = Object(this);
      var len = o.length >>> 0;
      if (len === 0) return false;

      var n = fromIndex | 0;
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      function sameValueZero(x, y) {
        return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
      }

      while (k < len) {
        if (sameValueZero(o[k], searchElement)) return true;
        k++;
      }

      return false;
    }
  });
}

if (!String.prototype.includes) {
  String.prototype.includes = function (search, start) {
    'use strict';
    if (typeof start !== 'number') start = 0;

    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function (searchStr, Position) {
    if (!(Position < this.length))
      Position = this.length;
    else
      Position |= 0;
    return this.substr(Position - searchStr.length, searchStr.length) === searchStr;
  };
}

if (!String.prototype.padStart) {
  String.prototype.padStart = function padStart(targetLength, padString) {
    targetLength = targetLength >> 0; //floor if number or convert non-number to 0;
    padString = String(padString || ' ');
    if (this.length > targetLength) {
      return String(this);
    } else {
      targetLength = targetLength - this.length;
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
      }
      return padString.slice(0, targetLength) + String(this);
    }
  };
}

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
if (!Object.entries) {
  Object.entries = function (obj) {
    var ownProps = Object.keys(obj),
      i = ownProps.length,
      resArray = new Array(i); // preallocate the Array
    while (i--)
      resArray[i] = [ownProps[i], obj[ownProps[i]]];

    return resArray;
  };
}

if (!Object.values) {
  Object.values = (obj) => Object.keys(obj).map(key => obj[key]);
}
