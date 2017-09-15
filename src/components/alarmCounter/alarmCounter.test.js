// Copyright (c) Microsoft. All rights reserved.

import MockedConfig from '../../mock/config';
import React from 'react';
import ReactDOM from 'react-dom';
import AlarmCounter from './alarmCounter';
import fetch from 'node-fetch';
import { mount, shallow } from 'enzyme';
import Http from '../../common/httpClient';

window.fetch = fetch;

it('renders without crashing', () => {
  const wrapper = mount(<AlarmCounter />);
});

it('render className', () => {
    const wrapper = shallow(<AlarmCounter />);
    expect(wrapper.find('.alarmCounter')).toHaveLength(1);
    expect(wrapper.find('.alarmCounterTitle')).toHaveLength(1);
    expect(wrapper.find('.alarmCounterContent')).toHaveLength(1);
});

it('sets props', () => {
    const wrapper = mount(<AlarmCounter />);
    wrapper.setProps({ color: '#FFFFFF' });
    wrapper.setProps({ backgroundColor: '#FF0000' });
    wrapper.setProps({ fontSize: '60' });
    expect(wrapper.props().color).toBe('#FFFFFF');
    expect(wrapper.props().backgroundColor).toBe('#FF0000');
    expect(wrapper.props().fontSize).toBe('60');
});

it('loads data', async () => {
  let loadingTask;
  const value = 7;

  jest.spyOn(Http, "get").mockImplementationOnce(() => {
    loadingTask = Promise.resolve(value);
    return loadingTask;
  });

  const wrapper = mount(<AlarmCounter  url= 'api/v1/alarm/P1D/count/Open' />);
  await loadingTask;
  expect(wrapper.state().value).toBe(value);
  Http.get.mockRestore();
});
