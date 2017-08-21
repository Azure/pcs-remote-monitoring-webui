// Copyright (c) Microsoft. All rights reserved.

import AuthenticationContext from 'adal-angular/dist/adal.min.js'
import Config from './config';

const aadProvider = 'oauth.AAD';
const noneProvider = 'none';
let _provider = 'none';
let _authContext;

function onLoad() {
    console.log('Loading authentication protocols...');

    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', Config.authApiUrl + '/protocols', false);
    xmlHttp.send(null);

    let protocols = JSON.parse(xmlHttp.responseText);
    let protocol = protocols.items.length !== 0 ? protocols.items[0] : { type: noneProvider };

    if (protocol) {
        setProvider(protocol);
        handleCallback();
    } else {
        console.error('No supported authentication protocol found');
    }
}

function initializeAADGlobalContext(protocol) {
    return new AuthenticationContext({
        instance: protocol.parameters.loginUri,
        tenant: protocol.parameters.tenantId,
        clientId: protocol.parameters.clientId,
        postLogoutRedirectUri: window.location.origin,
        cacheLocation: 'localStorage'
    });
}

function setProvider(protocol) {
    if (protocol.type.startsWith(aadProvider)) {
        _authContext = initializeAADGlobalContext(protocol);
    } else if (protocol.type !== noneProvider) {
        throw new Error(`Invalidate provider: ${_provider}`);
    }

    _provider = protocol.type;
}

function getProvider() {
    return _provider;
}

function handleCallback() {
    if (_provider.startsWith(aadProvider)) {
        _authContext.handleWindowCallback();
    } else if (_provider !== noneProvider) {
        throw new Error(`Invalidate provider: ${_provider}`);
    }
}

function getUserName() {
    if (_provider.startsWith(aadProvider)) {
        var aadUser = _authContext.getCachedUser();
        return aadUser ? aadUser.userName : null;
    } else if (_provider === noneProvider) {
        return null;
    } else {
        throw new Error(`Invalidate provider: ${_provider}`);
    }
}

function getToken(callback) {
    if (_provider.startsWith(aadProvider)) {
        _authContext.acquireToken(_authContext.config.clientId, function (error, token) {
            callback(token);
        });
    } else if (_provider === noneProvider) {
        callback(null);
    } else {
        throw new Error(`Invalidate provider: ${_provider}`);
    }
}

function login() {
    if (_provider.startsWith(aadProvider)) {
        _authContext.login();
    } else if (_provider !== noneProvider) {
        throw new Error(`Invalidate provider: ${_provider}`);
    }
}

function logout() {
    if (_provider.startsWith(aadProvider)) {
        _authContext.logOut();
    } else if (_provider !== noneProvider) {
        throw new Error(`Invalidate provider: ${_provider}`);
    }
}

export default {
    onLoad,
    getProvider,
    getUserName,
    getToken,
    login,
    logout
};