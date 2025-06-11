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

    test('Open Asset Module', async () => {
        await assetPage.openAssetModule();
    });

    test('Create New Asset', async () => {
        await assetPage.createNewAsset();
    });

    test('ExpandTreeNode', async () => {
        await assetPage.expandTreeNodeByName("Admin");
    })  

    test('Open Asset Details', async () => {
        await assetPage.openAssetDetailsByRightClick();
    });
});