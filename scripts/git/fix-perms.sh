#!/usr/bin/env bash -e

# Sometimes when creating bash scripts in Windows, bash scripts will not have
# the +x flag carried over to Linux/MacOS. This script should help setting the
# permission flags right.

APP_HOME="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd .. && cd .. && pwd )/"
cd $APP_HOME

set +e

chmod ugo+x ./scripts/build               2> /dev/null
chmod ugo+x ./scripts/docker/build        2> /dev/null
chmod ugo+x ./scripts/docker/run          2> /dev/null
chmod ugo+x ./scripts/docker/publish      2> /dev/null
chmod ugo+x ./scripts/docker/content/*.sh 2> /dev/null
chmod ugo+x ./scripts/git/setup           2> /dev/null
chmod ugo+x ./scripts/git/*.sh            2> /dev/null

if [ -d ./scripts/iothub ]; then
  chmod ugo+x ./scripts/iothub/*.sh       2> /dev/null
fi

git update-index --chmod=+x ./scripts/build
git update-index --chmod=+x ./scripts/docker/build
git update-index --chmod=+x ./scripts/docker/run
git update-index --chmod=+x ./scripts/docker/publish
git update-index --chmod=+x ./scripts/docker/content/*.sh
git update-index --chmod=+x ./scripts/git/setup
git update-index --chmod=+x ./scripts/git/*.sh

if [ -d ./scripts/iothub ]; then
  git update-index --chmod=+x ./scripts/iothub/*.sh
fi
