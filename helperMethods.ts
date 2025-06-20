import { expect, Locator, Page } from '@playwright/test';

class HelperMethods {
  private page!: Page;

  setPage(page: Page) {
    this.page = page;
  }

  async checkHeader(name: string) {
    const header = this.page.locator(`[automation-header="${name}"]`);
    await expect(header).toBeVisible();
  }

  async checkForLoginValidationErrors(expectedError: string): Promise<boolean> {
    const validationErrors = this.page.locator('[automation-list="validationErrors"]');
    if (!(await validationErrors.isVisible())) {
      return false;
    }

    const matchingItem = validationErrors.locator(`[automation-label]:has-text("${expectedError}")`);
    return await matchingItem.count() > 0;
  }

  async clickButton(name: string, shouldForce = false) {
    const button = this.page.locator(`[automation-button="${name}"]`).first();
    await button.click({ force: shouldForce });
  }

  async clickButtonInDialog(dialogName: string, fieldName: string, shouldPressTab = false) {
    const dialog = this.page.locator(`[automation-dialog="${dialogName}"]`);
    const input = dialog.locator(`[automation-button="${fieldName}"]`);
    await input.click();
  }

  async closePage(shouldForce = false) {
    const button = this.page.locator(`[automation-button="closePage"]`).first();
    await button.click({ force: shouldForce });
  }

  /* Enter Value helper methods
  * These methods are used to enter values into input fields, either in the main page or within a dialog.
  * They can also enter values in a specific cell of a grid.
  */

  async enterValue(fieldName: string, value: string, shouldPressTab = false) {
    const input = this.page.locator(`[automation-input="${fieldName}"]`);
    await input.click();
    await input.fill(value);
    if (shouldPressTab) {
      await input.press('Tab');
    }    
  }

  async enterValueInDialog(dialogName: string, fieldName: string, value: string, shouldPressTab = false) {
    const dialog = this.page.locator(`[automation-dialog="${dialogName}"]`);
    const input = dialog.locator(`[automation-input="${fieldName}"]`);
    await input.click();
    await input.fill(value);
    if (shouldPressTab) {
      await input.press('Tab');
    }
  }

  async enterValueInFilterDialog(formName: string, fieldName: string, value: string, shouldPressTab = false) {
    const dialog = this.page.locator(`[form-name="${formName}"]`);
    const input = dialog.locator(`[automation-input="${fieldName}"]`);
    await input.click();
    await input.fill(value);
    if (shouldPressTab) {
      await input.press('Tab');
    }
  }

  async enterValueInCell(row: Locator, name: string, value: string, shouldPressTab = false) {
    const columnCell = row.locator(`[automation-col="${name}"]`);
    await columnCell.click();
    await this.enterValue(name, value, shouldPressTab);
  }

  /*
  * Fill Form Fields helper methods
  * These methods are used to fill in form fields with values from a details object.
  * They can map field names to UI field names, apply value transformations, and handle select list fields.
  * The method iterates through the details object and fills in the corresponding fields.
  * @param details - An object containing field names and their corresponding values.
  * @param fieldMapping - An optional mapping of field names to UI field names.
  * @param fillValueMapping - An optional mapping of field names to functions that transform the values before filling.
  * @param selectListFields - An optional array of field names that should trigger a selection of the first list item after filling.
  */
  async fillFormFields(
      details: Record<string, string>,
      fieldMapping: Record<string, string> = {},
      fillValueMapping: Record<string, (value: string) => string> = {},
      selectListFields: string[] = []
  ): Promise<void> {
      for (const [field, value] of Object.entries(details)) {
          const uiField = fieldMapping[field] || field;
          if (typeof value === 'string' && value.trim() !== '') {
              const fillValue = fillValueMapping[field] ? fillValueMapping[field](value) : value;
              await this.enterValue(uiField, fillValue);
              if (selectListFields.includes(uiField)) {
                  await this.selectFirstListItem();
              }
              await this.page.waitForTimeout(500);
          }
      }
  }

