import express from 'express';
import { login, register, refresh, logout, verifyOTP, regenerateOTP, createDataDiri } from '../controllers/authController';
import { loginWithGoogle } from '../controllers/googleAuthController';


const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/refresh', refresh);
router.get('/logout', logout);
router.post('/oauth', loginWithGoogle);
router.post('/verify-otp', verifyOTP);
router.post('/regenerate-otp', regenerateOTP);
router.post('/create-data-diri', createDataDiri);
export default router;
