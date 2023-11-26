import express from "express";
import "express-async-errors";
import router from "./routes/route";
import { errorHandler } from "./err/errorHandler";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/", router);
app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
