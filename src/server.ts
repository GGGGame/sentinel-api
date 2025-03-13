import express, { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { env } from "./config/environment";

const app = express();
app.use(express.json());
app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later."
});
app.use(limiter);

app.get("/", (req: Request, res: Response) => {
    res.send("SentinelAPI Core is Running");
});

const PORT: number = env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});