# Overview

List of queries to be used when extracting data from Salesforce.

This allows them to be version controlled
and can then be directly used via the Salesforce API via [Data Commands](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/cli_reference_force_data.htm)
or indirectly used by copying and pasting.

## Example /data/queries/AllAccounts.txt

	SELECT Id, Name, (SELECT Id, Name from Contacts) FROM Accounts

## Can be used by Tree Export as

	// -q: /path/to/query/file
	// -d: /path/to/tree extracts
	sfdx force:data:tree:export -q data/queries/AccountsWithContacts.txt -d data/tree/

Or using file content substituion on *nix shells <br />
(An equivalent is not known for Windows unfortunately)

	// -q: the query to call
	// $(cat /path/to/file) - use contents of file
	sfdx force:data:soql:query -q "$(< data/queries/AccountsWithContacts.txt )"
	