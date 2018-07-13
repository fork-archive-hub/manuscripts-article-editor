#!/usr/bin/env bash

yarn install --frozen-lockfile --non-interactive
docker volume create --name=yarn-cache
docker-compose -f docker/tests/testcafe/docker-compose.yml down -v
source "${BASH_SOURCE%/*}/scripts/git-env.sh"
mkdir -p screenshots
yarn run docker-compose:testcafe pull # below step won't update images.
SCREENSHOTS_VOLUME=${PWD}/screenshots yarn run docker-compose:testcafe up --build --abort-on-container-exit
