// Copyright (c) Microsoft. All rights reserved.

export function isFunction (value) {
    return typeof value === 'function';
}

export function debounce(fn, delay) {
    var timer = null;
    return function () {
        var context = this, args = arguments;
        args[0].persist();
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    };
}

export default {
    isFunction,
    debounce
}
