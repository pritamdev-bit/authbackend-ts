import express from 'express';
import AuthenticationController from './controller.js';

const authenticationController = new AuthenticationController()

export const authRouter = express.Router();

authRouter.post('/sign-up', authenticationController.handleSignup.bind(authenticationController));
authRouter.post('/sign-in', authenticationController.handleSignin.bind(authenticationController));