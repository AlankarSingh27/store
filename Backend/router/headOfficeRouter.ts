import {Router, Request, Response} from 'express';
import * as contactController from '../controller/headofficeController';
import {body} from 'express-validator';
const headOfficeRouter: Router = Router();
headOfficeRouter.get("/",  async (request: Request, response: Response) => {
    await contactController.getAllContacts(request, response);
});



 headOfficeRouter.get("/:Employee_Id", async (request: Request, response: Response) => {
    await contactController.getAContact(request, response);
});


headOfficeRouter.post("/", [
    body('Employee_Name').not().isEmpty().withMessage("Employee Name is Required"),
    body('Employee_Id').not().isEmpty().withMessage("Employee Id is Required"),
    body('Department').not().isEmpty().withMessage("Department is Required"),
    body('Email_Id').not().isEmpty().withMessage("Email Id is Required"),
    body('Laptop').not().isEmpty().withMessage("Laptop is Required"),
    body('Serial_No').not().isEmpty().withMessage("Serial No is Required"),
    body('HandoverDate').not().isEmpty().withMessage("HandoverDate is Required"),
    body('Status').not().isEmpty().withMessage("Status is Required"),
    body('Remarks').not().isEmpty().withMessage("Remarks is Required")
], async (request: Request, response: Response) => {
    await contactController.createContact(request, response);
});

headOfficeRouter.put("/:Employee_Id", [
    body('Employee_Name').not().isEmpty().withMessage("Employee Name is Required"),
    body('Employee_Id').not().isEmpty().withMessage("Employee Id is Required"),
    body('Department').not().isEmpty().withMessage("Department is Required"),
    body('Email_Id').not().isEmpty().withMessage("Email Id is Required"),
    body('Laptop').not().isEmpty().withMessage("Laptop is Required"),
    body('Serial_No').not().isEmpty().withMessage("Serial No is Required"),
    body('HandoverDate').not().isEmpty().withMessage("HandoverDate is Required"),
    body('Status').not().isEmpty().withMessage("Status is Required"),
    body('Remarks').not().isEmpty().withMessage("Remarks is Required")
], async (request: Request, response: Response) => {
    await contactController.updateAContact(request, response);
});
export default headOfficeRouter;