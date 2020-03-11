#!/bin/bash

. refreshConfig.sh

echo "CreatedById='$AUTOMATION_SF_USER' IsRichText='true' ParentId='$AUTOMATION_SF_GROUP' Body='<p>Automated Metadata backup succeeded.</p>'"
sfdx force:data:record:create -s FeedItem -v "CreatedById='$AUTOMATION_SF_USER' IsRichText='true' ParentId='$AUTOMATION_SF_GROUP' Body='<p>Automated Metadata backup succeeded for the following:</p><p>${refreshItems}</p><p>Please see the sidebar for more</p>'"