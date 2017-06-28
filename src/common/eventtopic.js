/*
 * Event service based on Publish/Subscribe model.
 * This implementation encapsulate the PubSub.js
 * [https://github.com/mroderick/PubSubJS]
 * and extend customized options and topic model.
*/

import PubSub from 'pubsub-js'

export const TOPIC_NAME = '__name__';

export const Topics = {
    system: {
        //[TOPIC_NAME]: 'SYSTEM',
        module: {
            selected: 'module is selected',
            preview: 'request a module preview'
        },
        data: {
            submit: 'submit data',
            submitAck: 'submit ack',
            submitResult: 'submition result'
        },
        dashboard: {
            opened: 'dashboard is opened',
            closed: 'dashboard is closed',
        },
        device: {
            selected: 'device is selected',
            unselected: 'device is unselected',
            filtered: 'device filter is sent',
            mouseover: 'device is mouseovered',
            editIcon: 'device icon is edited',
            twin: {
                updated: 'device twin is updated',
                opened: 'device twin is opened'
            },
            multiSelection: 'multiple devices are selected',
            configAction: 'config devices',
            organizeAction: 'organize devices',
            scheduleAction: 'schedule an action',
            diagnose: 'diagnose an device'
        },
        grid:{
            itemSelected: 'datagrid item is selected',
            itemsSelected: 'datagrid items are selected'
        },
        job: {
            devicesSelected: 'devices are selected',
            scheduled: 'job is scheduled',
            selected: 'job is selected',
        },
        dropdownlist: {
            selectionChanged: 'dropdownlist selection changed'
        }
    }
};

for (var topName in Topics) {
    extendTopicName(Topics[topName], topName, null);
}

function extendTopicName(topicObj, topicName, parentObj) {
    topicObj[TOPIC_NAME] = topicObj[TOPIC_NAME] || (parentObj ? parentObj[TOPIC_NAME] + '.' + topicName : topicName);

    for (var propertyName in topicObj) {
        if (!topicObj.hasOwnProperty(propertyName) || propertyName === TOPIC_NAME) {
            continue;
        }
        if (typeof topicObj[propertyName] === 'object') {
            extendTopicName(topicObj[propertyName], propertyName, topicObj);
        } else {
            delete topicObj[propertyName];
            topicObj[propertyName] = {[TOPIC_NAME]: topicObj[TOPIC_NAME] + '.' + propertyName};
        }
    }

    return topicObj;
}

function InvalidTopicException(topic) {
    this.message = "Invalid topic definition: " + topic;
}

/**
 *	PubSub.publish( topic, payload, publisher ) -> Boolean
 *	- message (String or Object): The message to publish
 *	- payload: The payload to pass to subscribers
 *  - eventsource: The topic publisher object
 *	Publishes the the message, passing the data to it's subscribers
**/
var publish = function (topic, payload, publisher) {
    var data = {
        payload: payload,
        publisher: publisher,
    };
    if (typeof topic === 'string') {
        return PubSub.publish(topic, data);
    } else if (typeof topic === 'object' && topic[TOPIC_NAME]) {
        return PubSub.publish(topic[TOPIC_NAME], data);
    } else {
        throw new InvalidTopicException(topic);
    }
}

/**
 *	PubSub.publishSync( topic, payload, publisher) -> Boolean
 *	- message (String or Object): The message to publish
 *	- payload: The payload to pass to subscribers
 *  - publisher: The topic publisher object
 *	Publishes the the message synchronously, passing the payload to it's subscribers
**/
var publishSync = function (topic, payload, publisher) {
    var data = {
        payload: payload,
        publisher: publisher,
    };
    if (typeof topic === 'string') {
        return PubSub.publishSync(topic, data);
    }
    else if (typeof topic === 'object' && topic[TOPIC_NAME]) {
        return PubSub.publishSync(topic[TOPIC_NAME], data);
    }
    else {
        throw new InvalidTopicException(topic);
    }
}

/**
 *	PubSub.subscribe( message, callback ) -> String
 *	- message (String or Object): The message to subscribe to
 *	- callback (Function): The callback when a new message is published
 *	Subscribes the passed callback to the passed message. Every returned token is unique and should be stored if
 *	you need to unsubscribe
**/
var subscribe = function (topic, callback) {
    if (typeof topic === 'string') {
        return PubSub.subscribe(topic, function (topic, data) {
            callback(topic, data.payload, data.publisher);
        });
    } else if (typeof topic === 'object' && topic[TOPIC_NAME]) {
        return PubSub.subscribe(topic[TOPIC_NAME], function (topic, data) {
            callback(topic, data.payload, data.publisher);
        });
    } else {
        throw new InvalidTopicException(topic);
    }
}

/*Public: Clear subscriptions by the topic
*/
var clearSubscriptions = function (topic) {
    if (typeof topic === 'string') {
        return PubSub.clearSubscriptions(topic);
    } else if (typeof topic === 'object' && topic[TOPIC_NAME]) {
        return PubSub.clearSubscriptions(topic[TOPIC_NAME]);
    } else {
        throw new InvalidTopicException(topic);
    }
}

/* Public: Clears all subscriptions
    */
var clearAllSubscriptions = function () {
    PubSub.clearAllSubscriptions();
}

/* Public: removes subscriptions.
        * When passed a token, removes a specific subscription.
        * When passed a function, removes all subscriptions for that function
        * When passed a topic, removes all subscriptions for that topic (hierarchy)
        * When passed an Array, removes all subscriptions, functions or topics (hierarchy)
        *
        * value - A token, function or topic to unsubscribe.
        *
        * Examples
        *
        *		// Example 1 - unsubscribing with a token
        *		var token = PubSub.subscribe('mytopic', myFunc);
        *		PubSub.unsubscribe(token);
        *
        *		// Example 2 - unsubscribing with a function
        *		PubSub.unsubscribe(myFunc);
        *
        *		// Example 3 - unsubscribing a topic
        *		PubSub.unsubscribe('mytopic');
        *
        *		// Example 4 - unsubscribing an Array of topic
        *		PubSub.unsubscribe(['uid_1', 'uid_2']);
*/
var unsubscribe = function (value) {
    if (Array.isArray(value)) {
        var results = [];
        value.forEach(function (v) {
            results.push(PubSub.unsubscribe(v));
        });
        return results;
    } else {
        return PubSub.unsubscribe(value);
    }
}

export default {
    subscribe,
    publish,
    publishSync,
    unsubscribe,
    clearSubscriptions,
    clearAllSubscriptions
}