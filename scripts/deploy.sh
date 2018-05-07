#!/usr/bin/env sh
set -x

mkdir build && \
cp -rf dist config package.json build && \
tar -czf package.tgz build && \
scp package.tgz $REMOTE_USER@$REMOTE_HOST:$REMOTE_APP_DIR && \
ssh $REMOTE_USER@$REMOTE_HOST 'bash -s' < ./untar.sh
