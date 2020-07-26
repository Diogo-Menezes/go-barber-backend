import {Router} from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from "@modules/appointments/infra/http/controllers/ProvidersController";
import ProviderMonthAvailabilityController
  from "@modules/appointments/infra/http/controllers/ProviderMonthAvailabilityController";
import ProviderDayAvailabilityController
  from "@modules/appointments/infra/http/controllers/ProviderDayAvailabilityController";
import {celebrate, Joi, Segments} from "celebrate";

const providersRouter = Router();
const providersController = new ProvidersController();
const monthAvailabilityController = new ProviderMonthAvailabilityController();
const dayAvailabilityController = new ProviderDayAvailabilityController();

providersRouter.use(ensureAuthenticated);

providersRouter.get('/', providersController.index);

providersRouter.get('/:provider_id/monthAvailability', celebrate({
  [Segments.PARAMS]: {
    provider_id: Joi.string().uuid().required(),
  },
}), monthAvailabilityController.index);

providersRouter.get('/:provider_id/dayAvailability', celebrate({
  [Segments.PARAMS]: {
    provider_id: Joi.string().uuid().required(),
  },
}), dayAvailabilityController.index);


export default providersRouter;
