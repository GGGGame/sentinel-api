import express, { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { env } from "./config/environment";
import { errorHandler } from "./utils/Error/Error.handler";
import { userRoutes } from './routes/userRoutes';
import { LoggerService } from "./utils/Logger.util";
import { ApiError } from "./utils/Error/ApiError";

const logger = LoggerService.getInstance();
const app = express();

app.use(express.json());
app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later."
});
app.use(limiter);

app.use('/api', userRoutes);
app.use((req, res, next) => {
    throw new ApiError(404, `Route not found`);
});

app.use(errorHandler);

app.get("/", (req: Request, res: Response) => {
    res.send("SentinelAPI Core is Running");
});

const PORT: number = env.PORT;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});