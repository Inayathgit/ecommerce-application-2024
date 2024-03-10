import mongoose from "mongoose";
import  dotenv from "dotenv";
dotenv.config()
// const mongoURI = process.env.MONGOURL

const connecttoDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`Connected to mongoo DB successfully ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error in MongooDB  ${error}`)
    }
}

export default connecttoDB