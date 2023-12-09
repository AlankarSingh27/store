
// import oracledb from 'oracledb';

// export async function createContactTable() {
//     const connection = await oracledb.getConnection();
  
//     await connection.execute(`
//         CREATE TABLE contacts (
//             Employee_Name VARCHAR2(255) NOT NULL,
//             Employee_Id VARCHAR2(255) UNIQUE NOT NULL,
//             Department VARCHAR2(40) NOT NULL,
//             Email_Id VARCHAR2(255) NOT NULL,
//             Contact_No NUMBER(12) UNIQUE NOT NULL,
//             Laptop VARCHAR2(255) NOT NULL,
//             Serial_No VARCHAR2(255) NOT NULL,
//             HandoverDate DATE NOT NULL,
//             Status VARCHAR2(15) NOT NULL,
//             Remarks VARCHAR2(255) NOT NULL
//         )`
//     );

//     await connection.close();
// }
