import express, { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { env } from "./config/environment";
import { errorHandler } from "./utils/Error/Error.handler";
import { LoggerService } from "./utils/Logger.util";
import { ApiError } from "./utils/Error/ApiError";
import { initRoutes } from "./routes/main";
import { redisService } from "./redis/redis.service";
import { RedisError } from "./utils/Error/RedisError";

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

initRoutes(app);

app.use(async (req: Request, res: Response, next: NextFunction) => {
    if (!await redisService.healthCheck()) {
        res.status(404).json({ message: `Redis is not available` });
        next(new RedisError(404, `Redis is not available`));
    }
    res.status(404).json({ message: `Route not found` });
    next(new ApiError(404, `Route not found`));
});

app.use(errorHandler);

app.get("/", (req: Request, res: Response) => {
    res.send("SentinelAPI Core is Running");
});

const PORT: number = env.PORT;
const server = app.listen(PORT, async () => {
    await redisService.initializeRules();
    logger.info(`Server running on port ${PORT}`);
});

process.on('SIGTERM', async () => {
    console.debug('SIGTERM signal received: closing HTTP server');
    await redisService.close();
    server.close(() => {
      console.debug('HTTP server closed')
    })
  })