import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import oracledb from 'oracledb';
import headOfficeRouter from './router/headOfficeRouter';
import branchRouter from './router/branchRouter';
import  {initializeDB}  from './util/DBUtil';
const app: Application = express();

// Configure CORS
app.use(cors());

// Configure express to parse JSON data
app.use(express.json());

// Configure dotenv to load environment variables from .env file
dotenv.config({
    path: './.env'
});

const port: string | number = process.env.PORT || 9000;

app.get('/', (request: Request, response: Response) => {
    response.status(200).json({
        msg: 'Welcome to Express Server'
    });
});

// Set up Oracle database connection
const dbConfig: oracledb.ConnectionAttributes = {
    user: process.env.ORACLE_DB_USER,
    password: process.env.ORACLE_DB_PASSWORD,
    connectString: process.env.ORACLE_DB_CONNECT_STRING,
};
initializeDB();


app.use("/headOffice", headOfficeRouter);
 app.use("/branches",branchRouter);


async function connectToOracle() {
    let connection;
    try {
      // Switch to Thick mode
      await oracledb.initOracleClient();
      connection = await oracledb.getConnection(dbConfig);
      console.log('Connection was successful!');
      await connection.close();
      console.log('Released Oracle DB connection');
    } catch (error: any) {
      console.error('Error connecting to Oracle DB:', error.message);
      process.exit(1); 
    }
  }

if (port) {
    connectToOracle().then(() => {
        app.listen(Number(port), () => {
            console.log(`Express Server is started at ${port}`);
        });
    });
}
