echo "now checking org at: `date`"

. ci/refreshConfig.sh

listName="refreshItems${1}"
list="${!listName}"

echo "fetching list:${listName}"
echo "${list}"

sfdx force:source:retrieve -m "${list}"
