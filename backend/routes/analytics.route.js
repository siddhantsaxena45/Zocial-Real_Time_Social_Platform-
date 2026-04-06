import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getUserAnalytics, getGlobalEngagementStats, exportUserLedger } from "../controllers/analytics.controller.js";

const router = express.Router();

// Using standard .get to avoid any weird path matching issues
router.get("/user-stats", isAuthenticated, getUserAnalytics);
router.get("/engagement-stats", isAuthenticated, getGlobalEngagementStats);
router.get("/export-ledger", isAuthenticated, exportUserLedger);

export default router;
