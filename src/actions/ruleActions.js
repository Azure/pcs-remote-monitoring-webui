// Copyright (c) Microsoft. All rights reserved.

import * as types from './actionTypes';

export const rulesSelectionChanged = rules => {
    return {
        type: types.RULE_LIST_ROW_SELECTION_CHANGED,
        data: rules
    };
};