  /*
  * Get Field Value helper methods
  * These methods are used to retrieve the value of an input field by its name.
  * They can locate the field by its automation-input attribute, id, or name.
  * */
  async getFieldValue(fieldName: string): Promise<string> {
      // Try to locate by automation-input, id, or name
      const field = this.page.locator(
          `[automation-input="${fieldName}"], #${fieldName}, [name="${fieldName}"]`
      );
      await field.waitFor({ state: 'visible' });
      return await field.inputValue();
  }

 /*
  * Locate Tree Node by Name
  * This method searches for a tree node by its name, expanding nodes as necessary.
  * It will click the node if found.
  * It will return true if the node is found and clicked, or false if not found.
  * */
  async locateTreeNodeByName(name: string): Promise<boolean> {
     await this.page.waitForTimeout(500);

    // Convert the search name to lower case for case-insensitive comparison
    const searchName = name.toLowerCase();

    while (true) {
        // Find all label elements and check their text content case-insensitively
        const assetLabels = this.page.locator('label');
        const count = await assetLabels.count();

        for (let i = 0; i < count; i++) {
            const label = assetLabels.nth(i);
            const labelText = (await label.textContent())?.trim().toLowerCase();
            if (labelText === searchName && await label.isVisible()) {
                await label.click();
                return true;
            }
        }

        // Look for all visible, collapsed expanders
        const collapsedExpanders = this.page.locator('[automation-expander-button].expander-right');
        const expanderCount = await collapsedExpanders.count();

        if (expanderCount === 0) {
            break;
        }

        let expanded = false;

        // Try expanding each one and checking again
        for (let i = 0; i < expanderCount; i++) {
            const expander = collapsedExpanders.nth(i);

            // Click expander
            await expander.click();
            await this.page.waitForTimeout(250);

            // After expanding, re-check all labels
            const assetLabelsAfterExpand = this.page.locator('label');
            const countAfterExpand = await assetLabelsAfterExpand.count();

            for (let j = 0; j < countAfterExpand; j++) {
                const label = assetLabelsAfterExpand.nth(j);
                const labelText = (await label.textContent())?.trim().toLowerCase();
                if (labelText === searchName && await label.isVisible()) {
                    await label.click();
                    return true;
                }
            }

            expanded = true;
        }

        if (!expanded) {
            throw new Error(`Asset "${name}" not found and nothing was expanded.`);
        }
    }
    // Node not found after all attempts
    return false;
  }

  /*
  * Grid helper methods
  * These methods are used to interact with grids, such as clicking on the grid, selecting rows, and right-clicking.
  * They can also select a grid by its name.
  * */
  async rightClickGrid(gridName: string) {
    const grid = this.page.locator(`[automation-grid="${gridName}"]`).first();
    await grid.click({ button: 'right' });
  }

   /* List helper methods
   * These methods are used to select items in a list by various criteria.
    * They can select the first item, last item, or an item by index.
    * They can also force the selection if needed.
    * */
  async selectFirstListItem(shouldForce = false) {
    const item = this.page.locator('[automation-list-item]').first();
    await item.click({ force: shouldForce });
  }

  async selectLastListItem(shouldForce = false) {
    const item = this.page.locator('[automation-list-item]').last();
    await item.click({ force: shouldForce });
  }

  async selectListItemByIndex(index: number, shouldForce = false) {
    const row = this.page.locator(`[automation-list-item="${index}"]`);
    await row.click({ force: shouldForce });
  }  

  /*
  * Select Row helper methods
  * These methods are used to select rows in a grid by various criteria.
  **/
  async selectFirstRow(gridName: string, shouldForce = false) {
    const grid = this.page.locator(`[automation-grid="${gridName}"]`).first();
    const row = grid.locator('[automation-row]').first();
    await row.click({ force: shouldForce, timeout: 0 });
    return row;
  }

  async selectLastRow(gridName: string, shouldForce = false) {
    const grid = this.page.locator(`[automation-grid="${gridName}"]`).first();
    const row = grid.locator('[automation-row]').last();
    await row.click({ force: shouldForce, timeout: 0 });
    return row;
  }

