
import oracledb, { Pool } from 'oracledb';
let pool: Pool;

export async function initializeDB() {
    try {
        pool = await oracledb.createPool({
            user: process.env.ORACLE_DB_USER,
            password: process.env.ORACLE_DB_PASSWORD,
            connectString: process.env.ORACLE_DB_CONNECT_STRING,
        });

        const connection = await pool.getConnection();

        
        const contactsTableExists: any = await connection.execute(
            `SELECT table_name FROM user_tables WHERE table_name = 'CONTACTS'`
        );

        if (contactsTableExists.rows.length === 0) {
            await createContactsTable(connection);
        }

        // Check if another table (e.g., 'another_table') exists
        const anotherTableExists: any = await connection.execute(
            `SELECT table_name FROM user_tables WHERE table_name = 'BRANCHES'`
        );

        if (anotherTableExists.rows.length === 0) {
            // Create the 'another_table' only if it doesn't exist
            await createAnotherTable(connection);
        }

        await connection.close();

        
    } catch (error) {
        console.error('Error initializing the database:', error);
        throw error;
    }
}

async function createContactsTable(connection: oracledb.Connection) {
    await connection.execute(`
        CREATE TABLE contacts (
            Employee_Name VARCHAR2(255) NOT NULL,
            Employee_Id VARCHAR2(255) UNIQUE NOT NULL,
            Department VARCHAR2(40) NOT NULL,
            Email_Id VARCHAR2(255) NOT NULL,
            Contact_No VARCHAR2(12) UNIQUE NOT NULL,
            Laptop VARCHAR2(255) NOT NULL,
            Serial_No VARCHAR2(255) NOT NULL,
            HandoverDate VARCHAR2(20) NOT NULL,
            Status VARCHAR2(15) NOT NULL,
            Remarks VARCHAR2(255) NOT NULL
        )`
    );
}

async function createAnotherTable(connection: oracledb.Connection) {
    await connection.execute(`
        CREATE TABLE BRANCHES (
            Branches VARCHAR2(255) NOT NULL,
            Contact_Person VARCHAR2(255) NOT NULL,
            Person_Contact VarCHAR2(10) UNIQUE NOT NULL,
            Branch_Address VARCHAR2(512) NOT NULL,
            Laptop_Manufacture VARCHAR2(255) NOT NULL,
            Laptop_SerialNo VARCHAR(255) NOT NULL,
            Printer_Manufacture VARCHAR2(255) NOT NULL,
            Printer_SerialNo VARCHAR2(255) NOT NULL,
            Status VARCHAR2(255) NOT NULL,
            HandoverDate VARCHAR2(255) NOT NULL,
            Remarks VARCHAR2(255) NOT NULL
        )`
    );
}

export async function getDBPool() {
    return pool;
}

