import mongoose,{ mongo } from "mongoose";


const Categorymodel = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    slug:{
        type:String
    },
    image:{
        data:Buffer,
        contentType: String
       }
})

export default mongoose.model('category',Categorymodel)