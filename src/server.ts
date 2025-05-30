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
app.register(require('@fastify/cors'), {
    origin: '*',
});

initRoutes(app);

app.setNotFoundHandler(async (req: FastifyRequest, res: FastifyReply) => {
    if (!await redisService.healthCheck()) {
        await res.code(404).send({ message: `Redis is not available` });
        throw new RedisError(404, `Redis is not available`);
    }
    await res.code(404).send({ message: `Route not found` });
    throw new ApiError(404, `Route not found`);
});

app.setErrorHandler(errorHandler);

app.get("/", async (req: FastifyRequest, res: FastifyReply) => {
    await res.send("SentinelAPI Core is Running");
});

const PORT: number = env.PORT;
const HOST: string = env.HOST;

const start = async () => {
    try {
        await redisService.initializeRules();
        app.listen({ port: 3030, host: HOST }, (err, address) => {
            if (err) {
                logger.error(err.message)
                process.exit(1)
            }
        });
        logger.info(`Server running on port ${PORT}`);
    } catch (error) {
        logger.error(error.message);
        process.exit(1)
    }
}

start();

process.on('SIGTERM', async () => {
    logger.debug('SIGTERM signal received: closing HTTP server');
    await redisService.close();
    await app.close();
    logger.debug('HTTP server closed');
});
