// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import update from 'immutability-helper';

import { AjaxError, Indicator } from 'components/shared';
import {
  Panel,
  PanelHeader,
  PanelHeaderLabel,
  PanelContent,
  PanelOverlay,
  PanelError
} from 'components/pages/dashboard/panel';

import './mapPanel.css';

const AzureMaps = window.atlas;
const nominalDeviceLayer = 'devices-nominal-layer';
const warningDevicesLayer = 'devices-warning-layer';
const criticalDevicesLayer = 'devices-critical-layer';

const deviceToMapPin = ({ id, properties, type }) =>
  new AzureMaps.data.Feature(
    new AzureMaps.data.Point([properties.longitude, properties.latitude]),
    {
      name: id,
      address: properties.location || '',
      type
    }
  );

export class MapPanel extends Component {

  componentDidMount() {
    if (!this.map && this.props.azureMapsKey) {
      this.initializeMap(this.props.azureMapsKey);
    }
    this.calculatePins(this.props, true);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.map && nextProps.azureMapsKey) {
      this.initializeMap(nextProps.azureMapsKey);
    }
    this.calculatePins(nextProps);
  }

  initializeMap(azureMapsKey) {
    const seattlePosition = new AzureMaps.data.Position(-122.3320708, 47.6062);
    this.map = new AzureMaps.Map('map', {
      'subscription-key': azureMapsKey,
      center: seattlePosition,
      zoom: 11
    });

    this.map.addPins([], {
      name: nominalDeviceLayer,
      cluster: true,
      icon: 'pin-blue'
    });

    this.map.addPins([], {
      name: warningDevicesLayer,
      cluster: true,
      icon: 'pin-darkblue'
    });

    this.map.addPins([], {
      name: criticalDevicesLayer,
      cluster: true,
      icon: 'pin-red'
    });
  }

  calculatePins(props, mounting = false) {
    const deviceIds = Object.keys(props.devices);
    const prevDeviceIds = Object.keys(this.props.devices);
    /*
    Zoom to the bounding box of devices only, when
      1) When devices become available for the first time
      2) When the map key becomes available for the first time
      3) When the component is mounting and the devices and map key are already loaded
    */
    const boundZoomToDevices =
      (deviceIds.length > 0 && prevDeviceIds.length === 0)
      || (props.azureMapsKey && !this.props.azureMapsKey)
      || (mounting && props.azureMapsKey && deviceIds.length > 0);

    const geoLocatedDevices = this.extractGeoLocatedDevices(props.devices || []);
    if (this.map && Object.keys(geoLocatedDevices).length > 0) {
      const { normal, warning, critical }  = this.devicesToPins(geoLocatedDevices, props.devicesInAlarm)

      if (this.map) {
        this.map.addPins(normal, { name: nominalDeviceLayer, overwrite: true });
        this.map.addPins(warning, { name: warningDevicesLayer, overwrite: true });
        this.map.addPins(critical, { name: criticalDevicesLayer, overwrite: true });

        if (boundZoomToDevices) {
          this.zoomToPins([].concat.apply([], [ normal, warning, critical ]));
        }
      }
    }
  }

  extractGeoLocatedDevices(devices) {
    return Object.keys(devices)
      .map(key => devices[key])
      .filter(({ properties }) => properties.latitude && properties.longitude);
  }

  devicesToPins(devices, devicesInAlarm) {
    return devices
      .reduce(
        (acc, device) => {
          const devicePin = deviceToMapPin(device);
          const category = device.id in devicesInAlarm ? devicesInAlarm[device.id].severity : 'normal';
          return update(acc, {
            [category]: { $push: [devicePin] }
          });
        },
        { normal: [], warning: [], critical: [] }
    );
  }

  zoomToPins(pins) {
    const lons = [];
    const lats = [];
    pins.forEach(({ geometry: { coordinates: [ longitude, latitude ] } }) => {
      lons.push(longitude);
      lats.push(latitude);
    });

    const swLon = Math.min.apply(null, lons);
    const swLat = Math.min.apply(null, lats);
    const neLon = Math.max.apply(null, lons);
    const neLat = Math.max.apply(null, lats);

    // Zoom the map to the bounding box of the devices
    this.map.setCameraBounds({
      bounds: [ swLon, swLat, neLon, neLat ],
      padding: 50
    });
  }

  zoomIn = () => {
    if (this.map) {
      const currZoom = this.map.getCamera().zoom;
      this.map.setCamera({ zoom: currZoom + 1 });
    }
  }

  zoomOut = () => {
    if (this.map) {
      const currZoom = this.map.getCamera().zoom;
      this.map.setCamera({ zoom: currZoom - 1 });
    }
  }

  render() {
    const { t, isPending, mapKeyIsPending, error } = this.props;
    const showOverlay = !error && isPending && mapKeyIsPending;
    return (
      <Panel className="map-panel-container">
        <PanelHeader>
          <PanelHeaderLabel>{t('dashboard.panels.map.header')}</PanelHeaderLabel>
          { !showOverlay && isPending && <Indicator size="small" /> }
        </PanelHeader>
        <PanelContent className="map-panel-container">
          <div id="map"></div>
          <button className="zoom-btn zoom-in" onClick={this.zoomIn}>+</button>
          <button className="zoom-btn zoom-out" onClick={this.zoomOut}>-</button>
        </PanelContent>
        { showOverlay && <PanelOverlay><Indicator /></PanelOverlay> }
        { !mapKeyIsPending && !this.props.azureMapsKey && <PanelError>{t('dashboard.panels.map.notConfiguredError')}</PanelError> }
        { error && <PanelError><AjaxError t={t} error={error} /></PanelError> }
      </Panel>
    );
  }
}
