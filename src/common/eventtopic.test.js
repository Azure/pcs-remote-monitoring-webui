// Copyright (c) Microsoft. All rights reserved.

import EventTopic, { Topics } from './eventtopic'

describe('Topics', () => {
    it('should be an non-null object', () => {
        expect(Topics).not.toBeNull();
        expect(Topics).not.toBeInstanceOf(Function);
    })
});

describe('subscribe function', () => {

    it('should throw exception when invalid topic is provided', () => {
        expect(() => EventTopic.subscribe(null, expect.anything())).toThrow();
        expect(() => EventTopic.subscribe('', expect.anything())).toThrow();
        expect(() => EventTopic.subscribe(undefined, expect.anything())).toThrow();
        expect(() => EventTopic.subscribe('any', expect.anything())).not.toThrow();
    });

    it('should return an unique id with prefix "uid_"', () => {
        expect(EventTopic.subscribe(Topics.system.all, expect.anything())).toMatch(/uid_\d+/);
        expect(EventTopic.subscribe('another', expect.anything())).toMatch(/uid_\d+/);
    });

    it('should capture specific topic', () => {
        let mockFn = jest.fn();
        EventTopic.subscribe(Topics.system.all, mockFn);
        EventTopic.publishSync(Topics.system.all, {'foo':'bar'}, null);
        expect(mockFn).toBeCalledWith(Topics.system.all, {'foo': 'bar'}, null);
    });

    it('should capture multiple topics', () => {
        let mockFn = jest.fn();
        EventTopic.subscribe(Topics.system.all, mockFn);
        EventTopic.publishSync(Topics.system.all, {'foo':'bar'}, null);
        EventTopic.publishSync(Topics.system.device.all, {'deviceId': 123}, null);
        expect(mockFn).toHaveBeenCalledTimes(2);
        expect(mockFn).toBeCalledWith(Topics.system.all, {'foo': 'bar'}, null);
        expect(mockFn).toBeCalledWith(Topics.system.device.all, {'deviceId': 123}, null);
    });

});

describe('publish function', () => {

    it('should not throw exception when null argument is provided', () => {
        expect(() => EventTopic.publish(null, expect.anything())).toThrow();
        expect(() => EventTopic.publish('', expect.anything())).toThrow();
        expect(() => EventTopic.publish(undefined, expect.anything())).toThrow();
        expect(() => EventTopic.publish('any', expect.anything())).not.toThrow();
    });

    it('should return true', () => {
        expect(EventTopic.publish(Topics.system.all, expect.anything(), expect.anything())).toEqual(true);
        expect(EventTopic.publish('another', expect.anything(), expect.anything())).toEqual(true);
    });

});

describe('publishSync function', () => {

    it('should not throw exception when null argument is provided', () => {
        expect(() => EventTopic.publishSync(null, expect.anything())).toThrow();
    });

    it('should return true', () => {
        expect(EventTopic.publishSync(Topics.system.all, expect.anything(), expect.anything())).toEqual(true);
        expect(EventTopic.publishSync('another', expect.anything(), expect.anything())).toEqual(true);
    });

});

describe('unsubscribe function', () => {

    it('should return siliently with any argument', () => {
        expect(() => EventTopic.unsubscribe()).not.toThrow();
        expect(() => EventTopic.unsubscribe(null)).not.toThrow();
        expect(() => EventTopic.unsubscribe('another')).not.toThrow();
        expect(() => EventTopic.unsubscribe(Topics.system.all)).not.toThrow();
        expect(() => EventTopic.unsubscribe([null, 'another', Topics.system])).not.toThrow();
    });

    it('should unsubscribe subscribed topics', () => {
        const mockCallback = jest.fn();
        const uid = EventTopic.subscribe(Topics.system.all, mockCallback);
        expect(EventTopic.unsubscribe(uid)).toEqual(uid);

        const anotherId = EventTopic.unsubscribe('another'.mockCallback);
        expect(EventTopic.unsubscribe(anotherId)).toEqual(anotherId);
    });

});

describe('clearSubscription function', () => {
    it('should clear specific topics successfully', () => {
        expect(() => EventTopic.clearSubscriptions(Topics.system.all)).not.toThrow();
        expect(() => EventTopic.clearSubscriptions('another')).not.toThrow();
    })
});

describe('clearAllSubscriptions function', () => {
    it('should clear all topics successfully', () => {
        expect(() => EventTopic.clearAllSubscriptions()).not.toThrow();
    })
});
