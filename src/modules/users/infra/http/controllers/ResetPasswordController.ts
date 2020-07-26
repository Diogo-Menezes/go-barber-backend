import {container} from 'tsyringe';
import {Request, Response} from 'express';
import ResetPasswordService from "@modules/users/services/ResetPasswordService";

export default class ResetPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {token, password} = request.body;

    const resetPasswordService = container.resolve(ResetPasswordService);

    const user = await resetPasswordService.execute({password, token})

    console.log(user)

    return response.status(204).send()

  }
}
