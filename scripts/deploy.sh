#!/usr/bin/env sh
set -x

mkdir build && \

cat "$DATABASEPASSWORD" >> config/.production.env
cat "$LOGGLYTOKEN" >> config/.production.env

cat config/.production.env

cp -rf dist app.yml config package.json build && \

tar -czf package.tgz build && \

scp package.tgz $REMOTE_USER@$REMOTE_HOST:$REMOTE_APP_DIR && \

ssh $REMOTE_USER@$REMOTE_HOST 'bash -s' < ./untar.sh
