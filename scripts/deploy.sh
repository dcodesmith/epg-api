#!/usr/bin/env sh
set -x

chmod u+w config/.production.env
export PROD_ENV_FILE=config/.production.env
echo $PROD_ENV_FILE
[ -f config/.production.env ] && echo "File exist" || echo "File does not exist"

mkdir build && \
cat $DATABASEPASSWORD >> $PROD_ENV_FILE
cat $LOGGLYTOKEN >> $PROD_ENV_FILE

ls -al config

cat config/.production.env

cp -rf dist app.yml config package.json build && \

tar -czf package.tgz build && \

scp package.tgz $REMOTE_USER@$REMOTE_HOST:$REMOTE_APP_DIR && \

ssh $REMOTE_USER@$REMOTE_HOST 'bash -s' < ./untar.sh
