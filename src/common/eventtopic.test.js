// Copyright (c) Microsoft. All rights reserved.

import EventTopic, { Topics, TOPIC_NAME } from './eventtopic'

describe('Topics', () => {

    it('should be an non-null object', () => {
        expect(Topics).not.toBeNull();
        expect(Topics).not.toBeInstanceOf(Function);
    })

    it('should contains meta property "__name__"', () => {
        for (let t in Topics) {
            expect(Topics[t]).toHaveProperty(TOPIC_NAME);
        }
    })

});

describe('subscribe function', () => {

    it('should be called with non-null argument', () => {
        expect(() => EventTopic.subscribe(null, expect.anything())).toThrow();
    });

    it('should return an unique id with prefix "uid_"', () => {
        expect(EventTopic.subscribe(Topics.system, expect.anything())).toMatch(/uid_\d+/);
        expect(EventTopic.subscribe('another', expect.anything())).toMatch(/uid_\d+/);
    });

    it('should capture specific topic', () => {
        let mockFn = jest.fn();
        EventTopic.subscribe(Topics.system, mockFn);
        EventTopic.publishSync(Topics.system, {'foo':'bar'}, null);
        expect(mockFn).toBeCalledWith(Topics.system[TOPIC_NAME], {'foo': 'bar'}, null);
    });

    it('should capture multiple topics', () => {
        let mockFn = jest.fn();
        EventTopic.subscribe(Topics.system, mockFn);
        EventTopic.publishSync(Topics.system, {'foo':'bar'}, null);
        EventTopic.publishSync(Topics.system.device, {'deviceId': 123}, null);
        expect(mockFn).toHaveBeenCalledTimes(2);
        expect(mockFn).toBeCalledWith(Topics.system[TOPIC_NAME], {'foo': 'bar'}, null);
        expect(mockFn).toBeCalledWith(Topics.system.device[TOPIC_NAME], {'deviceId': 123}, null);
    });

});

describe('publish function', () => {

    it('should be called with non-null argument', () => {
        expect(() => EventTopic.publish(null, expect.anything())).toThrow();
    });

    it('should return true', () => {
        expect(EventTopic.publish(Topics.system, expect.anything(), expect.anything())).toEqual(true);
        expect(EventTopic.publish('another', expect.anything(), expect.anything())).toEqual(true);
    });

});

describe('publishSync function', () => {

    it('should be called with non-null argument', () => {
        expect(() => EventTopic.publishSync(null, expect.anything())).toThrow();
    });

    it('should return true', () => {
        expect(EventTopic.publishSync(Topics.system, expect.anything(), expect.anything())).toEqual(true);
        expect(EventTopic.publishSync('another', expect.anything(), expect.anything())).toEqual(true);
    });

});

describe('unsubscribe function', () => {

    it('should return siliently with any argument', () => {
        expect(() => EventTopic.unsubscribe()).not.toThrow();
        expect(() => EventTopic.unsubscribe(null)).not.toThrow();
        expect(() => EventTopic.unsubscribe('another')).not.toThrow();
        expect(() => EventTopic.unsubscribe(Topics.system)).not.toThrow();
        expect(() => EventTopic.unsubscribe([null, 'another', Topics.system])).not.toThrow();
    });

    it('should unsubscribe subscribed topics', () => {
        const mockCallback = jest.fn();
        const uid = EventTopic.subscribe(Topics.system, mockCallback);
        expect(EventTopic.unsubscribe(uid)).toEqual(uid);

        const anotherId = EventTopic.unsubscribe('another'.mockCallback);
        expect(EventTopic.unsubscribe(anotherId)).toEqual(anotherId);
    });

});

describe('clearSubscription function', () => {
    it('should clear specific topics successfully', () => {
        expect(() => EventTopic.clearSubscriptions(Topics.system)).not.toThrow();
        expect(() => EventTopic.clearSubscriptions('another')).not.toThrow();
    })
});

describe('clearAllSubscriptions function', () => {
    it('should clear all topics successfully', () => {
        expect(() => EventTopic.clearAllSubscriptions()).not.toThrow();
    })
});
