import {test, expect} from '@playwright/test';
import {LoginPage} from '../pages/loginPage';
import { only } from 'node:test';

// test.describe is a function that groups tests together
test.describe('Login Tests', () =>{
    let loginPage:LoginPage;

    test.beforeEach(async ({ page }) => { 
        loginPage = new LoginPage(page); 
        await loginPage.navigate(); 
    });
    
    test ('valid login', async ({page}) => { 
        await loginPage.login(loginPage.credentials.validCredentials.username, loginPage.credentials.validCredentials.password);
        await loginPage.assertLoginSuccess();
    });

    test ('invalid login', async () => {
        await loginPage.performInvalidLogins();
    });   
}); 
