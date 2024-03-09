import express from 'express';
import { login, register, refresh, logout } from '../controllers/authController';
import { loginWithGoogle } from '../controllers/googleAuthController';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/refresh', refresh);
router.get('/logout', logout);
router.post('/oauth', loginWithGoogle);
export default router;
