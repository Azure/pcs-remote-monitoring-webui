// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import CustomDevice from './customDevice';
import fetch from 'node-fetch';
import { mount } from 'enzyme';
import Http from '../../common/httpClient';

window.fetch = fetch;

it('renders without crashing', async () => {
  const devices = ["type1", "type2"];
  let loadingTask;
  jest.spyOn(Http, "get").mockImplementationOnce(() => {
    loadingTask = Promise.resolve(devices);
    return loadingTask;
  });
  mount(<CustomDevice />);
  await loadingTask;
});


it('submits data and the data should be matched with inputs', async () => {
  let loadingTask;
  jest.spyOn(Http, "get").mockImplementationOnce(() => {
    loadingTask = Promise.resolve(["type1", "type2"]);
    return loadingTask;
  });

  jest.spyOn(Http, "post").mockImplementationOnce((url, data) => {
    expect(data[0].count).toBe(10);
    return Promise.resolve(null)
  });

  const wrapper = mount(<CustomDevice />);
  await loadingTask;
  wrapper.find('input').first().simulate('change', { target: { value: 10 } });
  expect(wrapper.state().devices[0].count).toBe(10);

  await wrapper.instance().submit();

  Http.get.mockRestore();
  Http.post.mockRestore();
});

