import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { env } from "./config/environment";
import { errorHandler } from "./utils/Error/Error.handler";
import { LoggerService } from "./utils/Logger.util";
import { ApiError } from "./utils/Error/ApiError";
import { initRoutes } from "./routes/main";
import { redisService } from "./redis/redis.service";
import { RedisError } from "./utils/Error/RedisError";
import fastifyHelmet from "@fastify/helmet";

const logger = LoggerService.getInstance();
const app: FastifyInstance = fastify({
    logger: false,
    disableRequestLogging: true
});

app.register(fastifyHelmet);

initRoutes(app);

app.setNotFoundHandler(async (req: FastifyRequest, res: FastifyReply) => {
    if (!await redisService.healthCheck()) {
        res.code(404).send({ message: `Redis is not available` });
        throw new RedisError(404, `Redis is not available`);
    }
    res.code(404).send({ message: `Route not found` });
    throw new ApiError(404, `Route not found`);
});

app.setErrorHandler(errorHandler);

app.get("/", (req: FastifyRequest, res: FastifyReply) => {
    res.send("SentinelAPI Core is Running");
});

const PORT: number = env.PORT;

const start = async () => {
    try {
        await redisService.initializeRules();
        await app.listen({ port: PORT});
        logger.info(`Server running on port ${PORT}`);
    } catch (error) {
        app.log.error(error);
        process.exit(1)
    }
}

start();

process.on('SIGTERM', async () => {
    console.debug('SIGTERM signal received: closing HTTP server');
    await redisService.close();
    await app.close();
    console.debug('HTTP server closed');
});