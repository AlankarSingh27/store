
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { getDBPool } from '../util/DBUtil';


// export const getAllBranches = async (request: Request, response: Response) => {
//     try {
      
//         const pool = await getDBPool();
//         const connection = await pool.getConnection();
//         // Create a SQL SELECT statement
//         const selectSQL = 'SELECT * FROM branches';
//         const result = await connection.execute(selectSQL);

//         return response.status(200).json(result.rows);
//     } catch (error:any) {
//         return response.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// };
// export const getABranch = async (request: Request, response: Response) => {
//     try {
//         // Get the Employee_Id from the request parameters
//         const { Person_Contact } = request.params;
        
//         // Check if Employee_Id is provided
//         if (!Person_Contact) {
//             return response.status(400).json({ message: 'Employee_Id is required' });
//         }

//         const pool = await getDBPool();
//         const connection = await pool.getConnection();

//         // Create a SQL SELECT statement
//         const selectSQL = 'SELECT * FROM branches WHERE Person_Contact = :Person_Contact';

//         // Bind Employee_Id to the SELECT statement
//         const bindVars = {
//             Person_Contact,
//         };

//         // Execute the SELECT query
//         const result: any = await connection.execute(selectSQL, bindVars);

//         // Check if a contact was found
//         if (result.rows.length === 0) {
//             return response.status(404).json({ message: 'Branch not found' });
//         }

//         // Return the contact data
//         return response.status(200).json(result.rows[0]);
//     } catch (error: any) {
//         return response.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// };




// export const createBranch = async (request: Request, response: Response) => {
//     const errors = validationResult(request);
//     if (!errors.isEmpty()) {
//         return response.status(400).json({ errors: errors.array() });
//     }

//     try {
//         // Read the form data
//         const {
//             Branches,
//             Contact_Person,
//             Person_Contact,
//             Branch_Address,
//             Laptop_Manufacture,
//             Laptop_SerialNo,
//             Printer_Manufacture,
//             Printer_SerialNo,
//             Status,
//             HandoverDate,
//             Remarks
//         } = request.body;

//         // Get the connection pool from the dbUtil
//         const pool = await getDBPool();
//         const connection = await pool.getConnection();

//         // Check if the Employee_Id already exists
//         const checkMobileQuery = `
//             SELECT Person_Contact
//             FROM branches
//             WHERE Person_Contact = :Person_Contact
//         `;

//         const checkMobileOptions = {
//             Person_Contact,
//         };

//         const checkMobileResult :any= await connection.execute(checkMobileQuery, checkMobileOptions);

//         if (checkMobileResult.rows.length > 0) {
//             await connection.close();
//             return response.status(400).json({
//                 status: 'FAILED',
//                 data: null,
//                 error: 'Person contact is already in use',
//             });
//         }

//         // Create the contact
//         const insertContactQuery = `
//             INSERT INTO branches (Branches, Contact_Person, Person_Contact,  Branch_Address, Laptop_Manufacture, Laptop_SerialNo,Printer_Manufacture , Printer_SerialNo, Status,HandoverDate,Remarks)
//             VALUES (:Branches, :Contact_Person, :Person_Contact, : Branch_Address, :Laptop_Manufacture, :Laptop_SerialNo, :Printer_Manufacture, :Printer_SerialNo,:Status,:HandoverDate,:Remarks)
//         `;

//         const insertContactOptions = {
//             Branches,
//             Contact_Person,
//             Person_Contact,
//             Branch_Address,
//             Laptop_Manufacture,
//             Laptop_SerialNo,
//             Printer_Manufacture,
//             Printer_SerialNo,
//             Status,
//             HandoverDate,
//             Remarks
//         };

//         const insertContactResult = await connection.execute(insertContactQuery, insertContactOptions, {
//             autoCommit: true,
//         });

//         await connection.close();

