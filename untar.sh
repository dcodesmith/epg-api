#!/usr/bin/env sh
set -x

# TODO
# Perhaps set node version via nvm first. Match node versions on every environment
# Rollback strategy to any given commit. Perhaps by commit number


export NVM_DIR=$HOME/.nvm
[ -s $NVM_DIR/nvm.sh ] && . $NVM_DIR/nvm.sh

nvm install 6
nvm use 6.9.1

export NODE_ENV=production
export NVM_BIN=$HOME/.nvm/versions/node/v6.9.1/bin

# Check node environment
echo $NODE_ENV

cd /srv/www/node/app && \
tar zxvf package.tgz -C . && \
cp -rf build/* . && \
rm -rf build && \
rm package.tgz && \

# Set production env variables
export env $(cat config/.production.env)

$NVM_BIN/npm i
