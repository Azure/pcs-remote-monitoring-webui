// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import GenericDropDownList from './genericDropDownList';
import fetch from 'node-fetch';
import { mount } from 'enzyme';

window.fetch = fetch;

it('should show default text', () => {
    const wrapper = mount(
        <GenericDropDownList
            publishTopic="testtopic"
            initialState={{
                defaultText: 'defaultText'
            }}
        />);
    expect(wrapper.find('.btn').text()).toEqual('defaultText');
});

it('should show items', () => {
    const wrapper = mount(
        <GenericDropDownList
            publishTopic="testtopic"
            initialState={{
                defaultText: 'defaultText',
                selectFirstItem: true
            }}
            items={[
                {
                    id: 'P1M',
                    text: 'Last 1 month'
                },
                {
                    id: 'P3M',
                    text: 'Last 3 month'
                }
            ]}
        />);

    wrapper.find('a').last().simulate('click');
    expect(wrapper.find('.btn').text()).toEqual('Last 3 month');
});