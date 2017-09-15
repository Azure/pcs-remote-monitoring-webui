// Copyright (c) Microsoft. All rights reserved.

// Include this file during the tests execution
// to emulate the global configuration injected
// in index.html

global.DeploymentConfig = {
  authEnabled: false,
  authType: 'aad2',
  aad : {
    tenant: '00000000-0000-0000-0000-000000000000',
    appId: '00000000-0000-0000-0000-000000000000'
  }
}

export default DeploymentConfig;