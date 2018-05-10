// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import Config from 'app.config';
import { isFunc } from 'utilities';

const AzureMaps = window.atlas;

export class AzureMap extends Component {

  componentDidMount() {
    if (!this.map && this.props.azureMapsKey) {
      this.initializeMap(this.props.azureMapsKey);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.map && nextProps.azureMapsKey) {
      this.initializeMap(nextProps.azureMapsKey);
    }
  }

  componentWillUnmount() {
    // Clean up the azure map resources on unmount
    if (this.map) this.map.remove();
  }

  initializeMap(azureMapsKey) {
    this.map = new AzureMaps.Map('map', {
      'subscription-key': azureMapsKey,
      center: Config.mapCenterPosition,
      zoom: 11
    });

    this.map.addEventListener('load', () => {
      if (isFunc(this.props.onMapReady)) {
        this.props.onMapReady(this.map);
      }
    });
  }

  render() {
    return <div id="map"></div>;
  }

}
