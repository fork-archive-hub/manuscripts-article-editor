yarn install --frozen-lockfile --non-interactive
docker-compose -f docker/tests/testcafe/docker-compose.yml down -v
mkdir -p screenshots
yarn run docker-compose:testcafe pull # below step won't update images.
SCREENSHOTS_VOLUME=${PWD}/screenshots yarn run docker-compose:testcafe up --build --abort-on-container-exit