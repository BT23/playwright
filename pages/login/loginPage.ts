import { expect, Page } from "@playwright/test";
import * as fs from 'fs';
import { helper } from "../../helperMethods";
declare var grecaptcha: any; // Declare grecaptcha globally

export class LoginPage {
  private page: Page;
  public credentials: { validCredentials: {username: string; password: string;}; contractorCredentials: {username: string; password: string;}; invalidCredentials: { username: string, password: string }[] };

  constructor(page: Page) {
    this.page = page;
    this.credentials = JSON.parse(fs.readFileSync('./credentials.json', 'utf-8'));

    helper.setPage(page);

    // Tolerant handlers for headless runs: ignore the benign AppInsights console message - AppInsights not initialized - skipping telemetry for: authentication/login
    this.page.on('console', msg => {
      try {
        const text = msg.text();
        if (text.includes('AppInsights not initialized')) return; // ignore harmless telemetry log
        // keep other console messages visible for debugging
        console.log('PAGE LOG:', text);
      } catch {}
    });    
  }

/*
 * Workaround for recapture
  * Navigate method is temporarily not in used  
 */

  async navigate() {
    try{      
      /*
       * Use relative path - Playwright will use baseURL from playwright.config.ts
       * endpoint: /Account/Login requires full navigation to load correctly due to the SSL redirection bug
      */
      await this.page.goto('/Account/Login', { waitUntil: 'networkidle' });
      await this.page.waitForTimeout(1000);
      
    } catch(error:any){
      throw new Error(`Failed to locate or interact with the username field: ${error.message}`);
    }
  }

/*
 * Login method with recaptcha workaround
 */  
//async login(username: string, password: string) {
    /******
     * Workaround for recapture
     * Temporary disabling the following codes to bypass the login using auth-storage.json
     ******
    // initial waits
    await this.page.waitForSelector('[automation-input="userName"]', { timeout: 10000 }).catch(()=>{});
    await this.page.waitForSelector('[automation-input="password"]', { timeout: 10000 }).catch(()=>{});

    // helper to perform click+navigation concurrently
    const clickAndWaitNav = async () => {
      await Promise.all([
        this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(()=>null),
        helper.clickButton("login")
      ]);
    };

    // enter creds and click first time
    await helper.enterValue("userName", username);
    await helper.enterValue("password", password);
    try {
      // wait briefly for grecaptcha if present
      await this.page.waitForFunction(() => typeof (window as any).grecaptcha !== 'undefined' && typeof (window as any).grecaptcha.execute === 'function', { timeout: 5000 }).catch(()=>null);
    } catch {}
    await clickAndWaitNav();
    await this.page.waitForTimeout(1000);

    // if the page "bounced" back to /Account or username visible again, retry once
    let attempts = 0;
    const maxRetries = 1;
    while (attempts < maxRetries) {
      const currentUrl = this.page.url();
      // robust check that tolerates navigation / execution-context loss
      const checkUserFieldVisible = async (): Promise<boolean> => {
        try {
          const loc = this.page.locator('[automation-input="userName"]');
          const count = await loc.count().catch(()=>0);
          if (count === 0) return false;
          return await loc.first().isVisible().catch(()=>false);
        } catch {
          // If execution context was destroyed (navigation), treat as not visible
          return false;
        }
      };
      const userFieldVisible = await checkUserFieldVisible();

      if (!currentUrl.includes('/Account') && !userFieldVisible) break;

      attempts++;
      // re-enter and click again
      await helper.enterValue("userName", username);
      await helper.enterValue("password", password);
    // Grecaptcha handling
    await this.page.waitForFunction(() => typeof grecaptcha.execute !== 'undefined');      
      await clickAndWaitNav();
      await this.page.waitForTimeout(1000);
    }


    // If still bounced after retries, save debug and throw
    const finalUrl = this.page.url();
    const finalUserVisible = await this.page.locator('[automation-input="userName"]').count() > 0
      && await this.page.locator('[automation-input="userName"]').first().isVisible().catch(()=>false);

    if ((finalUrl.includes('/Account') || finalUserVisible) && attempts >= maxRetries) {
      await fs.promises.mkdir('debug', { recursive: true });
      await this.page.screenshot({ path: 'debug/login-bounced.png', fullPage: true });
      await fs.promises.writeFile('debug/login-bounced.html', await this.page.content(), 'utf-8');
      await fs.promises.writeFile('debug/login-bounced.url.txt', finalUrl, 'utf-8');
      try {
        const cookies = await this.page.context().cookies();
        await fs.promises.writeFile('debug/login-bounced.cookies.json', JSON.stringify(cookies, null, 2), 'utf-8');
      } catch {}
      throw new Error(`Login bounced back to /Account after ${attempts} retry(ies). Saved debug/login-bounced.* (url: ${finalUrl})`);
    }

    // continue with post-login handling
    //await this.assertLoginSuccess();

  }
*/

