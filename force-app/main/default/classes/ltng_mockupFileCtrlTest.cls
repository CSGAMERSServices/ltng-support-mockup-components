/**
 * This class contains unit tests for validating the behavior of Apex classes
 * and triggers.
 *
 * Unit tests are class methods that verify whether a particular piece
 * of code is working properly. Unit test methods take no arguments,
 * commit no data to the database, and are flagged with the testMethod
 * keyword in the method definition.
 *
 * All test methods in an organization are executed whenever Apex code is deployed
 * to a production organization to confirm correctness, ensure code
 * coverage, and prevent regressions. All Apex classes are
 * required to have at least 75% code coverage in order to be deployed
 * to a production organization. In addition, all triggers must have some code coverage.
 * 
 * The @isTest class annotation indicates this class only contains test
 * methods. Classes defined with the @isTest annotation do not count against
 * the organization size limit for all Apex scripts.
 *
 * See the Apex Language Reference for more information about Testing and Code Coverage.
 */
@isTest
private class ltng_mockupFileCtrlTest {
    
    class TestSettings {

        final String lightb64='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PHhtcDpDcmVhdG9yVG9vbD5QaXhlbG1hdG9yIDMuOTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MjwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlVzZXJDb21tZW50PgogICAgICAgICAgICA8cmRmOkFsdD4KICAgICAgICAgICAgICAgPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5TY3JlZW5zaG90PC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOkFsdD4KICAgICAgICAgPC9leGlmOlVzZXJDb21tZW50PgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+MjwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+MTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8dGlmZjpDb21wcmVzc2lvbj41PC90aWZmOkNvbXByZXNzaW9uPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj43MjwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+NzI8L3RpZmY6WVJlc29sdXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgrrP/2QAAAAFklEQVQIHWP++vWruZkZw507dzjY2QE1eQYwT8Oj+gAAAABJRU5ErkJggg==';
        final String darkb64='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PHhtcDpDcmVhdG9yVG9vbD5QaXhlbG1hdG9yIDMuOTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MjwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlVzZXJDb21tZW50PgogICAgICAgICAgICA8cmRmOkFsdD4KICAgICAgICAgICAgICAgPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5TY3JlZW5zaG90PC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOkFsdD4KICAgICAgICAgPC9leGlmOlVzZXJDb21tZW50PgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+MjwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+MTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8dGlmZjpDb21wcmVzc2lvbj4wPC90aWZmOkNvbXByZXNzaW9uPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj43MjwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+NzI8L3RpZmY6WVJlc29sdXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgqBFlvyAAAAFklEQVQIHWMUFhYuKSlhcHR0/P//PwAYzQVX07v7fwAAAABJRU5ErkJggg==';

        //-- instance values
        ContentVersion[] contentVersions;

        ContentDocument[] contentDocuments;

        ltng_mockupSettings__c settings;

        ltng_mockupFileCtrl ctrl;
        
        public TestSettings(){
            //-- global setup here
            
        }
        
        public TestSettings setupDefault(){
            //-- specific setup here
            return this;
        }

        public TestSettings setupFiles() {
            Blob lightBlob = EncodingUtil.base64Decode(this.lightb64);
            Blob darkBlob = EncodingUtil.base64Decode(this.darkb64);

            this.contentVersions = new ContentVersion[]{
                new ContentVersion(
                    ContentLocation = 'S',
                    Title='LightB64',
                    PathOnClient='LightB64.png',
                    VersionData=lightBlob
                ),
                new ContentVersion(
                    ContentLocation = 'S',
                    Title='DarkB64',
                    PathOnClient='DarkB64.png',
                    VersionData=darkBlob
                ),
                new ContentVersion(
                    ContentLocation = 'S',
                    Title='DarkB64_pt2',
                    PathOnClient='DarkB64_pt2.png',
                    VersionData=darkBlob
                )
            };

            insert this.contentVersions;

            return this;
        }

        public TestSettings refreshDocuments() {
            this.contentDocuments = [
                SELECT Id, Title, LatestPublishedVersionId
                FROM ContentDocument
                ORDER BY LastModifiedDate desc
            ];

            return this;
        }

        public TestSettings setupSettings() {
            return setupSettings(null, null);
        }

        public TestSettings setupSettings(String imageFilter) {
            return setupSettings(imageFilter, null);
        }

