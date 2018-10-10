// Copyright (c) Microsoft. All rights reserved.

// <models>
import { camelCaseReshape, getItems } from 'utilities';

/**
 * Reshape the server side model to match what the UI wants.
 *
 * Left side is the name on the client side.
 * Right side is the name as it comes from the server (dot notation is supported).
 */
export const toExampleItemModel = (data = {}) => camelCaseReshape(data, {
  'id': 'id',
  'description': 'descr'
});

export const toExampleItemsModel = (response = {}) => getItems(response)
  .map(toExampleItemModel);

// </models>
