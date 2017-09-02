@ECHO off & setlocal enableextensions enabledelayedexpansion

:: Note: use lowercase names for the Docker images
SET DOCKER_IMAGE="azureiotpcs/pcs-remote-monitoring-webui"

:: strlen("\scripts\docker\") => 16
SET APP_HOME=%~dp0
SET APP_HOME=%APP_HOME:~0,-16%

:: The version is stored in a file, to avoid hardcoding it in multiple places
set /P APP_VERSION=<%APP_HOME%/version

echo Starting Remote Monitoring Web UI ...
docker run -it -p 10080:80 -p 10443:443 %DOCKER_IMAGE%:%APP_VERSION%

endlocal
