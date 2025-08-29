import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import AuthService from '../services/auth-service.js';

const router = Router();
const authService = new AuthService();

router.post('/register', async (req, res) => {
  try {
    const result = await authService.registerAsync(req.body);
    res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const result = await authService.loginAsync(req.body);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message });
  }
});

router.post('/logout', (_req, res) => {
  res.status(StatusCodes.OK).json({ message: 'Logged out' });
});

router.get('/user', async (req, res) => {
  const { email } = req.query;
  try {
    const user = await authService.getUserByEmailAsync(email);
    res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
  }
});

export default router;
