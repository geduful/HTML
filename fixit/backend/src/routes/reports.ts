import { Router } from "express";
import * as reportController from "../controllers/reportController";

const router = Router();

router.get("/", reportController.getAllReports);
router.get("/:id", reportController.getReportById);
router.post("/", reportController.createReport);
router.patch("/:id/status", reportController.updateReportStatus);
router.post("/:id/vote", reportController.upvoteReport);

export default router;
