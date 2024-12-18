import { test, expect } from '@playwright/test';
import { queryContactTable } from '../database/database';

test('Verify Contact table entries', async () => {
    const records = await queryContactTable();

    expect(records).toContainEqual(
        expect.objectContaining({
            FirstName: 'Bonnie',
            LastName: 'Tang'
        })
    );

    expect(records).toContainEqual(
        expect.objectContaining({
            UserName: 'Bon'
        })
    );
});
