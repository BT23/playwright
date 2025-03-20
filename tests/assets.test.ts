import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { AssetPage } from '../pages/assetPage';

test.describe('Asset Module Tests', () => {
    let loginPage: LoginPage;
    let assetPage: AssetPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        assetPage = new AssetPage(page);

        await loginPage.navigate();
        await loginPage.login(loginPage.credentials.validCredentials.username, loginPage.credentials.validCredentials.password);
        await loginPage.assertLoginSuccess();
    });

    test('Open Asset Module', async ({ page }) => {
        // Wait for the "Assets" image to be visible
        await page.waitForSelector('img[src="/_content/Mex.Blazor/images/Assets.png"]', { state: 'visible' });
        await assetPage.openAssetModule();
    });

    test('Create New Asset', async ({ page }) => {
        await assetPage.createNewAsset();
    });
});