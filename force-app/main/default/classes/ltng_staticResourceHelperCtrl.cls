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

    /**
     * Creates a Static Resource
     * @param (String) resourceName - Name of the resource to update (only used in create)
     * @param (String) body - Base64 encoded body of the resource
     * @return (StaticResource) - whether successful (true) or not (false)
     */
    @AuraEnabled(cacheable=false)
    public static StaticResource createStaticResource(String resourceName, String body) {
        Blob b = EncodingUtil.base64Decode(body);
        StaticResource result = new StaticResource(
            Name = resourceName,
            body = b
        );
        // insert result;
        return result;
    }

    /**
     * Updates a Static Resource
     * @param (Id) resourceId - id of the resource to update
     * @param (String) body - Base64 encoded body of the resource
     * @return (StaticResource) - whether successful (true) or not (false)
     */
    @AuraEnabled(cacheable=false)
    public static StaticResource updateResource(Id resourceId, String body) {
        Blob b = EncodingUtil.base64Decode(body);
        StaticResource result = new StaticResource(
            Id = resourceId,
            body = b
        );
        // update result;
        return result;
    }
}
