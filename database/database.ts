import sql from 'mssql';
import * as fs from 'fs';

// Function to read the database configuration from a JSON file
function getDatabaseConfig() {
    const config = JSON.parse(fs.readFileSync('db-config.json', 'utf-8'));
    return config;
}

// Function to query the Contact table
export async function queryContactTable() {
    const config = getDatabaseConfig();
    try {
        // Connect to the database
        await sql.connect(config.connectionString);
        console.log('Database connected successfully.');

        // Query the Contact table
        const result = await sql.query`SELECT * FROM Contact WHERE (FirstName = 'Bonnie' AND LastName = 'Tang') OR UserName = 'Bon'`;
        console.log('Query executed successfully:', result.recordset);

        return result.recordset;
    } catch (err) {
        console.error('Database query failed:', err);
    } finally {
        // Close the database connection
        await sql.close();
        console.log('Database connection closed.');
    }
}
