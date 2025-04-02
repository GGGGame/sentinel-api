import dotenv from "dotenv";
dotenv.config();

export const env = {
    PORT: parseInt(process.env.PORT || '3000', 10),

    DATABASE_URL: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/table',
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',

    JWT_SECRET: process.env.JWT_SECRET || 'test',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h'
};