// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import Config from '../../common/config';
import EventTopic, { Topics } from '../../common/eventtopic';
import SearchableDataGrid from '../../framework/searchableDataGrid/searchableDataGrid';
import GenericDropDownList from '../../components/genericDropDownList/genericDropDownList';
import Flyout, { Header, Body } from '../../framework/flyout/flyout';
import DeviceDetail from '../deviceDetail/deviceDetail';
import AddDevice from '../addDevice/addDevice';
import ActOnDevice from '../actOnDevice/actOnDevice';
import lang from '../../common/lang';
import Http from '../../common/httpClient';

import './deviceList.css';

export default class DeviceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [
        {
          headerName: lang.DEVICES.DEVICEID,
          field: 'Id',
          filter: 'text'
        },
        {
          headerName: lang.DEVICES.TYPE,
          field: 'Twin.tags.deviceType',
          filter: 'text'
        },
        {
          headerName: lang.DEVICES.FIRMWAREVERSION,
          field: 'Twin.reportedProperties.FirmwareVersion',
          filter: 'text'
        },
        {
          headerName: lang.DEVICES.MANUFACTURER,
          field: 'Twin.reportedProperties.Manufacturer',
          filter: 'text'
        },
        {
          headerName: lang.DEVICES.MODELNUMBER,
          field: 'Twin.reportedProperties.ModelNumber',
          filter: 'text'
        },
        {
          headerName: lang.DEVICES.STATE,
          field: 'Connected',
          filter: 'text',
          valueFormatter: (params) => {
            return params.value ? lang.DEVICES.CONNECTED : lang.DEVICES.DISCONNECTED;
          }
        },
        {
          headerName: lang.DEVICES.ENABLED,
          field: 'Enabled',
          filter: 'boolean'
        },
        {
          headerName: lang.DEVICES.SYNC,
          field: '',
          filter: 'boolean'
        }
      ]
    };
  }

  onDataChanged = () => {
    this.refs.grid.selectAll();
  };

  onRowClick = row => {
    setTimeout(() => {
      this.refs.flyout.show();
      EventTopic.publish(Topics.device.selected, row, this);
    });
  };

  onRowSelectionChanged = rows => {
    this.setState({
      devices: rows
    });
  };

  getData = async (filter, callback) => {
    // TODO: wait for the global filter to be checked in and get selected device group from props
    // TODO: Pass conditions to api
    const url = `${Config.iotHubManagerApiUrl}devices`;
    
    Http.get(url).then(data => {
      callback(data.items);
    });
  };

  render() {
    return (
      <div ref="container" className="deviceListContainer">
        <div className="deviceListButtonBar">
          <div className="deviceListButton">
            <GenericDropDownList
              id="DeviceGroups"
              menuAlign="right"
              requestUrl={Config.deviceGroupApiUrl}
              initialState={{
                defaultText: lang.DEVICES.CHOOSEDEVICES
              }}
              newItem={{
                text: lang.DEVICES.NEWGROUP,
                dialog: 'deviceGroupEditor'
              }}
              publishTopic={Topics.dashboard.deviceGroup.selected}
              reloadRequestTopic={Topics.dashboard.deviceGroup.changed}
            />
          </div>
          <div className="deviceListButton">
            <ActOnDevice
              ref="actOnDevice"
              buttonText={lang.DEVICES.ACTONDEVICES}
              devices={this.state.devices}
            />
          </div>
          <div className="deviceListButton">
            <AddDevice />
          </div>
        </div>
        <SearchableDataGrid
          ref="grid"
          getData={this.getData}
          multiSelect={true}
          title=""
          showLastUpdate={true}
          urlSearchPattern="/\{group\}/i"
          eventDataKey="0"
          enableSearch={true}
          autoLoad={true}
          topics={[Topics.dashboard.deviceGroup.selected]}
          columnDefs={this.state.columnDefs}
          pagination={false}
          onRowSelectionChanged={this.onRowSelectionChanged}
          onRowClicked={this.onRowClick}
          onGridReady={this.onDataChanged}
          onRowDataChanged={this.onDataChanged}
        />
        <Flyout ref="flyout">
          <Header>
            {lang.DEVICES.DEVICEDETAIL}
          </Header>
          <Body>
            <DeviceDetail />
          </Body>
        </Flyout>
      </div>
    );
  }
}
