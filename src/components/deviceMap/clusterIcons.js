// Copyright (c) Microsoft. All rights reserved.

import Config from '../../common/config';

function onlineWarn(radius, clusterSize) {
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="',
    radius * 2,
    '" height="',
    radius * 2,
    '">',
    '<rect width="24" x="0" y="5" height="24" style="fill:rgb(255,255,255);stroke-width:2;stroke:rgb(175,185,195)" />',
    '<rect width="8" x="18" y="0" height="8" fill="#FDE870" />',
    '<text x="10" y="18" text-anchor="middle" alignment-baseline="central" font-size="12" style="fill:black">' +
      clusterSize +
      '</text>',
    '</svg>'
  ].join('');
}

function onlineAlarm(radius, clusterSize) {
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="',
    radius * 2,
    '" height="',
    radius * 2,
    '">',
    '<rect width="24" height="24"  x="0" y="7" style="fill:rgb(255,255,255);stroke-width:2;stroke:rgb(175,185,195)" />',
    '<polygon points="23,0 29,10.6 17,11" fill="#fc540a" />',
    '<text x="12" y="20" font-size="12" style="fill:black" text-anchor="middle" alignment-baseline="central">' +
      clusterSize +
      '</text>',
    '</svg>'
  ].join('');
}

function online(radius, clusterSize) {
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="',
    radius * 2,
    '" height="',
    radius * 2,
    '">',
    '<rect width="24" height="24" style="fill:rgb(255,255,255);stroke-width:2;stroke:rgb(175,185,195)" />',
    '<text x="10" y="12" font-size="12" style="fill:black" text-anchor="middle" alignment-baseline="central">' +
      clusterSize +
      '</text>',
    '</svg>'
  ].join('');
}
function offline(radius, clusterSize) {
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="',
    radius * 2,
    '" height="',
    radius * 2,
    '">',
    '<rect width="24" height="24" style="fill:rgb(175,185,195);stroke-width:3;stroke:rgb(255,255,255)" />',
    '<text x="10" y="12" font-size="12" style="fill:black" text-anchor="middle" alignment-baseline="central">' +
      clusterSize +
      '</text>',
    '</svg>'
  ].join('');
}
function offlineAlarm(radius, clusterSize) {
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="',
    radius * 2,
    '" height="',
    radius * 2,
    '">',
    '<rect width="24" height="24" x="0" y="7" style="fill:rgb(175,185,195);stroke-width:2;stroke:rgb(255,255,255)" />',
    '<polygon points="23,0 29,10.6 17,11" fill="#fc540a" />',
    '<text x="12" y="20" font-size="12" style="fill:black" text-anchor="middle" alignment-baseline="central">' +
      clusterSize +
      '</text>',
    '</svg>'
  ].join('');
}
function offlineWarn(radius, clusterSize) {
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="',
    radius * 2,
    '" height="',
    radius * 2,
    '">',
    '<rect width="24" x="0" y="5" height="24" style="fill:rgb(175,185,195);stroke-width:2;stroke:rgb(255,255,255)" />',
    '<rect width="8" x="18" y="0" height="8" fill="#FDE870" />',
    '<text x="10" y="20" font-size="12" style="fill:black" text-anchor="middle" alignment-baseline="central">' +
      clusterSize +
      '</text>',
    '</svg>'
  ].join('');
}

