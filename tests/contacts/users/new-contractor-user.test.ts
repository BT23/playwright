import { test } from '../../fixtures'

    /*
    * Test Case: Create new contractor user
    * Preconditions: User is logged in. Fixture data used.
    * Steps:
    * 1. Open Settings Module
    * 2. Open Users Listing
    * 3. Click New Button
    * 4. Fill in required details and click Create
    * 5. Click Back button to return to Users Listing
    * Expected Result: Users Listing should open
    * Custom tags: @smoke @feature-users
    */    
    
    test('Create new contractor user @smoke @feature-users', async ({ usersPage, usersTestData }) => {
        console.log('🧪 Starting test: Create new contractor user');
        await usersPage.openUsersListing(); // Navigate to Users Listing
        await usersPage.createNewUser(usersTestData.createusers.CaseNewContractorUser.FirstName, usersTestData.createusers.CaseNewContractorUser.LastName, usersTestData.createusers.CaseNewContractorUser.UserName, usersTestData.createusers.CaseNewContractorUser.Type, usersTestData.createusers.CaseNewContractorUser.Password, usersTestData.createusers.CaseNewContractorUser.ConfirmPassword);
        await usersPage.clickBackBtn();
        await usersPage.verifytUserCreated(usersTestData.createusers.CaseNewContractorUser.UserName); // Verify new contractor user created and appears in listing
        console.log('✅ Test completed: New Contractor User created successfully');        
    });