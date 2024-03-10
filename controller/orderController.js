import ordermodel from "../models/ordermodel.js";



export const deleteorderController = async(req,res)=>{
    
        try {
            const id = req.params.id;
            console.log(id);
           const order = await ordermodel.findByIdAndDelete(id)
            
           res.status(200).send({
            success:true,
            message:"order deleted successfully",
            order
           })
        } catch (error) {
            console.log(error)
            res.status(500).send({
                success:false,
                error
            })
        }
    }