#!/usr/bin/env sh
set -x

export PROD_ENV_FILE=config/.production.env

echo "DATABASEPASSWORD=$DATABASEPASSWORD" >> $PROD_ENV_FILE
echo "LOGGLYTOKEN=$LOGGLYTOKEN" >> $PROD_ENV_FILE

mkdir build && \

cat config/.production.env

cp -rf dist app.yml config package.json build && \

tar -czf package.tgz build && \

scp package.tgz $REMOTE_USER@$REMOTE_HOST:$REMOTE_APP_DIR && \

ssh $REMOTE_USER@$REMOTE_HOST 'bash -s' < ./untar.sh
