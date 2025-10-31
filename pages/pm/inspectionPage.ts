import { expect, Page } from '@playwright/test';
import { helper } from '../../helperMethods';

export class InspectionPage {

    private page: Page;

    constructor(page: Page) {
        this.page = page;

        helper.setPage(page);
    }


    /*
    *************************
    * Open Inspection Listing
    *************************
    */
    async createInspection(): Promise<void> {
        await helper.clickButton("NewInspection");
        
        await this.page.waitForTimeout(1000);

        await helper.enterValueInDialog("CreateInspection","Description","Test Inspection");
        await helper.enterValueInDialog("CreateInspection","Frequency","1");
        await helper.enterValueInDialog("CreateInspection","Frequency","1");
        

    }
}