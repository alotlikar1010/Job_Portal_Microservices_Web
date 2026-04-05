import express from "express";
import router from "./routes/auth.js"
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', router);

export default app;