        public TestSettings setupSettings(String imageFilter, String rowLimit) {
            this.settings = new ltng_mockupSettings__c (
                Enable_Mock_Image_Caching__c = true
            );

            if (!String.isEmpty(imageFilter)) {
                this.settings.Mock_Image_File_Filter__c = imageFilter;
            } else {
                this.settings.Mock_Image_File_Filter__c = null;
            }

            if (!String.isEmpty(rowLimit)) {
                Decimal rowLimitVal = Decimal.valueOf(rowLimit);
                this.settings.Max_Search_Results__c = rowLimitVal;
            }

            insert this.settings;

            return this;
        }
        
        public TestSettings finalize(){
            this.ctrl = new ltng_mockupFileCtrl();
            return this;
        }
    }

    //-- test test methods here
    @isTest static void runSetupDefaultWithoutException() {
        TestSettings ts;
        try {
            ts = new TestSettings()
                .setupDefault()
                .setupFiles()
                .finalize();
        } catch( Exception err ){
            System.assert( false, 'Exception must not be thrown:' + err.getMessage() );
        }

        System.debug(ts.ctrl != null);
    }

    @isTest static void setupFilesCreatesFiles() {
        TestSettings ts = new TestSettings()
            .setupDefault()
            .setupFiles()
            .finalize();
        
        System.assert(ts.contentVersions != null);
        System.assert(ts.contentVersions.size() == 3);
        System.assert(ts.contentVersions[0].Id != null);
        System.assert(ts.contentVersions[1].Id != null);
        System.assert(ts.contentVersions[2].Id != null);
    }

    @isTest static void setupSettingsHasSettings() {
        TestSettings ts = new TestSettings()
            .setupDefault()
            .setupSettings()
            .finalize();
        
        System.assert(ts.settings != null);
        System.assert(ts.settings.Id != null);
    }

    @isTest static void setupSettingsWithFilter() {
        TestSettings ts = new TestSettings()
            .setupDefault()
            .setupSettings('ltng_')
            .finalize();
        
        System.assert(ts.settings != null);
        System.assert(ts.settings.Id != null);
        System.assertEquals('ltng_', ts.settings.Mock_Image_File_Filter__c);
    }
    
    //-- test functionality here

    @isTest static void testGetValuesWithNoFiles() {
        TestSettings ts = new TestSettings()
            .setupDefault()
            .setupSettings('ltng_')
            .finalize();
        
        System.assert(ts.contentVersions == null);
        
        //-- expect that an exception is not thrown
        try {
            VisualEditor.DynamicPickListRows dplr = ts.ctrl.getValues();
            System.assert(true, 'exception should not be thrown');
        } catch( Exception err ){
            System.assert(false, 'exception should not be thrown');
        }
    }

    @isTest static void testGetValuesWorksIfThereAreFiles() {
        TestSettings ts = new TestSettings()
            .setupDefault()
            .setupSettings()
            .setupFiles()
            .refreshDocuments()
            .finalize();

        System.assert(ts.contentVersions.size() == 3);
        System.assert(ts.settings.Mock_Image_File_Filter__c == null);
        
        VisualEditor.DynamicPickListRows dplr = ts.ctrl.getValues();

        System.assert(dplr.size() == 3, 'there should be 3 rows if there is no filter and three files');

        VisualEditor.DataRow row;
        // row = dplr.get(0);
        // System.debug(row);
        // row = dplr.get(1);
        // System.debug(row);
        // System.debug('--- END ---');

        ContentVersion cv;
        ContentDocument cd;
        Map<Id,ContentDocument> contentDocumentMap = new Map<Id,ContentDocument>();
        for (ContentDocument allDoc : ts.contentDocuments){
            contentDocumentMap.put(allDoc.Id, allDoc);
        }

        Map<Id, VisualEditor.DataRow> rowMap = new Map<Id, VisualEditor.DataRow>();
        Id cvId;
        String val;
        for (Integer i = 0; i < dplr.size(); i++) {
            row = dplr.get(i);
            cvId = (Id)row.getValue();
            rowMap.put(cvId, row);

            System.assert(contentDocumentMap.containsKey(cvId),
                'looking for:' + cvId + ', within: ' + contentDocumentMap.keySet()
            );
            cd = contentDocumentMap.get(cvId);

            System.assert(cd != null);
            System.assert(row != null);

            System.assertEquals(cd.Title, row.getLabel());
        }
    }

