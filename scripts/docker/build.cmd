@ECHO off
setlocal

:: Note: use lowercase names for the Docker images
SET DOCKER_IMAGE="azureiotpcs/pcs-remote-monitoring-webui"

:: Debug|Release
SET CONFIGURATION=Release

:: strlen("\scripts\docker\") => 16
SET APP_HOME=%~dp0
SET APP_HOME=%APP_HOME:~0,-16%
cd %APP_HOME%

:: The version is stored in a file, to avoid hardcoding it in multiple places
set /P APP_VERSION=<%APP_HOME%/version

:: Check dependencies
docker version > NUL 2>&1
IF %ERRORLEVEL% NEQ 0 GOTO MISSING_DOCKER

:: Build the container image
rmdir /s /q out\docker

mkdir out/docker/src
mkdir out/docker/build

xcopy /s src\*       out\docker\src\
xcopy /s public\*    out\docker\public\
copy package.json    out\docker\

copy scripts\docker\.dockerignore               out\docker\
copy scripts\docker\Dockerfile                  out\docker\
copy scripts\docker\run.sh                      out\docker\
copy scripts\docker\nginx.conf                  out\docker\

cd out\docker\
docker build --tag %DOCKER_IMAGE%:%APP_VERSION% --squash --compress --label "Tags=azure,iot,pcs,webui,react" .
IF %ERRORLEVEL% NEQ 0 GOTO FAIL

:: - - - - - - - - - - - - - -
goto :END

:MISSING_DOCKER
    echo ERROR: 'docker' command not found.
    echo Install Docker and make sure the 'docker' command is in the PATH.
    echo Docker installation: https://www.docker.com/community-edition#/download
    exit /B 1

:FAIL
    echo Command failed
    endlocal
    exit /B 1

:END
endlocal
