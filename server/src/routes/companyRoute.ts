import { Hono } from "hono";
import companyController from "../controllers/campus/company/companyController";

const app = new Hono();

app.get("/", companyController.getCompanies);
app.get("/:id", companyController.getCompany);
app.post("/create", companyController.createCompany);
app.put("/update", companyController.updateCompany);
app.post("/archive", companyController.archiveCompany);
app.delete("/:id", companyController.deleteCompany);

export default app;