  async selectRowByFieldName(gridName: string, columnName: string, fieldName: string, shouldForce = false) {
    const grid = this.page.locator(`[automation-grid="${gridName}"]`).first();
    const row = grid.locator('[automation-row]').filter({
      has: this.page.locator(`[automation-col="${columnName}"]:has-text("${fieldName}")`)
    }).first();
    await row.click({ force: shouldForce, timeout: 0 });
    return row;
  }

  async selectRowByIndex(gridName: string, index: number, shouldForce = false) {
    const grid = this.page.locator(`[automation-grid="${gridName}"]`).first();
    const row = grid.locator(`[automation-row="${index}"]`);
    await row.click({ force: shouldForce, timeout: 0 });
    return row;
  }

  /*
  * Drop Down helper methods
  * These methods are used to select a drop-down menu by its name or in a specific column of a grid.
  **/
  async selectDropDown(name: string, shouldForce = false) {
    const dropDown = this.page.locator(`[automation-dropdown="${name}"]`).first();
    await dropDown.click({ force: shouldForce });
  }

  async selectDropDownInColumn(row: Locator, columnName: string, shouldForce = false) {
    const columnCell = row.locator(`[automation-col="${columnName}"]`);
    await columnCell.click();
    await this.selectDropDown(columnName, shouldForce);
  }

  /*
  * Ellipse helper methods
  * These methods are used to select an ellipse button by its name or in a specific column of a grid.
  * */
  async selectEllipse(name: string, shouldForce = false) {
    const button = this.page.locator(`[automation-ellipse-button="${name}"]`).first();
    await button.click({ force: shouldForce });
  }

  async selectEllipseInColumn(row: Locator, columnName: string, shouldForce = false) {
    const columnCell = row.locator(`[automation-col="${columnName}"]`);
    await columnCell.click();
    await this.selectEllipse(columnName, shouldForce);
  }

 /* * Tab helper methods
  * These methods are used to select a tab by its name.
  * They can also force the selection if needed.
  * */
  async selectTab(name: string, shouldForce = false) {
    const tab = this.page.locator(`[automation-tab="${name}"]`);
    await tab.click({ force: shouldForce });
  }

  /***
   * Verification helper methods
   * These methods are used to verify the visibility of elements, such as headers, buttons, and lists.
   */

  /*
  * Verify Dialog Box Visible 
  */

  async verifyDialogVisible(dialogName: string): Promise<void> {
      const dialog = this.page.locator(`[automation-dialog="${dialogName}"]`);
      await expect(dialog).toBeVisible();
  }

  /*
  * Verify Dialog Box Visible and Click OK button
  */
async verifyDialogVisibleAndClickOk(dialogName: string): Promise<void> {
    const dialog = this.page.locator(`[automation-dialog="${dialogName}"]`);
    await expect(dialog).toBeVisible();
    // Click the Ok button inside the dialog
    const okButton = dialog.locator('[automation-button="Ok"]');
    await okButton.click();
}


  /*******
   * Code to verify fields
    * This method verifies that the values of specified fields match the expected values.
    * It retrieves the actual value of each field and compares it to the expected value.
    * If the actual value does not match the expected value, an assertion error will be thrown.
    * @param expected - An object containing the expected values for each field.
    * @param fieldsToVerify - An array of field names to verify.
    * * Usage:
    * const expectedValues = { field1: 'value1', field2: 'value2' };
    * const fieldsToVerify = ['field1', 'field2'];
    * helper.verifyFields(expectedValues, fieldsToVerify);
    * @returns {Promise<void>}
    * @throws {Error} If the actual value of a field does not match the expected value.
    *
   */
async verifyFields(
      expected: Record<string, string>,
      fieldsToVerify: string[]
    ): Promise<void> {
      for (const field of fieldsToVerify) {
          const expectedValue = expected[field];
          if (expectedValue !== undefined) {
              const actual = await this.getFieldValue(field);
              expect(actual.trim().toLowerCase()).toBe(expectedValue.trim().toLowerCase());
          }
      }
    }
  }
export const helper = new HelperMethods();
