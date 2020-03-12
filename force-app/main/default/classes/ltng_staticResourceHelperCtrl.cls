/**
 * Apex controller for the Static Resource Helper component
 */
public with sharing class ltng_staticResourceHelperCtrl {

    public static final Integer MAX_RESOURCES = 100;
    
    /**
     * Determines the static resources that match the name of the search criteria provided.
     * (if the search string is empty, it will return at most 10 of the most recent static resources modified)
     * @param (String) searchString
     * @return StaticResource[]
     */
    @AuraEnabled(cacheable=true)
    public static StaticResource[] findStaticResources( String searchStr ){
        StaticResource[] results = new StaticResource[]{};
        String cleanedSearchStr = '%'
            + (String.isEmpty(searchStr)?'':searchStr)
            + '%';

        if (String.isEmpty(searchStr)) {
            results = [
                SELECT Id, Name, LastModifiedDate
                FROM StaticResource
                ORDER by LastModifiedDate desc
                limit :MAX_RESOURCES
            ];
        } else {
            results = [
                SELECT Id, Name, LastModifiedDate
                FROM StaticResource
                WHERE name like :cleanedSearchStr
                ORDER by LastModifiedDate desc
                limit :MAX_RESOURCES
            ];
        }

        return results;
    }
}
