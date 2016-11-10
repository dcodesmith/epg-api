#!/usr/bin/env sh
set -x

openssl aes-256-cbc -K $encrypted_3471f576b911_key -iv $encrypted_3471f576b911_iv -in deploy-key.enc -out deploy-key -d
chmod 600 deploy-key
mv deploy-key ~/.ssh/id_rsa
