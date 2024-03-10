import categorymodel from "../models/categorymodel.js";
import Categorymodel from "../models/categorymodel.js";
import slugify from "slugify";
import fs from 'fs'


//create category Controller

export const createcategoryController = async(req,res)=>{
    try {
        const {name} = req.fields;
        const{image} = req.files
        
        console.log(name)
        if(!name){
            return res.status(401).send({success:false,message:'Name is required'})
        }
       if( !image && image>100000){ 
                return res.status(401).send({error:"image is required and should be less than 1mb"})
       }
        const existingcategory = await Categorymodel.findOne({name})
        if(existingcategory){
            return res.status(401).send({
                success:false,
                message:'Category already existed'
            })
        }
        const category = new Categorymodel({...req.fields,slug:slugify(name),
        
        })
        if(image){
            category.image.data = fs.readFileSync(image.path)
            category.image.contentType = image.type
        }
        await category.save()

        return res.status(201).send({
            success:true,
            message:'Category created successfully',
            category
        })
    } catch (error) {
        console.log(error)

        return res.status(500).send({
            success:false,
            error
        })
    }

}

// update category controller

export const updatecategoryController = async(req,res)=>{
    try {
        const {name} = req.fields
        const {id} = req.params
        const {image} = req.files
        console.log(id)
        console.log(name)
        console.log(image)
        const category = await categorymodel.findByIdAndUpdate(id,{name,
          
            new:true})
            if(image){
                category.image.data = fs.readFileSync(image.path)
                category.image.contentType = image.type
            }
            await category.save()
            
    
        res.status(201).send({
            success:true,
            message:'category updated successfully',
         
            category
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error
        })
    }



}

//image category controller

export const imagecategoryController = async(req,res)=>{

    const{id} = req.params;
    const{image} = req.files;
        console.log(id);
        console.log(image)
        try {
            const category = await categorymodel.findById(id);
            console.log(category)
            console.log(image)
            if(image){
                data.image.data = fs.readFileSync(image.path)
                data.image.contentType = image.type
            }
            await category.save();
            res.status(201).send({
                success:true,
                message:'image added successfully',
             
                category
            })
    
        } catch (error) {
            console.log(error)
            res.status(500).send({
                success:false,
                error
            })
        }
}


//get categories controller

export const getcategoriesController = async (req,res)=>{
    try {
        const categories = await categorymodel.find({})

        return res.status(200).send({
            success:true,
            message:'Categories list',
            categories
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

export const categoryimageController = async(req,res)=>{
    try {
      const categoryimage = await categorymodel.findById(req.params.iid).select("image")
  
      if(categoryimage.image.data){
  
          res.set("Content-type",categoryimage.image.contentType)
          res.status(200).send(categoryimage.image.data)
      }
    } catch (error) {
      console.log(error)
      return res.status(500).send({
          success:false,
          error
         })
    }
  }

//get single category

export const singlecategoryController = async(req,res)=>{
    try {
        const category = await categorymodel.findOne({slug:req.params.slug})
        return res.status(200).send({
            succes:true,
            message:"category fetched successfully",
            category
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            succes:false,
            error
        })
    }
}

//delete-category controller

export const deletecategoryController = async(req,res)=>{
    const {id} = req.params;
    try {
        // const Category = await categorymodel.findOneAndDelete({slug:req.params.slug})
        const Category = await categorymodel.findByIdAndDelete(id)
       

        return res.status(200).send({
            success:true,
            message:'Category deleted successfully'

        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            succes:false,
            error
        })
    }
}