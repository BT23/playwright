
import { test } from '../fixtures'
    /*
    * Test Case: Create New PO successfully
    * Preconditions: User is logged in and createPurchaseOrderData.json is available. Fixture data used.
    * Steps:
    * 1. Open PO Module
    * 2. Click New button
    * 3. Enter Supplier
    * 4. Click Create button
    * Expected Result: PO created successfully and appears in the PO Listing
    * Returns: PO Number and saves to poTempData.json
    * Custom tags: @smoke @feature-po
    */ 

test('Create PO using fixture data @smoke @feature-po', async ({ poPage, supplierPage, poTestData, poDataFilePath  }) => {
    console.log('🧪 Starting test: Create new PO using fixture data');
    await supplierPage.openSupplierListing();
    console.log('🧪 Starting test: Create new PO supplier using fixture data');
    await supplierPage.createSupplier(poTestData.createpo.SupplierCode, poTestData.createpo.SupplierName);
    await supplierPage.clickBackBtn(); // Save and Back
    console.log('🧪 Starting test: Open PO Listing using fixture data');
    await poPage.openPOModule();
    console.log('🧪 Starting test: Create new PO  using fixture data');
    await poPage.createPO(poTestData.createpo.SupplierCode, poDataFilePath);
    await poPage.clickBackBtn(); // Save and Back
});
