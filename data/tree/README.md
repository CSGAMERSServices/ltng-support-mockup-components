# Overview

Tree / Data extracts for use in creating sample records using the [Salesforce CLI](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/cli_reference_force_data.htm)

## Example Load

If an extract was created through a command like:

	// -q: /path/to/query/file
	// -d: /path/to/tree extracts
	sfdx force:data:tree:export -q data/queries/AccountsWithContacts.txt -d data/tree/
	
Then that data can be loaded via the Salesforce CLI:

	// -f: [or -p required]: path to .json data to load
	// -p: [or -f required]: path to .plan data to load
	sfdx force:data:tree:import -f data/tree/Account-Contact.json

