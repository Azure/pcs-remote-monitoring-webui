[![Build][build-badge]][build-url]
[![Issues][issues-badge]][issues-url]
[![Gitter][gitter-badge]][gitter-url]

* [Intro](#azure-pcs-remote-monitoring-webui)
* [Prerequisites](#prerequisites)
* [Build, Run and Test locally](#build-run-and-test-locally)
* [Contributing to the solution](#contributing-to-the-solution)

Azure PCS Remote Monitoring WebUI
=================================

Web app for Azure IoT PCS Remote Monitoring Solution [dotnet](https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet) and [java](https://github.com/Azure/azure-iot-pcs-remote-monitoring-java).

Prerequisites
=============
## Setup Node
1. Install [node.js](https://nodejs.org/)
2. For developement, you can use your preferred editor
   - [Visual Studio Code](https://code.visualstudio.com/)
   - [Atom](https://atom.io/)
   - [Sublime Text](https://www.sublimetext.com/)
   -  or other preferred editor

Build, run and test locally
===========================
* `cd ~\pcs-remote-monitoring-webui\`
* `npm install`
* `npm start`: Launches the project in browser - watches for code changes and refreshes the page.
* `npm run build`: Creates a production ready build.
* `npm test`: Runs test in watch mode, press `q` to quit
* `npm flow`: Runs Flow type checker. Learn more about Flow [here](https://flow.org/).

Configure enviornment variables to run locally
==============================================
The service by default points to `http://iotpcsdemo.azureedge.net` in the [.env](.env) file. If you would like to configure the service to use local services you can include values for the following enviornment variables 
- REACT_APP_BASE_SERVICE_URL
- REACT_APP_IOTHUBMANAGER_WEBSERVICE_PORT
- REACT_APP_DEVICESIMULATION_WEBSERVICE_PORT
- REACT_APP_UICONFIG_WEBSERVICE_PORT
- REACT_APP_DEVICETELEMETRY_WEBSERVICE_PORT
- REACT_APP_AUTH_WEBSERVICE_PORT

Contributing to the solution
==============================
Please follow our [contribution guildelines](CONTRIBUTING.md) and the code style conventions. 

References
==========
This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Below you will find some information on how to perform common tasks.<br>
You can find the most recent version of this guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

[build-badge]: https://img.shields.io/travis/Azure/pcs-remote-monitoring-webui.svg
[build-url]: https://travis-ci.com/Azure/pcs-remote-monitoring-webui
[issues-badge]: https://img.shields.io/github/issues/azure/pcs-remote-monitoring-webui.svg
[issues-url]: https://github.com/Azure/pcs-remote-monitoring-webui/issues/new
[gitter-badge]: https://img.shields.io/gitter/room/azure/iot-pcs.js.svg
[gitter-url]: https://gitter.im/azure/iot-pcs
