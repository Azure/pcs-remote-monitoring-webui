// Copyright (c) Microsoft. All rights reserved.

import MockedConfig from '../../mock/config';
import React from 'react';
import GenericDropDownList from './genericDropDownList';
import EventTopic from '../../common/eventtopic';
import Http from '../../common/httpClient';
import fetch from 'node-fetch';
import { mount } from 'enzyme';

window.fetch = fetch;

it('should show default text', () => {
    const wrapper = mount(
        <GenericDropDownList
            publishTopic='testtopic'
            initialState={{
                defaultText: 'defaultText'
            }}
        />);
    expect(wrapper.find('.btn').text()).toEqual('defaultText');
});

it('should work well in server-less mode', () => {
    const wrapper = mount(
        <GenericDropDownList
            publishTopic='pubTestTopic'
            initialState={{
                defaultText: 'defaultText',
                selectFirstItem: true
            }}
            multipleSelect={true}
            items={[
                {
                    id: 'Item0',
                    text: 'Text 0'
                },
                {
                    id: 'Item1',
                    text: 'Text 1'
                },
                {
                    id: 'Item2',
                    text: 'Text 2'
                },
            ]}
        />);
    expect(wrapper.find('.btn').text()).toEqual('Text 0');

    jest.spyOn(EventTopic, "publish").mockImplementationOnce((topic, ids, publisher) => {
        expect(topic).toEqual('pubTestTopic');
        expect(ids).toEqual(['Item0', 'Item2']);
        expect(publisher).toEqual(wrapper.instance());
    });
    wrapper.find('a').last().simulate('click');
    expect(wrapper.find('.btn').text()).toEqual('Text 0, Text 2');

    jest.spyOn(EventTopic, "publish").mockImplementationOnce((topic, ids, publisher) => {
        expect(topic).toEqual('pubTestTopic');
        expect(ids).toEqual(['Item2']);
        expect(publisher).toEqual(wrapper.instance());
    });
    wrapper.find('a').first().simulate('click');
    expect(wrapper.find('.btn').text()).toEqual('Text 2');

    EventTopic.publish.mockRestore();
});

it('should work well in server mode', async () => {
    let loadingTask = Promise.resolve(["Item0", "Item1", "Item2"]);
    jest.spyOn(Http, "get").mockImplementationOnce((url) => {
        return loadingTask;
    });

    const wrapper = mount(
        <GenericDropDownList
            publishTopic='pubTestTopic'
            reloadRequestTopic='subTestTopic'
            requestUrl='http://requestUrl'
            initialState={{
                defaultText: 'defaultText',
                selectFirstItem: false
            }}
        />);

    await loadingTask;
    expect(wrapper.find('li').map(o=>o.text())).toEqual(['Item0', 'Item1', 'Item2']);

    loadingTask = Promise.resolve(["Item4", "Item5"]);
    jest.spyOn(Http, "get").mockImplementationOnce((url) => {
        return loadingTask;
    });

    EventTopic.publishSync('subTestTopic', null, wrapper.instance());
    await loadingTask;

    expect(wrapper.find('li').length).toEqual(2);
    expect(wrapper.find('li').map(o=>o.text())).toEqual(['Item4', 'Item5']);
    Http.get.mockRestore();
});