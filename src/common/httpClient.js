// Copyright (c) Microsoft. All rights reserved.

import auth from "./auth";

function get(url, options) {
  return ajax(url).then(response => {
    return getJson(url, response);
  });
}

function post(url, data, options) {
  options = options || {};
  setJsonPayload(options, data);
  options.method = 'POST';
  return ajax(url, options).then(response => {
    return getJson(url, response);
  });
}

function put(url, data, options) {
  options = options || {};
  setJsonPayload(options, data);
  options.method = 'PUT';
  return ajax(url, options).then(response => {
    return getJson(url, response);
  });
}

function patch(url, data, options) {
  options = options || {};
  setJsonPayload(options, data);
  options.method = 'PATCH';
  return ajax(url, options).then(response => {
    return getJson(url, response);
  });
}

function _delete(url, options) {
  options = options || {};
  options.method = 'DELETE';
  return ajax(url, options).then(response => {
    var contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return getJson(url, response);
    }
    return {};
  });
}

function ajax(url, options) {
  options = options || {};
  options.headers = options.headers || {};

  // Required by the backend web services when the Authorization
  // header is not valid, to tell the CSRF protection to allow
  // this request through (assuming that Auth is not mandatory,
  // e.g. during development).
  options.headers['Csrf-Token'] = 'nocheck';

  auth.getAccessToken(accessToken => {
    if (accessToken) {
      options.headers['Authorization'] = 'Bearer ' + accessToken;
    }
  });

  return fetch(url, options).then(
    response => {
      if (response.status < 300) {
        return response;
      } else if (response.status === 401) {
        // Sign in required
        console.warn('User needs to sign in for: ' + url);
        return null;
      } else if (response.status === 403) {
        // Signed in but not authorized
        console.error('User is not authorized for: ' + url);
        return null;
      } else {
        var error = new Error(response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    }
  );
}

function getJson(url, response) {
  if (response && typeof response !== 'undefined') {
    return response.status !== 204 && response.status !== 401 && response.status !== 403
    ? response.json()
    : null;
  }

  console.warn("Response object for " + url + " is null.");
  return null;
}

function setJsonPayload(options, data) {
  options.headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };
  options.body = JSON.stringify(data);
}

export default { get, post, put, delete: _delete, ajax, patch };
