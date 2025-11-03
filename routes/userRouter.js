import express from 'express';
import { register, login, logout } from '../controller/user.js';

const router = express.Router();

// register a new user
router.post('/register', register);

// login
router.post('/login', login);

// logout
router.get('/logout', logout);

export default router;