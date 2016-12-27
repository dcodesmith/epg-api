#!/usr/bin/env sh
set -x

mkdir build && \
cp -rf dist config util index.js package.json build && \
tar -czf package.tgz build && \
rm -rf utils index.js && \
cp -rf dist/* . && rm -rf dist && \
scp package.tgz $REMOTE_USER@$REMOTE_HOST:$REMOTE_APP_DIR && \
ssh $REMOTE_USER@$REMOTE_HOST 'bash -s' < ./untar.sh
