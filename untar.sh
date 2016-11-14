#!/usr/bin/env sh
set -x

# TODO
# Perhaps set node version via nvm first. Match node versions on every environment
# Rollback strategy to any given commit. Perhaps by commit number

nvm install 6

export NODE_ENV=production
export NVM_BIN=$HOME/.nvm/versions/node/v5.10.1/bin

cd /srv/www/node/app && \
tar zxvf package.tgz -C . && \
cp -rf build/* . && \
rm -rf build && \
"$NVM_BIN/npm" i
