import express from 'express'
import { requireSignin } from "../middleware/authmiddleware.js";
import { categoryimageController, createcategoryController, imagecategoryController } from '../controller/categoryController.js';
import { isAdmin } from '../middleware/authmiddleware.js';
import { updatecategoryController } from '../controller/categoryController.js';
import { getcategoriesController } from '../controller/categoryController.js';
import { singlecategoryController } from '../controller/categoryController.js';
import { deletecategoryController } from '../controller/categoryController.js';
import ExpressFormidable from 'express-formidable'
const router = express.Router();


//Create-Category Route


router.post('/create-category',requireSignin,isAdmin,ExpressFormidable(),createcategoryController)

//Update-Category Route,

router.put('/update-category/:id',requireSignin,isAdmin,ExpressFormidable(),updatecategoryController)

//image-Category Route,

router.post('/image-category/:id',requireSignin,isAdmin,ExpressFormidable(),imagecategoryController)
//get-categories Route

router.get('/get-categories',getcategoriesController)

//single-category Route

router.get('/single-category/:slug',singlecategoryController)

//delete-category Route

router.delete('/delete-category/:id',requireSignin,isAdmin,deletecategoryController)
//get category Photo Route

router.get('/getimage-category/:iid' ,categoryimageController)

export default router