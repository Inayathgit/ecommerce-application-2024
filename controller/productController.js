import slugify from "slugify"
import productmodel from "../models/productmodel.js"
import fs from 'fs'
import categorymodel from'../models/categorymodel.js'
import braintree from "braintree"
import ordermodel from "../models/ordermodel.js"
import  dotenv from "dotenv";
dotenv.config()

//gateway

var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId:  process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
  });



export const createproductController = async(req,res)=>{

    try {
        const {name,description,price,quantity,category,shipping} =  req.fields
        const {image} = req.files
        
        switch(true){

            case !name: 
                return res.status(401).send({error:"Name is required"})
            case !description: 
                return res.status(401).send({error:"Description is required"})
            case !price: 
                return res.status(401).send({error:"Price is required"})
            case !quantity: 
                return res.status(401).send({error:"Quantity is required"})
            case !category: 
                return res.status(401).send({error:"Category is required"})
            case !image && image>100000: 
                return res.status(401).send({error:"image is required and should be less than 1mb"})
            
        }
        const products = new productmodel({...req.fields,slug:slugify(name)})
        if(image){
            products.image.data = fs.readFileSync(image.path)
            products.image.contentType = image.type
        }
        await products.save()
        res.status(201).send({
            success:true,
            message:'Product created Successfully',
            products
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            error
        })
        
    }

}
//get product Controller

export const getproductController = async(req,res)=>{
    try {
       const products = await productmodel.find({}).populate("category").select("-image").sort({createdAt:-1})

       res.status(200).send({
        success:true,
        message:"All Products",
        products
       })
    } catch (error) {
       console.log(error) 
       return res.status(500).send({
        success:false,
        error
       })
    }

}

//single product Controller

export const singleproductController = async(req,res)=>{
    const id = req.params.id
    console.log(id)
    try {
        const singleProduct = await productmodel.findById(id).select("-image").populate("category")

        res.status(200).send({
            success:true,
            message:"Product fetched Successfully",
            singleProduct
        })
    } catch (error) {
        console.log(error) 
        return res.status(500).send({
         success:false,
         error
        })
    }
}

//get product photo Controller

export const productimageController = async(req,res)=>{
  try {
    const productimage = await productmodel.findById(req.params.iid).select("image")

    if(productimage.image.data){

        res.set("Content-type",productimage.image.contentType)
        res.status(200).send(productimage.image.data)
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({
        success:false,
        error
       })
  }
}

//update product Controller

export const updateproductController = async(req,res)=>{
    const {name,description,price,quantity} = req.body
    const{id} = req.params
    console.log(name)
    try {
        const productupdate = await productmodel.findByIdAndUpdate(id,{name,description,price,quantity,new:true})
        res.status(201).send({
            success:true,
            message:'Product updated successfully'
        })

    
    
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            error
           })
        }
    
}

//delete product Controller

export const deleteproductController = async(req,res)=>{


    try {
        const product = await productmodel.findByIdAndDelete(req.params.id)
        res.status(200).send({
            success:true,
            message:"Product deleted Successfully"

        })
    } catch (error) {
        console.log(error)
    return res.status(500).send({
        success:false,
        error
       })
    }
}

// filter product controller

export const filterproductController = async(req,res)=>{

    

    try {
        const {checked,radio} = req.body
    let args={}

    if(checked.length>0){
        args.category = checked
    }
    if(radio.length){
        args.price = {$gte:radio[0], $lte:radio[1]}
    }

    const products = await productmodel.find(args)

    res.status(200).send({
        success:true,
        products
    })
    } catch (error) {
        console.log(error)
        return res.status(400).send(
            {
                success: false,
                message:"Error while filtering products",
                error
            }
        )
    }
}

//product Count controller

export const productcountController = async(req,res)=>{

    try {
        const total = await productmodel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success:true,
            total
        })

    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            error,
            message:"Error while counting products"
        })
    }
}

//List Count Controller


export const productlistcountController = async(req,res)=>{
    try {
        const perPage = 4
        const page = req.params.page? req.params.page:1 
        const products = await productmodel.find({}).select("-image").skip((page-1)*perPage).limit(perPage).sort({createdAt:-1})
        res.status(200).send({
            success:true,
            products
        })

    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            error,
            message:"Error while listing products"
        })

    }
}


// search product


export const searchproductController = async(req,res)=>{
    try {
        const {keyword} = req.params
        const product = await productmodel.find({
            $or:[
                {name:{$regex:keyword,$options:"i"}},
                {description:{$regex:keyword,$options:"i"}}
            ]
        }).select("-image")

        res.json(product)
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            error,
            message:"Error while searching products"
        })

    }


}

// related product Controller


export const relatedproductController = async(req,res)=>{
    try {
        const{pid,cid} = req.params
        const products = await productmodel.find({
            category:cid,
            _id:{$ne:pid}
        }).select("-image").limit(3).populate("category")
        res.status(200).send({
            success:true,
            products
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            error,
            message:"Error while searching products"
        })
    }
   
}

//productcategoryController 

export const productcategoryController = async(req,res)=>{
    try {
        const category = await categorymodel.findOne({slug:req.params.slug})
        const products = await productmodel.find({category}).populate("category")
        res.status(200).send({
            success:true,
            products,
            category
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            error,
            message:"Error in product category controller"
        })
    }
   
    
}


//gateway api

//token

export const braintreetokenController = async(req,res)=>{

    try {
        gateway.clientToken.generate({},function(err,response){
            if(err){
                res.status(500).send(err)
            }
            else{
                res.send(response)
            }
        })
    } catch (error) {
        console.log(error)
    }
}

//payment


export const braintreepaymentController = async(req,res)=>{
try {
    const {cart,nonce} = req.body
    const id = req.params.id
   console.log("Hi " + id)
   
    let total = 0 
    cart.map(i=>
        {total=+ i.price}
        )
    let newTransaction = gateway.transaction.sale({
        amount:total,
        paymentMethodNonce:nonce,
        options: {
            submitForSettlement: true,
          },
    },function(error,result){
        if(result){

            const order = new ordermodel({
                products:cart,
                payment:result,
                buyer:id,

            }).save()
            res.json({ok:true})
        }
        else{
            res.status(500).send(error)
        }
    })
} catch (error) {
    console.log(error)
}
}