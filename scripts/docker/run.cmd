@ECHO off & setlocal enableextensions enabledelayedexpansion

:: Usage:
:: scripts\docker\run         : Starts the stable version
:: scripts\docker\run testing : Starts the testing version

:: Note: use lowercase names for the Docker images
SET DOCKER_IMAGE=azureiotpcs/pcs-remote-monitoring-webui
SET STABLE_VERSION=1.0.0-preview

IF "%1"=="" goto :STABLE
IF "%1"=="testing" goto :TESTING

:STABLE
  echo Starting Remote Monitoring Web UI [%STABLE_VERSION%] ...
  docker run -it -p 10080:80 -p 10443:443 %DOCKER_IMAGE%:%STABLE_VERSION%
  goto :END

:TESTING
  echo Starting Remote Monitoring Web UI [testing version] ...
  docker run -it -p 10080:80 -p 10443:443 %DOCKER_IMAGE%:testing
  goto :END


:END

endlocal
