import express from 'express'
import {
    loginController,
    registerController,
    testController,
    forgotpasswordController,
    userupdateController,
    getordersController,
    getallordersController,
    updateorderstatusController,
    userinfocontroller
} from '../controller/authController.js'
import {
    isAdmin,
    requireSignin
} from '../middleware/authmiddleware.js'
//Router object
const router = express.Router()


//Register post method
router.post('/register', registerController)
//Login post method
router.post('/login', loginController)

//Forgot Password post method

router.post('/forgot-password',forgotpasswordController)

router.get('/test', requireSignin, isAdmin, testController)


//Private Route for user DashBoard
router.get('/user-auth',requireSignin,(req,res)=>{
    res.status(200).send({ok:true})
})

//Private Route for Admin DashBoard

router.get('/admin-auth',requireSignin,isAdmin,(req,res)=>{
    res.status(200).send({ok:true})
})

//update user details router

router.put('/user-update',requireSignin,userupdateController)



//orders

router.get('/getorders/:id',requireSignin,getordersController)

//all orders

router.get('/getallorders/:id',requireSignin,isAdmin,getallordersController)

//update order status


router.put('/updateorderstatus/:id',requireSignin,isAdmin,updateorderstatusController)

//getting users list

router.get('/usersinfo',userinfocontroller)

export default router