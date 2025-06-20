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
  }

  async navigate() {
    await this.page.goto('https://bonnie.mex16.dev/');
  }

  //fill usrname and password
  async login(username: string, password: string) {
    await helper.enterValue("userName", username);
    await helper.enterValue("password", password);

    // Grecaptcha handling
    //await this.page.waitForFunction(() => typeof grecaptcha.execute !== 'undefined');

    await helper.clickButton("login");
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
    await helper.clickButton("logout");
    await this.page.waitForTimeout(1000);
    // Verify the login form is shown by checking the login button appears
    await expect(this.page.locator('[automation-button="login"]')).toBeVisible();    
    
  }

  async assertLoginSuccess(): Promise<void> {        
      //Assuming a successful login redirects to Select Language
      await helper.selectRowByFieldName("SelectLanguageGrid", "Name", "English");
      await helper.clickButton("Select");

      //await this.page.waitForSelector('#Skip', { state: 'visible' });

      //Locate the Skip button on MEX Introduction Video form
      //const skipButton = await this.page.$('#Skip');
      // Check if the "Skip" button exists and click it if found 
      //if (skipButton !== null) { 
      //  await skipButton.click(); 
      //  console.log('Skip button clicked');
      //  await this.page.waitForTimeout(1000); 
      //} else { 
      //  console.log('Skip button not found');
      //}
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