// Copyright (c) Microsoft. All rights reserved.

function get(url, options) {
  return ajax(url).then(response => {
    return getJson(response);
  });
}

function post(url, data, options) {
  options = options || {};
  setJsonPayload(options, data);
  options.method = 'POST';
  return ajax(url, options).then(response => {
    return getJson(response);
  });
}

function put(url, data, options) {
  options = options || {};
  setJsonPayload(options, data);
  options.method = 'PUT';
  return ajax(url, options).then(response => {
    return getJson(response);
  });
}

function _delete(url, options) {
  options = options || {};
  options.method = 'DELETE';
  return ajax(url, options).then(response => {
    var contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return getJson(response);
    }
    return {};
  });
}

function ajax(url, options) {
  return fetch(url, options).then(response => {
    if (response.ok) {
      return response;
    } else {
      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  });
}

function getJson(response) {
  return response.status !== 204 ? response.json() : null;
}

function setJsonPayload(options, data) {
  options.headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };
  options.body = JSON.stringify(data);
}

export default { get: get, post: post, put: put, delete: _delete, ajax };
