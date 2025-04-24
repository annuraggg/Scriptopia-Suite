import { Hono } from "hono";
import companyController from "../controllers/campus/company/companyController";
import companyAnalyticsController from "@/controllers/campus/company/companyAnalyticsController";

const app = new Hono();

app.get("/", companyController.getCompanies);
app.get("/:id", companyController.getCompany);
app.post("/create", companyController.createCompany);
app.put("/update", companyController.updateCompany);
app.post("/archive", companyController.archiveCompany);
app.delete("/:id", companyController.deleteCompany);

app.get("/analytics/:id", companyAnalyticsController.getCompanyAnalytics);
app.get("/analytics/hiring-trends/:id", companyAnalyticsController.getCompanyHiringTrends);
app.get("/analytics/skill-demand/:id", companyAnalyticsController.getCompanySkillDemand);
app.get("/analytics/candidate-sources/:id", companyAnalyticsController.getCompanyCandidateSources);
export default app;