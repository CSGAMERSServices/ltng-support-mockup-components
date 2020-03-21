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
private class ltng_MockupControllerTest {

    //-- resource expected
    static final String RESOURCE_NAME = 'ltng_ExamplePlaceholderImage';

    //-- test test methods here
    @isTest static void testSpecificResource() {
        String resourceURL = ltng_MockupController.getResource(RESOURCE_NAME);
        
        System.assert(!String.isEmpty(resourceURL), 'The URL we get should not be empty');
        //-- we don't want to get more in depth because the URL format may change
    }

    @isTest static void resourceAvailableForSingleURL() {
        String resourceURL = ltng_MockupController.determineResourceURLs(RESOURCE_NAME);

        System.assert(!String.isEmpty(resourceURL), 'The URL we get should not be empty');
        //-- we don't want to get more in depth because the URL format may change
    }

    @isTest static void urlsForMultipleResources() {
        String[] resources = new String[]{
            RESOURCE_NAME,
            RESOURCE_NAME,
            RESOURCE_NAME
        };
        Map<String,String> resourceMap = ltng_MockupController.determineResourceURLs(resources);
        String[] resourceURLs = resourceMap.values();

        for (String resourceProvided : resources) {
            System.assert(resourceMap.containsKey(resourceProvided));
        }

        System.assert(resourceURLs != null);
        
        //-- do not use this assumption for now as we only have one resource
        //System.assertEquals(resources.size(), resourceURLs.size());
        
        for (String resourceURL : resourceURLs) {
            System.assert(!String.isEmpty(resourceURL));
            //-- we don't want to get more in depth because the URL format may change
        }
    }

    @isTest static void mockupSettingsAreReceived() {
        insert new ltng_mockupSettings__c(
            Enable_Mock_Image_Caching__c = true
        );

        ltng_mockupSettings__c results = ltng_MockupController.getSettings();
        System.assert(results != null, 'settings should be found');
        System.assertEquals(results.Enable_Mock_Image_Caching__c, true, 'caching should be identical to that provided');
    }

    @isTest static void defaultResourceOptionIsManualSelection() {
        String manualSelectionLabel = ltng_MockupController.RESOURCE_NAME_NOT_CHOSEN;
        String manualSelectionValue = ltng_MockupController.RESOURCE_NAME_NOT_CHOSEN;

        ltng_MockupController ctrl = new ltng_MockupController();

        VisualEditor.DataRow row = ctrl.getDefaultValue();
        
        System.assert(row != null, 'we should get a default row');
        System.assert(manualSelectionLabel.equals(row.getLabel()), 'manual selection should be the default option label');
        System.assert(manualSelectionValue.equals(row.getValue()), 'manual selection should be the default option label');
    }

    @isTest static void staticResourceNamesAreReturned() {
        String manualSelectionLabel = ltng_MockupController.RESOURCE_NAME_NOT_CHOSEN;
        String manualSelectionValue = ltng_MockupController.RESOURCE_NAME_NOT_CHOSEN;

        ltng_MockupController ctrl = new ltng_MockupController();

        VisualEditor.DynamicPickListRows rows = ctrl.getValues();

        System.assert(rows.size() > 0, 'there should be at least the default row');

        VisualEditor.DataRow row = rows.get(0);

        System.assert(row != null, 'we should get a default row');
        System.assert(manualSelectionLabel.equals(row.getLabel()), 'manual selection should be the default option label');
        System.assert(manualSelectionValue.equals(row.getValue()), 'manual selection should be the default option label');
    }

    @isTest static void filteredStaticResourcesAreReturned() {
        insert new ltng_mockupSettings__c(
            Enable_Mock_Image_Caching__c = true,
            Mock_Image_File_Filter__c = 'Comp'
        );
        //-- assumes we have ltng_example, ltng_ExampleComponent, ltng_ExamplePlaceholderImage

        ltng_MockupController ctrl = new ltng_MockupController();

        VisualEditor.DynamicPickListRows rows = ctrl.getValues();

        // System.debug(rows);

        System.assert(rows.size() == 2, 'there should be one resource returned:' + rows.size());

        VisualEditor.DataRow row = rows.get(0);

        System.assert(row != null);
        System.assert((ltng_MockupController.RESOURCE_NAME_NOT_CHOSEN).equals(row.getLabel()));

        row = rows.get(1);

        System.assert(row != null);
        System.assert(('ltng_ExampleComponent').equals(row.getLabel()));
    }
}
