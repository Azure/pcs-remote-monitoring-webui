// Copyright (c) Microsoft. All rights reserved.
import $ from 'jquery';
import * as clusterIcons from './clusterIcons';
import EventTopic, { Topics } from '../../common/eventtopic';
import Config from '../../common/config';

import './deviceMap.css';

let map = null;
let pinInfobox = null;
let deviceData;
let container;
let actions;
let init = function(BingMapKey) {
  let options = {
    credentials: BingMapKey,
    mapTypeId: window.Microsoft.Maps.MapTypeId.canvasDark,
    showMapTypeSelector: false,
    animate: false,
    enableSearchLogo: false,
    enableClickableLogo: false,
    showTrafficButton: false, //don't show the traffic icon
    showTermsLink: false, // donot show terms link on Bing Map
    navigationBarMode: window.Microsoft.Maps.NavigationBarMode.minified,
    backgroundColor: window.Microsoft.Maps.Color.fromHex('#000000'), //for changing the background color
    showScalebar: false, // for the Microsoft Bing maps label removal
    zoom: 3
  };
  // Initialize the map
  map = new window.Microsoft.Maps.Map('#deviceMap', options);
  map.getZoomRange = function() {
    return {
      max: 24,
      min: 2
    };
  };
  // Forcibly set the zoom to our min/max whenever the view starts to change beyond them
  var restrictZoom = function() {
    if (map.getZoom() <= map.getZoomRange().min) {
      map.setView({
        zoom: map.getZoomRange().min,
        animate: false
      });
    } else if (map.getZoom() >= map.getZoomRange().max) {
      map.setView({
        zoom: map.getZoomRange().max,
        animate: false
      });
    }
  };
  // Attach a handler to the event that gets fired whenever the map's view is about to change
  window.Microsoft.Maps.Events.addHandler(map, 'viewchangestart', restrictZoom);

  // Hide the infobox when the map is moved.
  window.Microsoft.Maps.Events.addHandler(map, 'viewchange', hideInfobox);
};

let setData = function(settings) {
  deviceData = settings.deviceData;
  container = settings.container;
  actions = settings.actions;
};

let onMapPinClicked = function(e) {
  setTimeout(() => {
    let device = deviceData.filter(item => {
      return item.Id === this.deviceId;
    });
    displayInfobox(this.deviceId, this.location);
    // container.showFlyout();
    // TODO: creat flyout types
    const flyoutConfig = { device: device[0], type: 'Device detail' };
    actions.showFlyout({ ...flyoutConfig });
    EventTopic.publish(Topics.device.selected, device[0], container);
  });
};

let displayInfobox = function(deviceId, location) {
  hideInfobox();

  let width = deviceId.length * 7 + 35;
  let horizOffset = -(width / 2);

  let infobox = new window.Microsoft.Maps.Infobox(location, {
    title: deviceId,
    maxWidth: 1000,
    offset: new window.Microsoft.Maps.Point(horizOffset, 35),
    showPointer: false
  });
  infobox.setMap(map);
  $('.infobox-close').css('z-index', 1);
  pinInfobox = infobox;
};

let hideInfobox = function(e) {
  if (pinInfobox != null) {
    pinInfobox.setOptions({ visible: false });
    map.entities.remove(pinInfobox);
    pinInfobox = null;
  }
};

