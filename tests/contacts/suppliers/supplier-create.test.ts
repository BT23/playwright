import { test } from '../../fixtures'
    /*
    * Test Case: Create New Supplier successfully
    * Preconditions: User is logged in and createSupplierData.json is available. Fixture data used.
    * Steps:
    * 1. Open Settings Module
    * 2. Open Contacts Module
    * 3. Open Supplier Listing
    * 4. Click New Supplier button
    * 5. Enter Company Code and Company Name from fixture data
    * 6. Click Create button
    * 7. Click Save and Back button
    * 8. Verify Supplier exists in Supplier Listing
    * Expected Result: Supplier created successfully and appears in the Supplier Listing
    * Custom tags: @smoke @feature-supplier
    */ 

test('Create new supplier using fixture data @smoke @feature-supplier', async ({ supplierPage, supplierTestData  }) => {
    console.log('🧪 Starting test: Create new supplier using fixture data');
    await supplierPage.goto(); // Navigate to Supplier Listing
    await supplierPage.createSupplier(supplierTestData.createsupplier.CompanyCode, supplierTestData.createsupplier.CompanyName);
    await supplierPage.clickBackBtn(); // Save and Back
    console.log('🧪 Starting test: Verify Supplier created and saved');
    await supplierPage.verifySupplierExist(supplierTestData.createsupplier.CompanyCode);
    console.log('✅ Test completed: Supplier created and verified successfully');
});
