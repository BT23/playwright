import { readFileSync } from 'fs';
import { test } from '../fixtures'


    test('Select Specificed PO', async ({ poPage, poTestData, poDataFilePath }) => {
        await poPage.createPO(poTestData.createpo.Supplier, poDataFilePath);

        // Read and parse the file
        const data = JSON.parse(readFileSync(poDataFilePath, 'utf-8'));

        await poPage.clickBackBtn(); //Save and Back
        await poPage.selectSpecificedPO(data.poNumber);
        console.log(`Selected PO Number: ${data.poNumber}`);

    });