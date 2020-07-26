import {Request, Response} from 'express';
import {container} from 'tsyringe';

import AuthenticationUserService from '@modules/users/services/AuthenticationUserService';
import {classToClass, classToPlain} from 'class-transformer';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {email, password} = request.body;

    const authenticate = container.resolve(AuthenticationUserService);

    const {user, token} = await authenticate.execute({email, password});

    return response.json({user: classToPlain(user), token});

  }
}
