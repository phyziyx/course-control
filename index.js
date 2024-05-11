import express from "express";
import cors from "cors";
import indexRouter from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/', indexRouter);

app.listen(PORT, () => console.log(`Server is listening in http://localhost:${PORT}`));
