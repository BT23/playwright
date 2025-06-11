import { expect, Locator, Page } from '@playwright/test';

class HelperMethods {
  private page!: Page;

  setPage(page: Page) {
    this.page = page;
  }

  async clickButton(name: string, shouldForce = false) {
    const button = this.page.locator(`[automation-button="${name}"]`).first();
    await button.click({ force: shouldForce });
  }

  async closePage(shouldForce = false) {
    const button = this.page.locator(`[automation-button="closePage"]`).first();
    await button.click({ force: shouldForce });
  }

  async selectTab(name: string, shouldForce = false) {
    const tab = this.page.locator(`[automation-tab="${name}"]`);
    await tab.click({ force: shouldForce });
  }

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

  async selectRowByIndex(gridName: string, index: number, shouldForce = false) {
    const grid = this.page.locator(`[automation-grid="${gridName}"]`).first();
    const row = grid.locator(`[automation-row="${index}"]`);
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

  async enterValue(fieldName: string, value: string, shouldPressTab = false) {
    const input = this.page.locator(`[automation-input="${fieldName}"]`);
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

  async selectEllipse(name: string, shouldForce = false) {
    const button = this.page.locator(`[automation-ellipse-button="${name}"]`).first();
    await button.click({ force: shouldForce });
  }

  async selectEllipseInColumn(row: Locator, columnName: string, shouldForce = false) {
    const columnCell = row.locator(`[automation-col="${columnName}"]`);
    await columnCell.click();
    await this.selectEllipse(columnName, shouldForce);
  }

  async selectDropDown(name: string, shouldForce = false) {
    const dropDown = this.page.locator(`[automation-dropdown="${name}"]`).first();
    await dropDown.click({ force: shouldForce });
  }

  async selectDropDownInColumn(row: Locator, columnName: string, shouldForce = false) {
    const columnCell = row.locator(`[automation-col="${columnName}"]`);
    await columnCell.click();
    await this.selectDropDown(columnName, shouldForce);
  }

  async checkHeader(name: string) {
    const header = this.page.locator(`[automation-header="${name}"]`);
    await expect(header).toBeVisible();
  }

  async rightClickGrid(gridName: string) {
    const grid = this.page.locator(`[automation-grid="${gridName}"]`).first();
    await grid.click({ button: 'right' });
  }

  async expandTreeNodeByName(name: string) {
    await this.page.waitForTimeout(500);

    while (true) {
      const assetLabel = this.page.locator(`label:text-is("${name}")`);

      if (await assetLabel.count() > 0 && await assetLabel.first().isVisible()) {
          await assetLabel.first().click();
          return;
      }

      // Look for all visible, collapsed expanders
      const collapsedExpanders = this.page.locator('[automation-expander-button].expander-right');
      const count = await collapsedExpanders.count();

      if (count === 0) {
          break;
      }

      let expanded = false;

      // Try expanding each one and checking again
      for (let i = 0; i < count; i++) {
          const expander = collapsedExpanders.nth(i);

          // Click expander
          await expander.click();
          await this.page.waitForTimeout(250);

          // Check if the name we're looking for is now loaded
          const match = this.page.locator(`label:text-is("${name}")`);

          if (await match.count() > 0 && await match.first().isVisible()) {
              await match.first().click();
              return;
          }

          expanded = true;
      }

      if (!expanded) {
        throw new Error(`Asset "${name}" not found and nothing was expanded.`);
      }
    }
  }

  async checkForLoginValidationErrors(expectedError: string): Promise<boolean> {
    const validationErrors = this.page.locator('[automation-list="validationErrors"]');
    if (!(await validationErrors.isVisible())) {
      return false;
    }

    const matchingItem = validationErrors.locator(`[automation-label]:has-text("${expectedError}")`);
    return await matchingItem.count() > 0;
  }
}

export const helper = new HelperMethods();