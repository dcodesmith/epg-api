#!/usr/bin/env sh
set -x

# TODO
# Perhaps set node version via nvm first. Match node versions on every environment
# Rollback strategy to any given commit. Perhaps by commit number

export NVM_DIR=$HOME/.nvm
[ -s $NVM_DIR/nvm.sh ] && . $NVM_DIR/nvm.sh

echo 'Installing node ....'
nvm install 8

nvm use 8

export NVM_BIN=$HOME/.nvm/versions/node/v8.11.1/bin

echo 'changing directory to /srv/www/node/app ...'
cd /srv/www/node/app && \
echo 'unziping package.tgz into current directory ...'
tar zxvf package.tgz -C . && \
echo 'copying contents of build directory into current directory ...'
cp -rf build/* . && \
echo 'removing package.tgz build from current directory ...'
rm -rf package.tgz build && \
echo 'copying contents of dist directory into current directory ...'
cp -rf app.yml dist/* . && \
echo 'removing test directory from current directory ...'
rm -rf test && \
echo 'removing dist directory from current directory ...'
rm -rf dist && \

echo 'Set production env variables ...'
export env $(cat config/.production.env)

echo 'Check node environment ...'
echo $NODE_ENV

$NVM_BIN/npm install
