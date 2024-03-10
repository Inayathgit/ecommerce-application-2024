import express from 'express'
import { deleteorderController } from '../controller/orderController.js';

const router = express.Router();


router.get('/deleteorder/:id',deleteorderController)


export default router