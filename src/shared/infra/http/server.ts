import 'reflect-metadata';
import 'dotenv/config';
import express, {Request, Response, NextFunction} from 'express';
import cors from 'cors';
import 'express-async-errors';

import rateLimit from "@shared/infra/http/middlewares/RateLimiter";
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';

import routes from './routes';
import '@shared/infra/typeorm';
import '@shared/container'
import {errors} from "celebrate";

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadDir));
app.use(rateLimit);
app.use(routes);
app.use(errors());

app.use(
  (error: Error, request: Request, response: Response, _: NextFunction) => {
    console.log(error)
    if (error instanceof AppError) {
      return response
        .status(error.statusCode)
        .json({status: 'error', message: error.message});
    }

    return response
      .status(500)
      .json({status: 'error', message: 'Internal server error'});
  },
);

app.listen(3333, () => {
  console.log('✅ Server started in port 3333');
});