const defaultIcon = function(severity, isConnected, deviceId) {
  // Design requirements is to show 10chars for the default text length and ... appended at last
  if (deviceId.length > Config.STATUS_CODES.DEFAULTPUSHPINTEXTLENGTH) {
    deviceId =
      deviceId.substring(0, Config.STATUS_CODES.DEFAULTPUSHPINTEXTLENGTH) +
      '...';
  }
  let svgAlarm = [
    '<svg xmlns="http://www.w3.org/2000/svg"  width="100px" height="31px">',
    '<path transform="translate(7,3) scale(0.7,0.7)" class="cls-1" d="M0,0H89.71V24H47.642l-3.534,7-4.13-7H0Z" ' +
      'style="fill:rgb(255,255,255);stroke-width:3;stroke:rgb(132, 129, 129)"/>',
    '<polygon points="23,0 29,10.6 17,11" fill="#fc540a" transform="translate(48)"/>',
    '<text x="40" y="10" text-anchor="middle" alignment-baseline="central" ' +
      'font-size="10" style="fill:black;stroke-width:1">' +
      deviceId +
      '</text>',
    '</svg>'
  ].join('');
  let svgWarn = [
    '<svg xmlns="http://www.w3.org/2000/svg"  width="100px" height="31px">',
    '<path transform="translate(7,3) scale(0.7,0.7)" class="cls-1" d="M0,0H89.71V24H47.642l-3.534,7-4.13-7H0Z" ' +
      'style="fill:rgb(255,255,255);stroke-width:3;stroke:rgb(132, 129, 129)"/>',
    '<rect width="10" x="82" y="0" height="10" fill="#FDE870" />',
    '<text x="40" y="10" text-anchor="middle" alignment-baseline="central" ' +
      'font-size="11" style="fill:black;stroke-width:1">' +
      deviceId +
      '</text>',
    '</svg>'
  ].join('');
  let svg = [
    '<svg xmlns="http://www.w3.org/2000/svg"  width="100px" height="31px">',
    '<path transform="translate(7,3) scale(0.7,0.7)" class="cls-1" d="M0,0H89.71V24H47.642l-3.534,7-4.13-7H0Z" ' +
      'style="fill:rgb(255,255,255);stroke-width:3;stroke:rgb(132, 129, 129)"/>',
    '<text x="40" y="10" text-anchor="middle" alignment-baseline="central" ' +
      'font-size="11" style="fill:black;stroke-width:1">' +
      deviceId +
      '</text>',
    '</svg>'
  ].join('');
  let svgOfflineAlarm = [
    '<svg xmlns="http://www.w3.org/2000/svg"  width="100px" height="31px">',
    '<path transform="translate(7,3) scale(0.7,0.7)" class="cls-1" d="M0,0H89.71V24H47.642l-3.534,7-4.13-7H0Z" ' +
      'style="fill:rgb(175,185,195);stroke-width:3;stroke:rgb(132, 129, 129)"/>',
    '<polygon points="23,0 29,10.6 17,11" fill="#fc540a" transform="translate(64-1)"/>',
    '<text x="40" y="10" text-anchor="middle" alignment-baseline="central" ' +
      'font-size="11" style="fill:black;stroke-width:1">' +
      deviceId +
      '</text>',
    '</svg>'
  ].join('');
  let svgOfflinewarn = [
    '<svg xmlns="http://www.w3.org/2000/svg"  width="100px" height="31px">',
    '<path transform="translate(7,3) scale(0.7,0.7)" class="cls-1" d="M0,0H89.71V24H47.642l-3.534,7-4.13-7H0Z" ' +
      'style="fill:rgb(175,185,195);stroke-width:3;stroke:rgb(132, 129, 129)"/>',
    '<rect width="10" x="65" y="0" height="10" fill="#FDE870" />',
    '<text x="41" y="10" text-anchor="middle" alignment-baseline="central" ' +
      'font-size="11" style="fill:black;stroke-width:1">' +
      deviceId +
      '</text>',
    '</svg>'
  ].join('');
  let svgOffline = [
    '<svg xmlns="http://www.w3.org/2000/svg"  width="100px" height="31px">',
    '<path transform="translate(7,3) scale(0.7,0.7)" class="cls-1" d="M0,0H89.71V24H47.642l-3.534,7-4.13-7H0Z" ' +
      'style="fill:rgb(175,185,195);stroke-width:3;stroke:rgb(132, 129, 129)"/>',
    '<text x="41" y="10" text-anchor="middle" alignment-baseline="central" ' +
      'font-size="11" style="fill:black;stroke-width:1">' +
      deviceId +
      '</text>',
    '</svg>'
  ].join('');

  if (severity === Config.STATUS_CODES.CRITICAL && isConnected) {
    return svgAlarm;
  } else if (severity === Config.STATUS_CODES.WARNING && isConnected) {
    return svgWarn;
  } else if (severity === Config.STATUS_CODES.WARNING && !isConnected) {
    return svgOfflinewarn;
  } else if (severity === Config.STATUS_CODES.CRITICAL && !isConnected) {
    return svgOfflineAlarm;
  } else if (!isConnected) {
    return svgOffline;
  } else if (isConnected) {
    return svg;
  }
};

export {
  onlineAlarm,
  onlineWarn,
  online,
  offlineAlarm,
  offlineWarn,
  offline,
  defaultIcon
};