//         if (insertContactResult.rowsAffected === 1) {
//             const contactData = {
//             Branches,
//             Contact_Person,
//             Person_Contact,
//             Branch_Address,
//             Laptop_Manufacture,
//             Laptop_SerialNo,
//             Printer_Manufacture,
//             Printer_SerialNo,
//             Status,
//             HandoverDate,
//             Remarks
//             };
//             return response.status(200).json({ status: 'SUCCESS',data: contactData  });
//         } else {
//             return response.status(500).json({
//                 status: 'FAILED',
//                 data: null,
//                 error: 'Failed to insert the branch',
//             });
//         }
//     } catch (error: any) {
//         return response.status(500).json({
//             status: 'FAILED',
//             data: null,
//             error: error.message,
//         });
//     }
// };
export const updateABranch = async (request: Request, response: Response) => {
    try {
        // Get the Employee_Id from the request parameters
        const { Person_Contact } = request.params;
        // Check if Employee_Id is provided
        if (!Person_Contact) {
            return response.status(400).json({ message: 'Employee_Id is required' });
        }

        // Get the updated contact data from the request body
        const {   Branches,
            Contact_Person,
            Branch_Address,
            Laptop_Manufacture,
            Laptop_SerialNo,
            Printer_Manufacture,
            Printer_SerialNo,
            Status,
            HandoverDate,
            Remarks 
        } = request.body;
        

        const pool = await getDBPool();
        const connection = await pool.getConnection();

        // Check if the contact exists
        const checkContactSQL = 'SELECT * FROM branches WHERE Person_Contact = :Person_Contact';
        const checkContactResult: any = await connection.execute(checkContactSQL, { Person_Contact});

        if (checkContactResult.rows.length === 0) {
            await connection.close();
            return response.status(404).json({ message: 'Branch not found' });
        }

        // Create an SQL UPDATE statement to update the contact
        const updateSQL = `
            UPDATE branches
            SET Branches =:Branches,
                Contact_Person = :Contact_Person,
                Person_Contact= :Person_Contact,
                Branch_Address = :Branch_Address,
                Laptop_Manufacture= :Laptop_Manufacture,
                Laptop_SerialNo =:Laptop_SerialNo,
                Printer_Manufacture=: Printer_Manufacture,
                Printer_SerialNo=: Printer_SerialNo,
                HandoverDate = :HandoverDate,
                Status = :Status,
                Remarks = :Remarks
            WHERE Person_Contact = :Person_Contact
        `;

        const bindVars = {
            Branches,
            Contact_Person,
            Person_Contact,
            Branch_Address,
            Laptop_Manufacture,
            Laptop_SerialNo,
            Printer_Manufacture,
            Printer_SerialNo,
            Status,
            HandoverDate,
            Remarks 
        };

        // Execute the UPDATE query
        await connection.execute(updateSQL, bindVars, { autoCommit: true });
        await connection.close();

        return response.status(200).json({ message: 'Branch updated successfully' });
    } catch (error: any) {
        return response.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
// import { Request, Response } from 'express';
// import { validationResult } from 'express-validator';
// import { getDBPool } from '../util/DBUtil';

export const getAllBranches = async (request: Request, response: Response) => {
    try {
        const pool = await getDBPool();
        const connection = await pool.getConnection();
        const selectSQL = 'SELECT * FROM branches';
        const result = await connection.execute(selectSQL);
        await connection.close();

        return response.status(200).json(result.rows);
    } catch (error:any) {
        return response.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const getABranch = async (request: Request, response: Response) => {
    try {
        const { Person_Contact } = request.params;

        if (!Person_Contact) {
            return response.status(400).json({ message: 'Person_Contact is required' });
        }

        const pool = await getDBPool();
        const connection = await pool.getConnection();
        const selectSQL = 'SELECT * FROM branches WHERE Person_Contact = :Person_Contact';
        const bindVars = {
            Person_Contact,
        };
        const result: any = await connection.execute(selectSQL, bindVars);
        await connection.close();

        if (result.rows.length === 0) {
            return response.status(404).json({ message: 'Branch not found' });
        }

        return response.status(200).json(result.rows[0]);
    } catch (error:any) {
        return response.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const createBranch = async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }

    try {
        const {
            Branches,
            Contact_Person,
            Person_Contact,
            Branch_Address,
            Laptop_Manufacture,
            Laptop_SerialNo,
            Printer_Manufacture,
            Printer_SerialNo,
            Status,
            HandoverDate,
            Remarks
        } = request.body;

        const pool = await getDBPool();
        const connection = await pool.getConnection();

        const checkMobileQuery = `
            SELECT Person_Contact
            FROM branches
            WHERE Person_Contact = :Person_Contact
        `;

        const checkMobileOptions = {
            Person_Contact,
        };

        const checkMobileResult: any = await connection.execute(checkMobileQuery, checkMobileOptions);

        if (checkMobileResult.rows.length > 0) {
            await connection.close();
            return response.status(400).json({
                status: 'FAILED',
                data: null,
                error: 'Person contact is already in use',
            });
        }

        const insertContactQuery = `
            INSERT INTO branches (Branches, Contact_Person, Person_Contact, Branch_Address, Laptop_Manufacture, Laptop_SerialNo, Printer_Manufacture, Printer_SerialNo, Status, HandoverDate, Remarks)
            VALUES (:Branches, :Contact_Person, :Person_Contact, :Branch_Address, :Laptop_Manufacture, :Laptop_SerialNo, :Printer_Manufacture, :Printer_SerialNo, :Status, :HandoverDate, :Remarks)
        `;

        const insertContactOptions = {
            Branches,
            Contact_Person,
            Person_Contact,
            Branch_Address,
            Laptop_Manufacture,
            Laptop_SerialNo,
            Printer_Manufacture,
            Printer_SerialNo,
            Status,
            HandoverDate,
            Remarks,
        };

        const insertContactResult = await connection.execute(insertContactQuery, insertContactOptions, {
            autoCommit: true,
        });

        await connection.close();

        if (insertContactResult.rowsAffected === 1) {
            const contactData = {
                Branches,
                Contact_Person,
                Person_Contact,
                Branch_Address,
                Laptop_Manufacture,
                Laptop_SerialNo,
                Printer_Manufacture,
                Printer_SerialNo,
                Status,
                HandoverDate,
                Remarks
            };
            return response.status(200).json({ status: 'SUCCESS', data: contactData });
        } else {
            return response.status(500).json({
                status: 'FAILED',
                data: null,
                error: 'Failed to insert the branch',
            });
        }
    } catch (error:any) {
        return response.status(500).json({
            status: 'FAILED',
            data: null,
            error: error.message,
        });
    }
};

// export const updateABranch = async (request: Request, response: Response) => {
//     try {
//         const { Person_Contact } = request.params;

//         if (!Person_Contact) {
//             return response.status(400).json({ message: 'Person_Contact is required' });
//         }

//         const {
//             Branches,
//             Contact_Person,
//             Branch_Address,
//             Laptop_Manufacture,
//             Laptop_SerialNo,
//             Printer_Manufacture,
//             Printer_SerialNo,
//             Status,
//             HandoverDate,
//             Remarks
//         } = request.body;

//         const pool = await getDBPool();
//         const connection = await pool.getConnection();

//         const checkContactSQL = 'SELECT * FROM branches WHERE Person_Contact = :Person_Contact';
//         const checkContactResult: any = await connection.execute(checkContactSQL, { Person_Contact });

//         if (checkContactResult.rows.length === 0) {
//             await connection.close();
//             return response.status(404).json({ message: 'Branch not found' });
//         }

//         const updateSQL = `
//             UPDATE branches
//             SET Branches = :Branches,
//                 Contact_Person = :Contact_Person,
//                 Branch_Address = :Branch_Address,
//                 Laptop_Manufacture = :Laptop_Manufacture,
//                 Laptop_SerialNo = :Laptop_SerialNo,
//                 Printer_Manufacture = :Printer_Manufacture,
//                 Printer_SerialNo = :Printer_SerialNo,
//                 HandoverDate = :HandoverDate,
//                 Status = :Status,
//                 Remarks = :Remarks
//             WHERE Person_Contact = :Person_Contact
//         `;

//         const bindVars = {
//             Branches,
//             Contact_Person,
//             Branch_Address,
//             Laptop_Manufacture,
//             Laptop_SerialNo,
//             Printer_Manufacture,
//             Printer_SerialNo,
//             HandoverDate,
//             Status,
//             Remarks,
//             Person_Contact,
//         };

//         await connection.execute(updateSQL, bindVars, { autoCommit: true });
//         await connection.close();

//         return response.status(200).json({ message: 'Branch updated successfully' });
//     } catch (error:any) {
//         return response.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// };