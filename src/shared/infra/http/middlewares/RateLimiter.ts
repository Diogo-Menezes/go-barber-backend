import {Request, Response, NextFunction} from 'express';
import {RateLimiterRedis} from 'rate-limiter-flexible';
import redis from 'redis'
import AppError from "@shared/errors/AppError";

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  enable_offline_queue: false,
})

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rateLimit',
  points: 5, // 5 requests
  duration: 1, // per 1 second by IP
});


export default async function rateLimit(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    await rateLimiter.consume(request.ip)
    return next();
  } catch (e) {
    throw new AppError('Too Many Requests', 429)
  }


};
