import usermodel from "../models/usermodel.js"
import Dotenv from 'dotenv'
import pkg from 'jsonwebtoken';
import {
    comparePassword,
    hashPassword
} from "../helpers/authhelper.js"
import ordermodel from "../models/ordermodel.js";
Dotenv.config()
export const registerController = async (req, res) => {

    try {
        const {
            name,
            email,
            address,
            password,
            phone,
            role,
            secretAnswer
        } = req.body

        //validations
        if (!name) {
            return res.send({message: 'Name is required'})
        }
        if (!email) {
            return res.send({message: 'email is required'})
        }
        if (!password) {
            return res.send({message: 'password is required'})
        }
        if (!phone) {
            return res.send({message: 'phone is required'})
        }
        if (!address) {
            return res.send({message: 'address is required'})
        }
        if (!secretAnswer) {
            return res.send({message: 'secretAnswer is required'})
        }

        //existing user
        const existinguser = await usermodel.findOne({
            email
        })
        if (existinguser) {
            return res.status(200).send({
                success: false,
                message: 'Already registered please login'
            })
        }
        //Registerin user
        const hashedPassword = await hashPassword(password)
        const user = await new usermodel({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            role,
            secretAnswer
        }).save()
        return res.status(201).send({
            success: true,
            message: "User registered",
            user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            error
        })
    }
}
export const loginController = async (req, res) => {
    const {
        sign
    } = pkg
    try {
        const {
            email,
            password
        } = req.body
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid email and password"
            })
        }

        //check user
        const user = await usermodel.findOne({
            email
        })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email not registered"
            })
        }
        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.status(404).send({
                success: false,
                message: "Invalid Password"
            })
        }
        //token
        const token = sign({
            id: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        })

        console.log(token)


        res.status(200).send({
            success: true,
            message: "Logged in successfully",
            user: {
                _id:user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                token: token,
                address:user.address,
                role: user.role,
                password:user.password
            },
            token:token
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error
        })
    }
}
//Forgot Password Controller

export const forgotpasswordController = async(req,res)=>{
    try {
        const {email,secretAnswer,newPassword} = req.body
        if(!email){
            res.send({message:'Email is required'})
        }
        if(!secretAnswer){
            res.send({message:'secretAnswer is required'})
        }
        if(!newPassword){
            res.send({message:'newPassword is required'})
        }
        const user = await usermodel.findOne({email,secretAnswer})
        if(!user){
          return  res.status(404).send({message:'Email is not registered'})
        }
        const hashed = await hashPassword(newPassword)

        await usermodel.findByIdAndUpdate(user._id,{password:hashed})

        res.status(200).send({
            success:true,
            message:'Password changed Successfully'
        })

    } catch (error) {
        console.log(error)
         res.status(500).send({
            success:false,
            message:'Something went wrong',
           
        })
    }
}

//testing controller

export const testController = (req, res) => {

    res.send("Protected routes")
}

//User update Controller

export const userupdateController = async(req,res)=>{
    try {
        const { name, email, id,password, address, phone } = req.body;
        const user = await usermodel.findById(id)
        console.log(user)
        //password
        if (password && password.length < 4) {
          return res.json({ error: "Passsword is required and 4 character long" });
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await usermodel.findByIdAndUpdate(
          user._id,
          {
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address,
          },
          { new: true }
        );
        res.status(200).send({
          success: true,
          message: "Profile Updated SUccessfully",
          updatedUser,
        });
      } catch (error) {
        console.log(error);
        res.status(400).send({
          success: false,
          message: "Error WHile Update profile",
          error,
        });
      }
    };


    //get orders

    export const getordersController = async(req,res)=>{
        try {
            const id = req.params.id
            const orders = await ordermodel.find({buyer:id}).populate("products","-image").populate("buyer","name") .sort({ createdAt: "-1" });
            res.json(orders);
        } catch (error) {
            console.log(error)
            res.status(500).send({
                success:false,
                message:"Error while getting orders",
                error
            })
        }
    }


    //get all orders

    export const getallordersController = async(req,res)=>{
        try {
            const id = req.params.id
            const orders = await ordermodel.find({}).populate("products","-image").populate("buyer","name") .sort({ createdAt: "-1" });
            res.json(orders);
        } catch (error) {
            console.log(error)
            res.status(500).send({
                success:false,
                message:"Error while getting orders",
                error
            })
        }
    }

    //Update order status


    export const updateorderstatusController = async(req,res)=>{

        try {
            const {id}  = req.params
            const {status} = req.body
            console.log(id)
            console.log(status)
            const data = await ordermodel.findByIdAndUpdate(id,{status},{new:true})
            res.json(data)
        } catch (error) {
            res.status(500).send({
                success:false,
                message:"Error while updating status",
                error
            })
            console.log(error)
        }
    }

    //getting the users list 

    export const userinfocontroller = async(req,res)=>{
        try {
            const userinfo = await usermodel.find({})
            res.status(200).send({
                success:true,
                message:"user details",
               userinfo
               })
        } catch (error) {
            res.status(500).send("Failure")
        }
    }