  async login(username: string, password: string) {
    //await this.page.waitForTimeout(1000);
    // initial waits
    await this.page.waitForSelector('[automation-input="userName"]', { timeout: 10000 }).catch(()=>{});
    await this.page.waitForSelector('[automation-input="password"]', { timeout: 10000 }).catch(()=>{});
    await helper.enterValue("userName", username);
    await helper.enterValue("password", password);
    console.log(username + " and " + password);
    console.log("UserName and Password are entered.");

    // Grecaptcha handling
    //await this.page.waitForFunction(() => typeof grecaptcha.execute !== 'undefined');

    await helper.clickButton("login");
    console.log("Login button is clicked");
    
    await this.page.waitForTimeout(10000);
    const selectLanguageHeader = this.page.locator('[automation-header="SelectLanguage"]');
    await expect(selectLanguageHeader).toBeVisible();
    console.log("Login method - wait for Select Language dialog is visible.");

    await this.selectLanguage();
  }
  
  async contractorUserLogin() {
    await helper.enterValue("userName", this.credentials.contractorCredentials.username);
    console.log("Enter: userName" + this.credentials.contractorCredentials.username);
    await helper.enterValue("password", this.credentials.contractorCredentials.password);
    console.log("Enter: password" + this.credentials.contractorCredentials.password);

    // Grecaptcha handling
    await this.page.waitForFunction(() => typeof grecaptcha.execute !== 'undefined');

    await helper.clickButton("login");
    console.log("Login button is clicked");
  }

  async logout() {
    await helper.clickUserActionsContextMenu("Logout");
    //await helper.clickButton("logout");
    await this.page.waitForTimeout(1000);
    // Verify the login form is shown by checking the login button appears
    await expect(this.page.locator('[automation-button="login"]')).toBeVisible();    
    
  }
  
  //async assertLoginSuccess(): Promise<void> {
  async selectLanguage(): Promise<void> {

    /*
     * Select Language dialog appears, choose English (Australia) and confirm.
    */

    try {
      const selectLanguageHeader = this.page.locator('[automation-header="SelectLanguage"]');
      await expect(selectLanguageHeader).toBeVisible();
      console.log("Select Language dialog is visible.");

      console.log("Selecting English(Australia) language.");
      await helper.clickButtonInDialog("SelectLanguage", "English(Australia)");

      const selectButton = this.page.locator('[automation-button="Select"]');
      await expect(selectButton).toBeVisible();
      await helper.clickButtonInDialog("SelectLanguage", "Select");
      console.log("Select button is clicked.");
    } catch {
      console.log("Select Language dialog is not clicked.");
    }

    //For GitHub only - Required wait to stabilize the Home page after selecting language (Github is slow).
    await this.page.waitForTimeout(20000);

    // Wait for the Home header to appear to confirm successful login
    const homeHeader = this.page.locator('[automation-header="HomeHeader"]');
    await expect(homeHeader).toBeVisible(); 
    
    await this.page.waitForTimeout(500).catch(()=>null);
  }

    async performInvalidLogins(): Promise<void> {
      for (const creds of this.credentials.invalidCredentials) {
        console.log('username:' + creds.username + ' password: ' + creds.password);
        await this.login(creds.username, creds.password);
        await this.assertLoginFailure();
      }
    }

    async assertLoginFailure(): Promise<void> {      
      var hasInvalidLogin = await helper.checkForLoginValidationErrors("Invalid login attempt.");
      if (hasInvalidLogin) {
        await helper.clickButton("Ok");
      }

      await helper.enterValue("userName", "");
      await helper.enterValue("password", "");
    }    
  }