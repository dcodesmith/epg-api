#!/bin/bash
set -e

rm -rf coverage

# Generate test coverage based on however `npm test` performs the tests.
# nyc --reporter=json npm test

env $(cat config/.test.env) ./node_modules/.bin/nyc --reporter=json --require babel-core/register ./node_modules/.bin/mocha --recursive test

mv coverage/coverage-final.json coverage/coverage.json

./node_modules/.bin/remap-istanbul -i coverage/coverage.json -o coverage/coverage.json

./node_modules/.bin/istanbul report lcov text
