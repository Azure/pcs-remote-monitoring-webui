// Copyright (c) Microsoft. All rights reserved.

export function isFunction(value) {
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

export function formatString(input, ...values) {
    const matchs = /{\d}/g.exec(input);

    if (!matchs){
        return input;
    }

    for (let i = 0; i < values.length; i++) {
        let regex = new RegExp(`{[${i}]}`,'g');
        input = input.replace(regex, values[i]);
    }
    return input;
}

export default {
    isFunction,
    debounce
}