    @isTest static void getOptionsIfDarkFilterIsApplied() {
        TestSettings ts = new TestSettings()
            .setupDefault()
            .setupSettings('Light')
            .setupFiles()
            .refreshDocuments()
            .finalize();

        System.assert(ts.contentVersions.size() >= 1);
        System.assert(('Light').equals(ts.settings.Mock_Image_File_Filter__c));
        
        VisualEditor.DynamicPickListRows dplr = ts.ctrl.getValues();

        System.assert(dplr.size() == 1, 'there should be 1 rows if there is only one file with light in the name');

        VisualEditor.DataRow row;
        // row = dplr.get(0);
        // System.debug(row);
        // row = dplr.get(1);
        // System.debug(row);
        // System.debug('--- END ---');

        ContentVersion cv;
        ContentDocument cd;
        Map<Id,ContentDocument> contentDocumentMap = new Map<Id,ContentDocument>();
        for (ContentDocument allDoc : ts.contentDocuments){
            contentDocumentMap.put(allDoc.Id, allDoc);
        }

        Map<Id, VisualEditor.DataRow> rowMap = new Map<Id, VisualEditor.DataRow>();
        Id cvId;
        String val;
        for (Integer i = 0; i < dplr.size(); i++) {
            row = dplr.get(i);
            cvId = (Id)row.getValue();
            rowMap.put(cvId, row);

            System.assert(contentDocumentMap.containsKey(cvId),
                'looking for:' + cvId + ', within: ' + contentDocumentMap.keySet()
            );
            cd = contentDocumentMap.get(cvId);

            System.assertEquals(cd.Title, row.getLabel());
        }
    }

    @isTest static void testGetDefaultValueIfNoOptions() {
        TestSettings ts = new TestSettings()
            .setupDefault()
            .finalize();
        
        System.assert(ts.contentVersions == null);

        VisualEditor.DynamicPickListRows dplr = ts.ctrl.getValues();
        System.assert(dplr.size() == 0);

        VisualEditor.DataRow row = ts.ctrl.getDefaultValue();

        System.assert(row != null);
        System.assertEquals(ltng_mockupFileCtrl.NO_FILES_FOUND, row.getLabel());
    }

    @isTest static void testGetSettings() {
        TestSettings ts = new TestSettings()
            .setupDefault()
            .setupSettings('ltng')
            .finalize();

        ltng_mockupSettings__c results = ltng_mockupFileCtrl.getSettings();

        System.assert(results != null);
        System.assertEquals(ts.settings.Mock_Image_File_Filter__c, results.Mock_Image_File_Filter__c);
    }

    @isTest static void testGetDefaultValueIfOptionsPresent() {
        TestSettings ts = new TestSettings()
            .setupDefault()
            .setupFiles()
            .finalize();
        
        System.assert(ts.contentVersions.size() > 0);

        VisualEditor.DynamicPickListRows dplr = ts.ctrl.getValues();
        System.assert(dplr.size() > 0);

        VisualEditor.DataRow row = ts.ctrl.getDefaultValue();
        VisualEditor.DataRow firstRow = dplr.get(0);

        System.assert(row != null);
        System.assertEquals(firstRow.getLabel(), row.getLabel());
    }

    @isTest static void testFileContentURL() {
        TestSettings ts = new TestSettings()
            .setupDefault()
            .setupFiles()
            .refreshDocuments()
            .setupSettings()
            .finalize();

        ContentDocument cd = ts.contentDocuments[0];
        System.assert(cd.LatestPublishedVersionId != null);

        ltng_mockupFileCtrl.FileAddressInfo expected = new ltng_mockupFileCtrl.FileAddressInfo();
        expected.ContentDocumentId = cd.Id;
        expected.ContentVersionId = cd.LatestPublishedVersionId;
        expected.Address = String.format(
            ltng_mockupFileCtrl.CONTENT_URL_FORMAT,
            new String[]{
                cd.LatestPublishedVersionId
            }
        );
        expected.Title = cd.Title;

        ltng_mockupFileCtrl.FileAddressInfo results = ltng_mockupFileCtrl.determineFileContentURL(
            cd.Id, ''
        );

        System.assertEquals(expected.ContentDocumentId, results.ContentDocumentId);
        System.assertEquals(expected.ContentVersionId, results.ContentVersionId);
        System.assertEquals(expected.Address, results.Address);
        System.assertEquals(expected.Title, results.Title);
    }

