import express from "express";
import "express-async-errors";
import router from "./routes/route";
import { errorHandler } from "./err/errorHandler";
import cookieParser from "cookie-parser";
import { json, urlencoded } from "body-parser";

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/", router);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
