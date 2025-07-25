import express from 'express';
import { dashBoard } from '../controllers/admin.controller.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const router = express.Router();

router.route('/dashboard').get(isAuthenticated, dashBoard);

export default router;