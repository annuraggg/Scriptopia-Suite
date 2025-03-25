import { Hono } from "hono";
import companyController from "../controllers/campus/companyProfile/companyProfile";

const app = new Hono();

app.get("/", companyController.getCompanies);
app.post("/create", companyController.createCompany);
app.put("/update", companyController.updateCompany);
app.post("/archive", companyController.archiveCompany);
app.delete("/:id", companyController.deleteCompany);

export default app;