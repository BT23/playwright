import { test } from '../../fixtures'

    /*
    * Test Case: Open Users Listing via Settings / Contacts / Users
    * Preconditions: User is logged in. Fixture data used.
    * Steps:
    * 1. Open Settings Module
    * 2. Open Users Listing
    * Expected Result: Users Listing should open
    * Custom tags: @smoke @feature-users
    */    
    
    test('Open Users Listing @smoke @feature-users', async ({ usersPage  }) => {
        console.log('🧪 Starting test: Open Users Listing');
        await usersPage.openUsersListing(); // Navigate to Users Listing
        console.log('✅ Test completed: Users Listing opened successfully');        
    });
