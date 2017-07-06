// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import ReactDOM from 'react-dom';
import CustomInfo from './customInfo';
import fetch from 'node-fetch';
import { mount, shallow } from 'enzyme';
import Http from '../../common/httpClient';

window.fetch = fetch;

it('renders without crashing', () => {
  const wrapper = mount(<CustomInfo />);
});

it('contains NameInput and DescInput', () => {
  const wrapper = shallow(<CustomInfo />);
  expect(wrapper.find('NameInput')).toHaveLength(1);
  expect(wrapper.find('DescInput')).toHaveLength(1);
});

it('renders a input and a textarea', () => {
  const wrapper = mount(<CustomInfo />);
  expect(wrapper.find('input')).toHaveLength(1);
  expect(wrapper.find('textarea')).toHaveLength(1);
});

it('changes state when text changed', async () => {
  const wrapper = mount(<CustomInfo />);
  wrapper.find('input').simulate('change', { target: { value: 'ABC' } });
  wrapper.find('textarea').simulate('change', { target: { value: 'DEF' } });
  expect(wrapper.state().name).toBe('ABC');
  expect(wrapper.state().description).toBe('DEF');
});

it('loads data', async () => {
  const name = "MySolution";
  const description = "MySolution Description";
  let loadingTask;
  jest.spyOn(Http, "get").mockImplementationOnce(() => {
    loadingTask = Promise.resolve({ "name": name, "description": description });
    return loadingTask;
  });

  const wrapper = mount(<CustomInfo />);
  await loadingTask;

  expect(wrapper.state().name).toBe(name);
  expect(wrapper.find("input").node.value).toBe(name);
  expect(wrapper.state().description).toBe(description);
  expect(wrapper.find("textarea").node.value).toBe(description);

  Http.get.mockRestore();
});

it('submits data and the data should be matched with inputs', async () => {
  const name = "MySolution";
  const description = "MySolution Description";
  const name2 = "MySolution2";
  const description2 = "MySolution Description2";

  let loadingTask;
  jest.spyOn(Http, "get").mockImplementationOnce(() => {
    loadingTask = Promise.resolve({ "name": name, "description": description });
    return loadingTask;
  });
  jest.spyOn(Http, "post").mockImplementationOnce((url, data) => {
    expect(data.name).toBe(name2);
    expect(data.description).toBe(description2);
    return Promise.resolve(null)
  });

  const wrapper = mount(<CustomInfo />);
  await loadingTask;

  // change value
  wrapper.find('input').simulate('change', { target: { value: name2 } });
  wrapper.find('textarea').simulate('change', { target: { value: description2 } });

  // submit
  await wrapper.instance().submit();

  Http.get.mockRestore();
  Http.post.mockRestore();
});