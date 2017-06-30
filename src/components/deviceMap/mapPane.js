// Copyright (c) Microsoft. All rights reserved.

import $ from 'jquery';
import EventTopic, { Topics } from '../../common/eventtopic';
import Http from "../../common/httpClient";
import Config from "../../common/config";
import allClear from './icon_status_all_clear.svg';
import caution from './icon_status_caution.svg';
import critical from './icon_status_critical.svg';

let mapApiKey = null;
let map = null;
let pinInfobox = null;
let boundsSet = false;
let resources = {
    allClearStatusIcon: allClear,
    cautionStatusIcon: caution,
    criticalStatusIcon: critical,
};
let deviceData;
let container;

let init = function () {
    getMapKey();
}

let setData = function (settings) {
    deviceData = settings.deviceData;
    container = settings.container;
};


let getMapKey = function () {
    Http.get(`${Config.solutionApiUrl}api/v1/mapApiKey`)
        .then((data) => {
            mapApiKey = data.key;
            finishMap();
        }).catch((err) => {
            console.log(err);
        });
}

let finishMap = function finishMap() {
    let options = {
        credentials: mapApiKey,
        mapTypeId: window.Microsoft.Maps.MapTypeId.road,
        animate: false,
        enableSearchLogo: false,
        enableClickableLogo: false,
        navigationBarMode: window.Microsoft.Maps.NavigationBarMode.minified,
        bounds: window.Microsoft.Maps.LocationRect.fromEdges(71, -28, -55, 28)
    };

    // Initialize the map
    map = new window.Microsoft.Maps.Map('#deviceMap', options);

    // Hide the infobox when the map is moved.
    window.Microsoft.Maps.Events.addHandler(map, 'viewchange', hideInfobox);
}


let onMapPinClicked = function (e) {
    setTimeout(() => {
        let device = deviceData.filter((item) => {
            return item.DeviceId === this.deviceId;
        });
        displayInfobox(this.deviceId, this.location);
        container.showFlyout();
        EventTopic.publish(Topics.system.device.selected, device[0], container);
    });
}


let displayInfobox = function (deviceId, location) {
    hideInfobox();

    let width = (deviceId.length * 7) + 35;
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
}

let hideInfobox = function (e) {
    if (pinInfobox != null) {
        pinInfobox.setOptions({ visible: false });
        map.entities.remove(pinInfobox);
        pinInfobox = null;
    }
}

let setDeviceLocationData = function setDeviceLocationData(minLatitude, minLongitude, maxLatitude, maxLongitude, deviceLocations) {
    let i;
    let loc;
    let mapOptions;
    let pin;
    let pinOptions;

    if (!map) {
        return;
    }

    if (!boundsSet) {
        mapOptions = map.getOptions();
        mapOptions.bounds =
            window.Microsoft.Maps.LocationRect.fromCorners(
                new window.Microsoft.Maps.Location(maxLatitude, minLongitude),
                new window.Microsoft.Maps.Location(minLatitude, maxLongitude));
        map.setView(mapOptions);
    }

    map.entities.clear();
    if (deviceLocations) {
        for (i = 0; i < deviceLocations.length; ++i) {
            loc = new window.Microsoft.Maps.Location(deviceLocations[i].latitude, deviceLocations[i].longitude);

            pinOptions = {
                zIndex: deviceLocations[i].status,
            };

            switch (deviceLocations[i].status) {
                case 1:
                    pinOptions.icon = resources.cautionStatusIcon;
                    break;

                case 2:
                    pinOptions.icon = resources.criticalStatusIcon;
                    break;

                default:
                    pinOptions.icon = resources.allClearStatusIcon;
                    break;
            }

            pin = new window.Microsoft.Maps.Pushpin(loc, pinOptions);
            window.Microsoft.Maps.Events.addHandler(pin, 'click', onMapPinClicked.bind({ deviceId: deviceLocations[i].deviceId, location: loc }));
            map.entities.push(pin);
        }
    }
}

var invokePinEvent = function invokePinEvent(id) {
    var i = 0, entity;
    while (i < map.entities.getLength()) {
        entity = map.entities.get(i);
        if (entity.getId() === id)
            break;
        i += 1;
    }
    displayInfobox(entity);
}

export default {
    init: init,
    setData: setData,
    setDeviceLocationData: setDeviceLocationData,
    invokePinEvent: invokePinEvent
}

