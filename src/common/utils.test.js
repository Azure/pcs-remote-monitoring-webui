// Copyright (c) Microsoft. All rights reserved.

import { getLocalTimeFormat, getStandardTimeFormat } from './utils'

const utcDateTime = '2018-03-07T12:51:00Z';
const pacificOffset = '2018-03-07T12:51:00-08:00';
const timeWithoutZone = '2018-03-07T12:51:00';

describe('Time Zone Conversion', () => {
    // if time zone is set in string, should work with isUtc set to true and false
    it('should be able to do basic conversion to -08:00', () => {
        expect(getLocalTimeFormat(utcDateTime, true, "Etc/GMT+8")).toEqual('3/7/2018 4:51:00 AM');
        expect(getLocalTimeFormat(utcDateTime, false, "Etc/GMT+8")).toEqual('3/7/2018 4:51:00 AM');
        expect(getStandardTimeFormat(utcDateTime, true, "Etc/GMT+8")).toEqual('2018-03-07T04:51:00');
        expect(getStandardTimeFormat(utcDateTime, false, "Etc/GMT+8")).toEqual('2018-03-07T04:51:00');
    });

    // if there is no time zone, should assume in utc if isUtc is set to true
    it('if there is no time zone, should be able to convert to -08:00', () => {
        expect(getLocalTimeFormat(timeWithoutZone, true, "Etc/GMT+8")).toEqual('3/7/2018 4:51:00 AM');
        expect(getStandardTimeFormat(timeWithoutZone, true, "Etc/GMT+8")).toEqual('2018-03-07T04:51:00');
    });

    //  converting from one time to the same time zone should not cause any issues
    it('if convert from one time zone to the same time zone, should not change', () => {
        expect(getLocalTimeFormat(pacificOffset, true, "Etc/GMT+8")).toEqual('3/7/2018 12:51:00 PM');
        expect(getStandardTimeFormat(pacificOffset, true, "Etc/GMT+8")).toEqual('2018-03-07T12:51:00');
    });
});
