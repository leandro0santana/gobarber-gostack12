import { Router } from 'express';

import ForgotPasswordContoller from '../controllers/ForgotPasswordContoller';
import ResetPasswordController from '../controllers/ResetPasswordContoller';

const passwordRouter = Router();
const forgotPasswordContoller = new ForgotPasswordContoller();
const restPasswordContoller = new ResetPasswordController();


passwordRouter.post('/forgot', forgotPasswordContoller.create);
passwordRouter.post('/reset', restPasswordContoller.create);

export default passwordRouter;
