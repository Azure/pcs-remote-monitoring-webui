// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import MapPane from './mapPane';
import Http from "../../common/httpClient"
import Config from "../../common/config"
import Flyout from '../../framework/flyout/flyout';
import DeviceDetail from '../deviceDetail/deviceDetail';

class DeviceMap extends Component {
    constructor(props) {
        super(props);
        window.loadMap = () => {
            MapPane.init();
            this.showMap();
        }
    }

    componentDidMount() {
        this.createScript('https://www.bing.com/api/maps/mapcontrol?callback=loadMap');
    }

    loadDeviceList(group) {
        return Http.get(`${Config.solutionApiUrl}api/v1/devices/twin?filter=`);
    }

    showMap() {
        this.loadDeviceList()
            .then((data) => {
                MapPane.setData({
                    deviceData: data,
                    container: this
                });
                data = this.getDeviceData(data);
                MapPane.setDeviceLocationData(
                    data.minLat,
                    data.minLong,
                    data.maxLat,
                    data.maxLong,
                    data.locationList
                );
            });
    }

    showFlyout = () => {
        this.refs.flyout.show();
    }

    getDeviceData(data) {
        let Location = function (deviceId) {
            this.deviceId = deviceId;
            this.latitude = null;
            this.longitude = null;
            this.status = null;
        }
        let minLat;
        let maxLat;
        let minLong;
        let maxLong;
        let offset = 0.05;
        let mapData = {};
        let longitudes = [];
        let latitudes = [];
        let locationList =data.map(function (item, i) {
            let location = new Location(item.DeviceId);
            if (item.DeviceId.match(/10_/)) {
                location.status = 1;
            } else if (item.DeviceId.match(/6_/)) {
                location.status = 2;
            } else {
                location.status = 0;
            }
            let latitude = location.latitude = item["reported.Device.Location.Latitude"];
            let longitude = location.longitude = item["reported.Device.Location.Longitude"];
            latitudes.push(latitude);
            longitudes.push(longitude);
            return location;
        });
        minLat = Math.min.apply(null, latitudes);
        maxLat = Math.max.apply(null, latitudes);
        minLong = Math.min.apply(null, longitudes);
        maxLong = Math.max.apply(null, longitudes);

        if (locationList.Count === 0) {
            minLat = 47.6;
            maxLat = 47.6;
            minLong = -122.3;
            maxLong = -122.3;
        }
        mapData.minLat = minLat - offset;
        mapData.maxLat = maxLat + offset;
        mapData.minLong = minLong - offset;
        mapData.maxLong = maxLong + offset;
        mapData.locationList = locationList;
        return mapData;
    }

    createScript(src) {
        return new Promise((resolve, reject) => {
            let script = document.createElement('script');
            script.src = src;
            script.addEventListener('load', function () {
                resolve();
            });
            script.addEventListener('error', function (e) {
                reject(e);
            });
            document.body.appendChild(script);
        })
    };

    render() {
        return (
            <div style={{ width:"100%", height:"100%" }}>
                <div id="deviceMap" className="dashboard_device_map">
                </div>
                <Flyout ref='flyout'>
                    <DeviceDetail />
                </Flyout>
            </div>
        );
    }
}

export default DeviceMap;