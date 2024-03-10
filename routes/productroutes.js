import express from 'express'
import { isAdmin, requireSignin } from '../middleware/authmiddleware.js'
import { braintreepaymentController, braintreetokenController, createproductController, deleteproductController, filterproductController, getproductController, productcategoryController, productcountController, productimageController, productlistcountController, relatedproductController, searchproductController, singleproductController, updateproductController } from '../controller/productController.js'
import ExpressFormidable from 'express-formidable'

const router = express.Router()

//Create-Product Route

router.post('/create-product',requireSignin,ExpressFormidable(),isAdmin,createproductController)

//Get Product Route

router.get('/get-product',getproductController)

//get Single Product Route

router.get('/getsingle-product/:id',singleproductController)

//get Photo Route

router.get('/getimage-product/:iid' ,productimageController)

//update product Route

router.put('/update-product/:id',updateproductController)

//delete product Route

router.delete('/delete-product/:id',deleteproductController)

// filter product

router.post('/filter-product',filterproductController)


// Product Count

router.get('/product-count',productcountController)

//List count

router.get('/productlist-count/:page',productlistcountController)

//search product

router.get('/search/:keyword',searchproductController)

//related product

router.get('/relatedproduct/:pid/:cid',relatedproductController)


//product category

router.get('/productcategory/:slug',productcategoryController)

//gateway routes 
//token

router.get('/gateway/token',braintreetokenController)

//payments

router.post('/gateway/payment/:id',requireSignin,braintreepaymentController)




export default router