import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import reportRoutes from "./routes/reports";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "fixit-backend" });
});

app.use("/api/reports", reportRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Fixit backend running on http://localhost:${PORT}`);
});

export default app;
