import { test } from '../../fixtures'

    /*
    * Test Case: Create new Prestart user
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
    
    test('Create new mex prestart user @smoke @feature-users', async ({ usersPage, usersTestData }) => {
        console.log('🧪 Starting test: Create new MEX Prestart user');
        await usersPage.openUsersListing(); // Navigate to Users Listing
        await usersPage.createNewUser(usersTestData.createusers.CaseNewPrestartUser.FirstName, usersTestData.createusers.CaseNewPrestartUser.LastName, usersTestData.createusers.CaseNewPrestartUser.UserName, usersTestData.createusers.CaseNewPrestartUser.Type, usersTestData.createusers.CaseNewPrestartUser.Password, usersTestData.createusers.CaseNewPrestartUser.ConfirmPassword);
        await usersPage.clickBackBtn();
        await usersPage.verifytUserCreated(usersTestData.createusers.CaseNewPrestartUser.UserName); // Verify new prestart user created and appears in listing
        console.log('✅ Test completed: New MEX Prestart User created successfully');        
    });