    @isTest static void findFilesReturnsLatestIfNoFilterNoSearch() {
        TestSettings ts = new TestSettings()
            .setupDefault()
            .setupSettings()
            .setupFiles()
            .refreshDocuments()
            .finalize();

        ContentDocument[] filesFound = ltng_mockupFileCtrl.findFiles(null);

        System.assert(filesFound != null);
        System.assertEquals(3, filesFound.size());
    }

    @isTest static void findFilesReturnsFilter() {
        TestSettings ts = new TestSettings()
            .setupDefault()
            .setupSettings()
            .setupFiles()
            .refreshDocuments()
            .finalize();

        ContentDocument[] filesFound = ltng_mockupFileCtrl.findFiles('Dark');

        System.assert(filesFound != null);
        System.assertEquals(2, filesFound.size());
    }

    @isTest static void findFilesReturnsFilterForBoth() {
        TestSettings ts = new TestSettings()
            .setupDefault()
            .setupSettings('B64')
            .setupFiles()
            .refreshDocuments()
            .finalize();

        ContentDocument[] filesFound = ltng_mockupFileCtrl.findFiles(null);

        System.assert(filesFound != null);
        System.assertEquals(3, filesFound.size());
    }

    @isTest static void findFilesReturnsFilterForOne() {
        TestSettings ts = new TestSettings()
            .setupDefault()
            .setupSettings('Dark')
            .setupFiles()
            .refreshDocuments()
            .finalize();

        ContentDocument[] filesFound = ltng_mockupFileCtrl.findFiles(null);

        System.assert(filesFound != null);
        System.assertEquals(2, filesFound.size());
    }

    @isTest static void findFilesReturnsFilterAndSearch() {
        TestSettings ts = new TestSettings()
            .setupDefault()
            .setupSettings('Dark')
            .setupFiles()
            .refreshDocuments()
            .finalize();

        ContentDocument[] filesFound = ltng_mockupFileCtrl.findFiles('2');

        System.assert(filesFound != null);
        System.assertEquals(1, filesFound.size());
    }

    @isTest static void findIsRestrictedByMaxRows() {
        TestSettings ts = new TestSettings()
            .setupDefault()
            .setupSettings('Dark','1')
            .setupFiles()
            .refreshDocuments()
            .finalize();

        ContentDocument[] filesFound = ltng_mockupFileCtrl.findFiles(null);

        System.assert(filesFound != null);
        System.assertEquals(1, filesFound.size());
    }

    @isTest static void createFile() {
        TestSettings ts = new TestSettings()
            .setupDefault()
            .finalize();
        
        Id documentId = null;
        String title = 'Light_part2';
        String fileName = 'Light_part2.png';
        ContentVersion newVersion = ltng_mockupFileCtrl.createContentVersion(
            documentId,
            title,
            fileName,
            ts.lightb64
        );

        System.assert(newVersion != null);
        System.assert(newVersion.Id != null);
        System.assertEquals(title, newVersion.Title);
        System.assertEquals(fileName, newVersion.PathOnClient);
    }

    @isTest static void createFilePrefixedWithFilter() {
        TestSettings ts = new TestSettings()
            .setupDefault()
            .setupSettings('ltng')
            .finalize();
        
        Id documentId = null;
        String title = 'Light_part2';
        String fileName = 'Light_part2.png';
        ContentVersion newVersion = ltng_mockupFileCtrl.createContentVersion(
            documentId,
            title,
            fileName,
            ts.lightb64
        );

        System.assert(newVersion != null);
        System.assert(newVersion.Id != null);
        System.assertEquals('ltng' + title, newVersion.Title);
        System.assertEquals(fileName, newVersion.PathOnClient);
    }

    @isTest static void updateContentVersion() {
        TestSettings ts = new TestSettings()
            .setupDefault()
            .setupSettings('ltng')
            .setupFiles()
            .refreshDocuments()
            .finalize();
        
        ContentDocument cd = ts.contentDocuments[0];

        Id documentId = cd.Id;
        String title = 'Light_part2';
        String fileName = 'Light_part2.png';
        ContentVersion newVersion = ltng_mockupFileCtrl.createContentVersion(
            documentId,
            title,
            fileName,
            ts.lightb64
        );

        System.assert(newVersion != null);
        System.assert(newVersion.Id != null);
        System.assertEquals(fileName, newVersion.PathOnClient);
    }
}