import {test, expect} from '@playwright/test';
import {LoginPage} from '../../pages/login/loginPage';
import { only } from 'node:test';
import { log } from 'console';

// test.describe is a function that groups tests together
test.describe('Login Tests', () =>{
    let loginPage:LoginPage;

    test.beforeEach(async ({ page }) => { 
        loginPage = new LoginPage(page); 
        await loginPage.navigate(); 
    });

    /**
    // add an afterEach to capture debug artifacts on failure and attempt cleanup
    test.afterEach(async ({ page }, testInfo) => {
        // sanitize test title for filenames
        const safeTitle = (testInfo.title || 'test').replace(/[^\w\-]+/g, '_');

        // console log so you can see in runner output that afterEach ran
        console.log(`afterEach running for: ${safeTitle} (status=${testInfo.status})`);
        
        // on failure: save screenshot and storage state
        if (testInfo.status !== 'passed') {
            try {
                await page.screenshot({ path: `debug/${safeTitle}-${Date.now()}.png`, fullPage: true });
            } catch {}
            try {
                await page.context().storageState({ path: `debug/state-${safeTitle}-${Date.now()}.json` });
            } catch {}
        }
        // best-effort logout/cleanup to leave next test in a clean state
        try {
            if (loginPage && typeof loginPage.logout === 'function') {
                await loginPage.logout().catch(()=>{});
            }
        } catch {}
    });
     */

    test ('valid login', async ({page}) => { 
        await loginPage.login(loginPage.credentials.validCredentials.username, loginPage.credentials.validCredentials.password);
    });

    /*
    test ('invalid login', async () => {
        await loginPage.performInvalidLogins();
    });   

    test ('Contractor User login', async () => {
        await loginPage.contractorUserLogin();
    });

    test('Login Logout Test', async ({ page }) => {
        await loginPage.login(loginPage.credentials.validCredentials.username, loginPage.credentials.validCredentials.password);
        //await loginPage.assertLoginSuccess();

        await loginPage.logout();
    });
    */
}); 
