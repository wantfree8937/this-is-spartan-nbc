import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 5555;
export const HOST = process.env.HOST || '127.0.0.1';
export const CLIENT_VERSION = process.env.CLIENT_VERSION || '1.0.0';

export const DB1_NAME = process.env.DB1_NAME || 'database1';
export const DB1_USER = process.env.DB1_USER || 'user1';
export const DB1_PASSWORD = process.env.DB1_PASSWORD || 'password1';
export const DB1_HOST = process.env.DB1_HOST || 'localhost';
export const DB1_PORT = process.env.DB1_PORT || 3306;

export const DB2_NAME = process.env.DB2_NAME || 'database2';
export const DB2_USER = process.env.DB2_USER || 'user2';
export const DB2_PASSWORD = process.env.DB2_PASSWORD || 'password2';
export const DB2_HOST = process.env.DB2_HOST || 'localhost';
export const DB2_PORT = process.env.DB2_PORT || 3306;

export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = process.env.REDIS_PORT;
export const REDIS_USER = process.env.REDIS_USER;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
