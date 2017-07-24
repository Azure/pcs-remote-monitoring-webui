[![Build][build-badge]][build-url]
[![Issues][issues-badge]][issues-url]
[![Gitter][gitter-badge]][gitter-url]

* [Intro](#azure-pcs-remote-monitoring-webui)
* [Development setup](#development-setup)
* [Build, Run and Test locally](#build-run-and-test-locally)

Azure PCS Remote Monitoring WebUI
=================

Web app for Azure IoT PCS Remote Monitoring Solution [dotnet](https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet) and [java](https://github.com/Azure/azure-iot-pcs-remote-monitoring-java).

Development setup
=================

## Node setup
1. Install the [node.js](https://nodejs.org/)
2. Use your preferred editor \
   [Visual Studio Code](https://code.visualstudio.com/) \
   [Atom](https://atom.io/) \
   [Sublime Text](https://www.sublimetext.com/) \
    or any other editor should be fine

Build, Run and Test locally
==================================

* `cd ~\pcs-remote-monitoring-webui\`
* `npm install`
* `npm start`: Launch the project in browser, watches for code changes and refreshes the page.
* `npm run build`: Creates a production ready build.
* `npm test`: Runs test in watch mode, press `q` to quit
* `npm flow`: Runs Flow type checker, To learn more about Flow, check out [its documentation](https://flow.org/).

Other documents
===============

* [Contributing](CONTRIBUTING.md)

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
