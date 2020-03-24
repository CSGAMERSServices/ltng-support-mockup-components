/**
 * Controller for the Mockup Components
 * (now working with files)
 **/
global with sharing class ltng_mockupFileCtrl extends VisualEditor.DynamicPicklist {
	/** format of a static resource url **/
    public static final String CONTENT_URL_FORMAT = '/sfc/servlet.shepherd/version/download/{0}';
    
    /** Label for the NO CHOICE MADE on resource selection */
    public static final String NO_FILES_FOUND = '-- No Files Found --';

    /** Max number of Files to return with a given search */
    public static final Integer MAX_RESULTS = 100;

    //-- settings methods

    /**
     * Determines the settings for the Mock components.
     * @return ltng_mockupSettings__c
     */
    @AuraEnabled(cacheable=true)
    public static ltng_mockupSettings__c getSettings(){
        ltng_mockupSettings__c results = ltng_mockupSettings__c.getOrgDefaults();
        return results;
    }

    //-- image picklist options
    global override VisualEditor.DataRow getDefaultValue() {
        VisualEditor.DynamicPickListRows allValues = getValues();
        VisualEditor.DataRow row = new VisualEditor.DataRow(
            NO_FILES_FOUND,
            null
        );

        if (allValues.size() > 0) {
            row = allValues.getDataRows()[0];
        }

        return row;
    }

    /**
     * Lists all the files as options
     */
    global override VisualEditor.DynamicPickListRows getValues() {
        VisualEditor.DataRow row;
        VisualEditor.DynamicPickListRows myValues = new VisualEditor.DynamicPickListRows();

        ltng_mockupSettings__c mockupSettings = ltng_mockupSettings__c.getOrgDefaults();
        String selectionFilter = null;

        if (mockupSettings != null && !String.isEmpty(mockupSettings.Mock_Image_File_Filter__c)) {
            selectionFilter = '%' + mockupSettings.Mock_Image_File_Filter__c + '%';
            //-- avoiding dynamic soql to better loop across values
            //-- seems to not be any better security wise though
            for (ContentDocument fileContent : [
                SELECT Id, Title, LatestPublishedVersionId
                FROM ContentDocument
                WHERE Title like :selectionFilter
                ORDER BY LastModifiedDate desc
            ]){
                row = new VisualEditor.DataRow(fileContent.Title, String.valueOf(fileContent.Id));
                myValues.addRow(row);
            }
        } else {
            for (ContentDocument fileContent : [
                SELECT Id, Title, LatestPublishedVersionId
                FROM ContentDocument
                ORDER BY LastModifiedDate desc
            ]){
                row = new VisualEditor.DataRow(fileContent.Title, String.valueOf(fileContent.Id));
                myValues.addRow(row);
            }
        }

        return myValues;
    }

    //-- finds static resources with a specific search criteria

    /**
     * Finds files that match the name of the search criteria provided.
     * (if the search string is empty, it will return at most 10 of the most recent static resources modified)
     * @param (String) searchString
     * @return ContentDocument[]
     */
    @AuraEnabled(cacheable=true)
    public static ContentDocument[] findFiles( String searchStr ){
        ContentDocument[] results = new ContentDocument[]{};
        String[] whereClauses = new String[]{};
        
        ltng_mockupSettings__c settings = ltng_mockupSettings__c.getOrgDefaults();
        Integer maxSearchResults = Integer.valueOf(settings.Max_Search_Results__c);
        if (maxSearchResults == null) {
            maxSearchResults = MAX_RESULTS;
        }
        
        String cleanedSearchStr = null;
        if (!String.isEmpty(searchStr)) {
            cleanedSearchStr = '%'
                + String.escapeSingleQuotes(searchStr)
                + '%';
            whereClauses.add('Title like :cleanedSearchStr');
        }

        String searchFilter = null;
        if (!String.isEmpty(settings.Mock_Image_File_Filter__c)) {
            searchFilter = '%' +
                String.escapeSingleQuotes(settings.Mock_Image_File_Filter__c)
                + '%';
            whereClauses.add('Title like :searchFilter');
        }

        String query = 'SELECT Id, Title, LatestPublishedVersionId, LastModifiedDate FROM ContentDocument ';
        if (whereClauses.size() > 0 ) {
            query += 'WHERE ' + String.join(whereClauses, ' AND ') + ' ';
        }
        query += 'ORDER BY LastModifiedDate desc limit :maxSearchResults';

        System.debug('query' + query);

        results = Database.query(query);

        return results;
    }

    //-- image methods

    /**
     * Determines the URL for the latest contentVersion of a content
     * @param contentId (Id) - Id of the content we want
     * @param cacheBuster (String) - optional cache busting technique for conditional caching.
     * @return FileAddress - url for that content
     */
    @AuraEnabled(cacheable=true)
    public static FileAddressInfo determineFileContentURL(Id contentId, String cacheBuster) {
        FileAddressInfo result = new FileAddressInfo();
        
        try {
            ContentDocument content = [
                SELECT Id, Title, LatestPublishedVersionId
                FROM ContentDocument
                WHERE id = :contentId
            ];

            result.ContentDocumentId = content.Id;
            result.ContentVersionId = content.LatestPublishedVersionId;
            result.Title = content.Title;
            result.Address = String.format(
                CONTENT_URL_FORMAT,
                new String[]{
                    content.LatestPublishedVersionId
                }
            );
        } catch(Exception err) {}

        return result;
    }

    public class FileAddressInfo {
        @AuraEnabled public Id ContentDocumentId;
        @AuraEnabled public Id ContentVersionId;
        @AuraEnabled public String Address;
        @AuraEnabled public String Title;
    }

    //-- file modification methods

    /**
     * Creates a new file version
     * @param documentId (Id) - id of the document (or null if new)
     * @param title (String) - title of the document
     * @param fileName (String) - name of the file (with extension)
     * @param body (String) - base64 encoded content
     * @return {ContentVersion}
     */
    @AuraEnabled(cacheable=false)
    public static ContentVersion createContentVersion(
        Id documentId, String title, String fileName, String body
    ) {
        String searchPrefix = '';
        ltng_mockupSettings__c settings = ltng_mockupSettings__c.getOrgDefaults();
        if (!String.isEmpty(settings.Mock_Image_File_Filter__c)) {
            searchPrefix = settings.Mock_Image_File_Filter__c;
        }

        ContentVersion result = new ContentVersion(
            ContentLocation = 'S',
            Title = title,
            PathOnClient = fileName,
            VersionData = EncodingUtil.base64Decode(body)
        );

        if (documentId != null) {
            result.ContentDocumentId = documentId;
        } else {
            result.Title = searchPrefix + result.Title;
        }

        insert result;

        return result;
    }
}