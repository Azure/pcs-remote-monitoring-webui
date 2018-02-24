// Copyright (c) Microsoft. All rights reserved.

import { Observable } from 'rxjs';
import { HttpClient } from './httpClient';
import Config from 'app.config';

test('ajax request has timeout parameter', () => {
  const url = 'http://www.fakeurl.com';
  const request = HttpClient.createAjaxRequest({ url }, false);
  expect(request).toMatchObject({
    url,
    timeout: Config.defaultAjaxTimeout,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  });
});
