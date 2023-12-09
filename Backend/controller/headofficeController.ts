
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { getDBPool } from '../util/DBUtil';


export const getAllContacts = async (request: Request, response: Response) => {
    try {
        const pool = await getDBPool();
        const connection = await pool.getConnection();
        const selectSQL = 'SELECT * FROM contacts';
        const result = await connection.execute(selectSQL);

        // Extract the rows from the result and return them
        const data = result.rows;

        // Close the connection
        await connection.close();

        return response.status(200).json(data);
    } catch (error: any) {
        return response.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


// Define the contact interface
// interface Contact {
//     Employee_Name: string;
//     Employee_Id: number;
//     Department: string;
//     Email_Id: string;
//     Contact_No: string;
//     Laptop: string;
//     Serial_No: string;
//     HandoverDate: string;
//     Status: string;
//     Remarks: string;
// }


// export const getAllContacts = async (request: Request, response: Response) => {
//     try {
//         const pool = await getDBPool(); // Assuming you have a function to get the database pool
//         const connection = await pool.getConnection();
//         const selectSQL = 'SELECT * FROM contacts';
//         const result = await connection.execute(selectSQL);

//       if(result.rows){
//         const contacts: Contact[] = result.rows.map((row: any) => ({
//             Employee_Name: row[0], // Assuming Employee_Name is the first column
//             Employee_Id: row[1], // Assuming Employee_Id is the second column
//             Department: row[2], // Assuming Department is the third column
//             Email_Id: row[3], // Assuming Email_Id is the fourth column
//             Contact_No: row[4], // Assuming Contact_No is the fifth column
//             Laptop: row[5], // Assuming Laptop is the sixth column
//             Serial_No: row[6], // Assuming Serial_No is the seventh column
//             HandoverDate: row[7], // Assuming HandoverDate is the eighth column
//             Status: row[8], // Assuming Status is the ninth column
//             Remarks: row[9], // Assuming Remarks is the tenth column
//         }));
   
//         // Close the connection
//         await connection.close();

//         const responseObj = {
//             data: contacts,
//         };

//         return response.status(200).json(responseObj);
//     }
//     } catch (error: any) {
//         return response.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// };



export const getAContact = async (request: Request, response: Response) => {
    try {
        // Get the Employee_Id from the request parameters
        const { Employee_Id } = request.params;

        // Check if Employee_Id is provided
        if (!Employee_Id) {
            return response.status(400).json({ message: 'Employee_Id is required' });
        }

        const pool = await getDBPool();
        const connection = await pool.getConnection();

        // Create a SQL SELECT statement
        const selectSQL = 'SELECT * FROM contacts WHERE Employee_Id = :Employee_Id';

        // Bind Employee_Id to the SELECT statement
        const bindVars = {
            Employee_Id,
        };

        // Execute the SELECT query
        const result: any = await connection.execute(selectSQL, bindVars);

        // Check if a contact was found
        if (result.rows.length === 0) {
            return response.status(404).json({ message: 'Contact not found' });
        }

        // Return the contact data
        return response.status(200).json(result.rows[0]);
    } catch (error: any) {
        return response.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


export const createContact = async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }

    try {
        const {
            Employee_Name,
            Employee_Id,
            Department,
            Email_Id,
            Contact_No,
            Laptop,
            Serial_No,
            HandoverDate,
            Status,
            Remarks,
        } = request.body;

        // Get the connection pool from the dbUtil
        const pool = await getDBPool();
        const connection = await pool.getConnection();

        // Check if the Employee_Id already exists
        const checkMobileQuery = `
            SELECT Employee_Id
            FROM contacts
            WHERE Employee_Id = :Employee_Id
        `;

        const checkMobileOptions = {
            Employee_Id,
        };

        const checkMobileResult :any= await connection.execute(checkMobileQuery, checkMobileOptions);

        if (checkMobileResult.rows.length > 0) {
            await connection.close();
            return response.status(400).json({
                status: 'FAILED',
                data: null,
                error: 'Employee Id is already in use',
            });
        }

        // Create the contact
        const insertContactQuery = `
            INSERT INTO contacts (Employee_Name, Employee_Id, Department, Email_Id, Contact_No, Laptop, Serial_No, HandoverDate, Status, Remarks)
            VALUES (:Employee_Name, :Employee_Id, :Department, :Email_Id, :Contact_No, :Laptop, :Serial_No, :HandoverDate, :Status, :Remarks)
        `;

        const insertContactOptions = {
            Employee_Name,
            Employee_Id,
            Department,
            Email_Id,
            Contact_No,
            Laptop,
            Serial_No,
            HandoverDate,
            Status,
            Remarks,
        };

        const insertContactResult = await connection.execute(insertContactQuery, insertContactOptions, {
            autoCommit: true,
        });

        await connection.close();

        if (insertContactResult.rowsAffected === 1) {
            const contactData = {
                Employee_Name,
                Employee_Id,
                Department,
                Email_Id,
                Contact_No,
                Laptop,
                Serial_No,
                HandoverDate,
                Status,
                Remarks,
            };
            return response.status(200).json({ status: 'SUCCESS', data: contactData });
        } else {
            return response.status(500).json({
                status: 'FAILED',
                data: null,
                error: 'Failed to insert the contact',
            });
        }
    } catch (error: any) {
        return response.status(500).json({
            status: 'FAILED',
            data: null,
            error: error.message,
        });
    }
};
export const updateAContact = async (request: Request, response: Response) => {
    try {
        // Get the Employee_Id from the request parameters
        const { Employee_Id } = request.params;
        // Check if Employee_Id is provided
        if (!Employee_Id) {
            return response.status(400).json({ message: 'Employee_Id is required' });
        }

        // Get the updated contact data from the request body
        const { Employee_Name, Department, Email_Id, Contact_No, Laptop, Serial_No, HandoverDate, Status, Remarks } = request.body;
       

        const pool = await getDBPool();
        const connection = await pool.getConnection();

        // Check if the contact exists
        const checkContactSQL = 'SELECT * FROM contacts WHERE Employee_Id = :Employee_Id';
        const checkContactResult: any = await connection.execute(checkContactSQL, { Employee_Id });

        if (checkContactResult.rows.length === 0) {
            await connection.close();
            return response.status(404).json({ message: 'Contact not found' });
        }

        // Create an SQL UPDATE statement to update the contact
        const updateSQL = `
            UPDATE contacts
            SET Employee_Name = :Employee_Name,
                Department = :Department,
                Email_Id = :Email_Id,
                Contact_No = :Contact_No,
                Laptop = :Laptop,
                Serial_No = :Serial_No,
                HandoverDate = :HandoverDate,
                Status = :Status,
                Remarks = :Remarks
            WHERE Employee_Id = :Employee_Id
        `;

        const bindVars = {
            Employee_Id,
            Employee_Name,
            Department,
            Email_Id,
            Contact_No,
            Laptop,
            Serial_No,
            HandoverDate,
            Status,
            Remarks
        };

        // Execute the UPDATE query
        await connection.execute(updateSQL, bindVars, { autoCommit: true });
        await connection.close();

        return response.status(200).json({ message: 'Contact updated successfully' });
    } catch (error: any) {
        return response.status(500).json({ message: 'Internal server error', error: error.message });
    }
};



