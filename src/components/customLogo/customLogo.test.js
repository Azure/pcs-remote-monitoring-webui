// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import CustomLogo from './customLogo';
import fetch from 'node-fetch';
import { mount, shallow } from 'enzyme';
import Http from '../../common/httpClient';

window.fetch = fetch;

it('renders without crashing', () => {
  mount(<CustomLogo />);
});

it('contains a Button, a FileUploader and a img', () => {
  const wrapper = shallow(<CustomLogo />);
  expect(wrapper.find('Button')).toHaveLength(1);
  expect(wrapper.find('FileUploader')).toHaveLength(1);
  expect(wrapper.find('img')).toHaveLength(1);
});

it('loads data', async () => {
  const logo = "http://some/img";

  let loadingTask;
  jest.spyOn(Http, "get").mockImplementationOnce(() => {
    loadingTask = Promise.resolve({ "logo": logo});
    return loadingTask;
  });

  const wrapper = mount(<CustomLogo />);
  await loadingTask;
  
  expect(wrapper.state().img.split('?')[0]).toBe(logo);
  expect(wrapper.state().img).toBe(wrapper.find("img").node.src);
  
  Http.get.mockRestore();
});

it('handles button click event', async () => {
  const wrapper = mount(<CustomLogo />);

  wrapper.instance().onUpload = jest.fn();
  wrapper.update();
  wrapper.find('button').simulate('click');

  expect(wrapper.instance().onUpload).toHaveBeenCalled()
});

