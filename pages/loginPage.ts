import { expect, Page } from "@playwright/test";
import * as fs from 'fs';
declare var grecaptcha: any; // Declare grecaptcha globally

export class LoginPage {
  private page: Page;
  public credentials: { validCredentials: {username: string; password: string;}; invalidCredentials: { username: string, password: string }[] };

  constructor(page: Page) {
    this.page = page;
    this.credentials = JSON.parse(fs.readFileSync('./credentials.json', 'utf-8'));
  }

  async navigate() {
    await this.page.goto('http://bonnie.mex16.dev/');
  }

  private usernameInput = '#Input_UserName';
  private passwordInput = '#password';
  private loginButton = '#loginButton';
  private errorMessage = '.error-message';

  //fill usrname and password
  async login(username: string, password: string) {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    // Wait for the "Skip" button to be visible 
    await this.page.waitForFunction(() => typeof grecaptcha.execute !== 'undefined');
    await this.page.waitForSelector('#loginButton', { state: 'visible' });
    await this.page.click(this.loginButton);
  }

  async assertLoginSuccess(): Promise<void> {        
      //Assuming a successful login redirects to Select Language
      const languageCell = this.page.locator('td.grid-cell:has-text("English (Australia)")');
      await expect(languageCell).toBeVisible(({ timeout: 10000 }));

      //Locate the img element with src containing "Ok.png"
      const okImage = this.page.locator('img[src*="Ok.png"]');

      //Click the Ok.png image
      await okImage.click();

      await this.page.waitForSelector('#Skip', { state: 'visible' });

      //Locate the Skip button on MEX Introduction Video form
      const skipButton = await this.page.$('#Skip');
      // Check if the "Skip" button exists and click it if found 
      if (skipButton !== null) { 
        await skipButton.click(); 
        console.log('Skip button clicked');
        await this.page.waitForTimeout(1000); 
      } else { 
        console.log('Skip button not found');
      }
    } 

    async performInvalidLogins(): Promise<void> {
      for (const creds of this.credentials.invalidCredentials) {
        console.log('username:' + creds.username + ' password: ' + creds.password);
        await this.login(creds.username, creds.password);
        await this.assertLoginFailure();
      }
    }

    async assertLoginFailure(): Promise<void> {
      const errorLabelLocator = this.page.locator('#validationAlert .validation-summary-errors li:has-text("Invalid login attempt.")'); 
      await errorLabelLocator.waitFor({ state: 'visible' });
      await expect(errorLabelLocator).toBeVisible(({ timeout: 30000 }));

      const okButton = this.page.locator('#validationAlert .footerBarButton:has-text("Ok")');
      // Click the "OK" button
      await okButton.click();
  
      // Verify the button was clicked
      await expect(okButton).not.toBeVisible();
      await this.page.fill(this.usernameInput, '');
      await this.page.fill(this.passwordInput, '');

    }    
  }