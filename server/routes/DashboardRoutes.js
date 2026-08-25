import { Router } from "express";

import { protect } from "../middleware/Auth.js";
import { getDashboard } from "../controllers/DashboardController.js";



const dashboardRoutes = Router();

dashboardRoutes.get(
    "/",
    protect,
    getDashboard
);

export default dashboardRoutes;