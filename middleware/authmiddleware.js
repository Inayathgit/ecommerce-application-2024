import pkg from 'jsonwebtoken';
import usermodel from "../models/usermodel.js"
const {
    verify
} = pkg;


export const requireSignin = async (req, res, next) => {

    try {
        const decode = verify(req.headers.authorization, process.env.JWT_SECRET)
        req.user = decode
       
        next()
    } catch (error) {
        console.log(error)

    }

}


export const isAdmin = async (req, res, next) => {
    try {

        const user = await usermodel.findById(req.user.id)

        if (user.role !== 1) {
            return res.status(200).send({
                success: false,
                message: "Unauthorized access"
            })
        } else {
            next()
        }

    } catch (error) {
        console.log(error)
        res.status(404).send({
            success: false,
            error
        })

    }
}