import { test } from '../../fixtures'

    /*
    * Test Case: Create new Ops user
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
    
    test('Create new mex ops user @smoke @feature-users', async ({ usersPage, usersTestData }) => {
        console.log('🧪 Starting test: Create new MEX Ops user');
        await usersPage.openUsersListing(); // Navigate to Users Listing
        await usersPage.createNewUser(usersTestData.createusers.CaseNewOpsUser.FirstName, usersTestData.createusers.CaseNewOpsUser.LastName, usersTestData.createusers.CaseNewOpsUser.UserName, usersTestData.createusers.CaseNewOpsUser.Type, usersTestData.createusers.CaseNewOpsUser.Password, usersTestData.createusers.CaseNewOpsUser.ConfirmPassword);
        await usersPage.clickBackBtn();
        await usersPage.verifytUserCreated(usersTestData.createusers.CaseNewOpsUser.UserName); // Verify new ops user created and appears in listing
        console.log('✅ Test completed: New MEX Ops User created successfully');        
    });