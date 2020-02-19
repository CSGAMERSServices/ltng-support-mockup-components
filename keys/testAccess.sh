. exportConfig.sh

# export CONSUMER_KEY=
# export CONSUMER_SECRET=
# export USER_NAME=

echo sfdx force:auth:jwt:grant --clientid "${CONSUMER_KEY}" --jwtkeyfile ./server.key --username "${USER_NAME}"
sfdx force:auth:jwt:grant --clientid "${CONSUMER_KEY}" --jwtkeyfile ./server.key --username "${USER_NAME}"

