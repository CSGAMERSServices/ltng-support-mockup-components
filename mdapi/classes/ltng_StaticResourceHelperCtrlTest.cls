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
private class ltng_StaticResourceHelperCtrlTest {
    
    class TestSettings {
        
        //-- instance values
        
        public TestSettings(){
            //-- global setup here
        }
        
        public TestSettings setupDefault(){
            //-- specific setup here
            //-- there are no static resources we can generate here...
            return this;
        }
        
        public TestSettings finalize(){
            return this;
        }

        public Boolean isDateNewer(DateTime newerDate, DateTime olderDate) {
            return newerDate >= olderDate;
        }
    }

    //-- test test methods here
    @isTest static void runDefaultSetupWithoutException() {
        try {
            TestSettings ts = new TestSettings()
                .setupDefault()
                .finalize();
        } catch( Exception err ){
            System.assert( false, 'Exception must not be thrown:' + err.getMessage() );
        }
    }
    
    //-- test functionality here
    
    @isTest static void findingEmptyStaticResourceGivesRecent() {
        TestSettings ts = new TestSettings()
            .setupDefault()
            .finalize();

        StaticResource[] results = ltng_staticResourceHelperCtrl.findStaticResources('');
        
        //-- there should be at least one static resource.
        //-- and unfortunately we cannot generate from tests
        //-- so we are bound by the ones within the project.
        //-- we don't want to be explicit, since we may add more

        System.assert(results != null);
        System.assert(results.size() > 1);

        StaticResource resource1 = results[0];
        StaticResource resource2 = results[1];

        System.assert(
            ts.isDateNewer(
                resource1.LastModifiedDate,
                resource2.LastModifiedDate
            ), 'first resource should be modified more recently than the second'
        );
    }
    
    @isTest static void findingNullStaticResourceGivesRecent() {
        TestSettings ts = new TestSettings()
            .setupDefault()
            .finalize();

        StaticResource[] results = ltng_staticResourceHelperCtrl.findStaticResources(null);
        
        //-- there should be at least one static resource.
        //-- and unfortunately we cannot generate from tests
        //-- so we are bound by the ones within the project.
        //-- we don't want to be explicit, since we may add more

        System.assert(results != null);
        System.assert(results.size() > 1);

        StaticResource resource1 = results[0];
        StaticResource resource2 = results[1];

        System.assert(
            ts.isDateNewer(
                resource1.LastModifiedDate,
                resource2.LastModifiedDate
            ), 'first resource should be modified more recently than the second'
        );
    }
    
    @isTest static void findingStaticResourceGivesRecent() {
        TestSettings ts = new TestSettings()
            .setupDefault()
            .finalize();

        StaticResource[] results = ltng_staticResourceHelperCtrl.findStaticResources('ltng_');
        
        //-- there should be at least one static resource.
        //-- and unfortunately we cannot generate from tests
        //-- so we are bound by the ones within the project.
        //-- we don't want to be explicit, since we may add more

        System.assert(results != null);
        System.assert(results.size() > 1);

        StaticResource resource1 = results[0];
        StaticResource resource2 = results[1];

        System.assert(
            ts.isDateNewer(
                resource1.LastModifiedDate,
                resource2.LastModifiedDate
            ), 'first resource should be modified more recently than the second'
        );
    }
}