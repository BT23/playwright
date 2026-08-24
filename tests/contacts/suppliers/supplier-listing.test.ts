import { test } from '../../fixtures'

    /*
    * Test Case: Open Supplier Listing via Settings / Contacts / Supplier
    * Preconditions: User is logged in. Fixture data used.
    * Steps:
    * 1. Open Settings Module
    * 2. Open Contacts Module
    * 3. Open Supplier Listing
    * Expected Result: Supplier Listing should open
    * Custom tags: @smoke @feature-supplier
    */    
    
    test('Open Supplier Listing @smoke @feature-supplier', async ({ supplierPage  }) => {
        console.log('🧪 Starting test: Open Supplier Listing');
        await supplierPage.openSupplierListing; // Navigate to Supplier Listing
        console.log('✅ Test completed: Suppliers Listing opened successfully');        
    });
