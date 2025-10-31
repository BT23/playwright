import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login/loginPage';
import { WoPage } from '../../pages/workorders/woPage';
import { ContractorPortalPage } from '../../pages/contractoruserportal/contractorportalPage';
import { ContractorWOPage } from '../../pages/contractorworkorders/contractorwoPage';
import { PoPage } from '../../pages/purchaseorder/poPage';

test.describe('Contractor WO Module Tests', () => {
    let loginPage: LoginPage;
    let woPage: WoPage;
    let contractorportalPage: ContractorPortalPage;
    let contractorwoPage: ContractorWOPage;
    let poPage: PoPage;
    
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        woPage = new WoPage(page);
        contractorportalPage = new ContractorPortalPage(page);
        contractorwoPage = new ContractorWOPage(page);
        poPage = new PoPage(page);
        await loginPage.navigate();
        await loginPage.contractorUserLogin();
    });

    
});