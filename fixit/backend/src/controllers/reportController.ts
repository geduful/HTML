import { Request, Response, NextFunction } from "express";
import { checkEscalation } from "../services/escalationEngine";

interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  imageUrl: string | null;
  status: string;
  isEscalated: boolean;
  votes: number;
  escalatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

const reports: Report[] = [];
let idCounter = 1;

export const getAllReports = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    for (const report of reports) {
      if (report.status === "REPORTED" || report.status === "REJECTED") {
        await checkEscalation(report);
      }
    }
    res.json({ reports });
  } catch (err) {
    next(err);
  }
};

export const getReportById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const report = reports.find((r) => r.id === req.params.id);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }
    if (report.status === "REPORTED" || report.status === "REJECTED") {
      await checkEscalation(report);
    }
    res.json({ report });
  } catch (err) {
    next(err);
  }
};

export const createReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, category, location, latitude, longitude, imageUrl } = req.body;

    if (!title || !description || !category || !location) {
      return res
        .status(400)
        .json({ error: "Missing required fields: title, description, category, location" });
    }

    const report: Report = {
      id: String(idCounter++),
      title,
      description,
      category,
      location,
      latitude: latitude || null,
      longitude: longitude || null,
      imageUrl: imageUrl || null,
      status: "REPORTED",
      isEscalated: false,
      votes: 0,
      escalatedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    reports.push(report);
    res.status(201).json({ report });
  } catch (err) {
    next(err);
  }
};

export const updateReportStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const report = reports.find((r) => r.id === req.params.id);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    const { status } = req.body;
    const validStatuses = ["REPORTED", "IN_PROGRESS", "RESOLVED", "REJECTED"];

    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
    }

    report.status = status;
    report.updatedAt = new Date().toISOString();

    if (status === "REJECTED") {
      await checkEscalation(report);
    }

    res.json({ report });
  } catch (err) {
    next(err);
  }
};

export const upvoteReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const report = reports.find((r) => r.id === req.params.id);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    report.votes += 1;
    report.updatedAt = new Date().toISOString();

    res.json({ report });
  } catch (err) {
    next(err);
  }
};

export { Report };