let setDeviceLocationData = function setDeviceLocationData(
  minLatitude,
  minLongitude,
  maxLatitude,
  maxLongitude,
  deviceLocations
) {
  let i;
  let loc;
  let pin;
  let pinOptions;
  if (!map) {
    return;
  }

  map.entities.clear();
  map.layers.clear();
  let allPins = [];
  if (deviceLocations) {
    /**
    Bing Map renders the devices only if the devices have longitude and latitude.
    If not we are not showing the devices on Map (all devices don't have the longitude and latitude).
    */
    for (i = 0; i < deviceLocations.length; ++i) {
      if (!deviceLocations[i].latitude || !deviceLocations[i].longitude) {
        continue;
      }
      loc = new window.Microsoft.Maps.Location(deviceLocations[i].latitude, deviceLocations[i].longitude);

      pinOptions = {
        zIndex: deviceLocations[i].status,
        icon: clusterIcons.defaultIcon(
          deviceLocations[i].Severity,
          deviceData[i].Connected,
          deviceLocations[i].deviceId
        )
      };
      pin = new window.Microsoft.Maps.Pushpin(loc, pinOptions);
      pin.__customData = {
        Severity: deviceLocations[i].Severity,
        Connected: deviceData[i].Connected
      };
      window.Microsoft.Maps.Events.addHandler(
        pin,
        'click',
        onMapPinClicked.bind({
          deviceId: deviceLocations[i].deviceId,
          location: loc
        })
      );
      allPins.push(pin);
    }
    window.Microsoft.Maps.loadModule('Microsoft.Maps.Clustering', function() {
      //Create a ClusterLayer with options and add it to the map.
      let clusterLayer = new window.Microsoft.Maps.ClusterLayer(allPins, {
        clusteredPinCallback: createCustomClusteredPin,
        gridSize: 80
      });

      map.layers.insert(clusterLayer);
    });
  }
};

const createCustomClusteredPin = cluster => {
  //Define variables for minimum cluster radius, and how wide the outline area of the circle should be.
  var minRadius = 12;
  const containedPushpins = cluster.containedPushpins;
  //Get the number of pushpins in the cluster
  var clusterSize = containedPushpins.length;

  //Calculate the radius of the cluster based on the number of pushpins in the cluster, using a logarithmic scale.
  var radius = Math.log(clusterSize) / Math.log(10) * 5 + minRadius;

  const allSeverities = containedPushpins.map(pushpin => {
    const customData = pushpin.__customData;
    return customData.Severity ? customData.Severity : 'none';
  });

  const allOnline = containedPushpins.every(pushpin => {
    const customData = pushpin.__customData;
    return customData.Connected;
  });

  let chosenSeverity = 'none';
  if (allSeverities.indexOf(Config.STATUS_CODES.CRITICAL) !== -1) {
    chosenSeverity = Config.STATUS_CODES.CRITICAL;
  } else if (allSeverities.indexOf(Config.STATUS_CODES.WARNING) !== -1) {
    chosenSeverity = Config.STATUS_CODES.WARNING;
  }
  let icon;
  if (chosenSeverity === Config.STATUS_CODES.WARNING && allOnline) {
    icon = clusterIcons.onlineWarn(radius, clusterSize);
  } else if (chosenSeverity === Config.STATUS_CODES.CRITICAL && allOnline) {
    icon = clusterIcons.onlineAlarm(radius, clusterSize);
  } else if (allOnline) {
    icon = clusterIcons.online(radius, clusterSize);
  } else if (chosenSeverity === Config.STATUS_CODES.WARNING) {
    icon = clusterIcons.offlineWarn(radius, clusterSize);
  } else if (chosenSeverity === Config.STATUS_CODES.CRITICAL) {
    icon = clusterIcons.offlineAlarm(radius, clusterSize);
  } else {
    icon = clusterIcons.offline(radius, clusterSize);
  }

  //Customize the clustered pushpin using the generated SVG and anchor on its center.
  cluster.setOptions({
    icon: icon,
    color: 'rgb(255,0,0)',
    anchor: new window.Microsoft.Maps.Point(radius, radius),
    textOffset: new window.Microsoft.Maps.Point(-999, -999) //Remove the default text label
  });
};

var invokePinEvent = function invokePinEvent(id) {
  var i = 0,
    entity;
  while (i < map.entities.getLength()) {
    entity = map.entities.get(i);
    if (entity.getId() === id) break;
    i += 1;
  }
  displayInfobox(entity);
};

export default {
  init: init,
  setData: setData,
  setDeviceLocationData: setDeviceLocationData,
  invokePinEvent: invokePinEvent
};
