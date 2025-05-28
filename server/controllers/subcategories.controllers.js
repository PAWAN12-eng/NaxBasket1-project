import subcategoryModel from "../models/subcategory.model.js";
import productModel from "../models/product.model.js";
import categoryModel from "../models/category.model.js";
import mongoose from "mongoose";
import { logActivity } from "./External.controller.js";

export async function addSubcategories(req, res) {
  try {
    const { name,image, category } = req.body; 


    if (!name || !category || !image) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "All fields are required"
      });
    }
    

      const payload ={
       name,
       image,
       category
      }
       const createSubCategory = new subcategoryModel(payload)
       const save = await createSubCategory.save()
       
       await logActivity('subcategory_added', `Subcategory added: ${name}`);


       return res.json({
         message: "Subcategory created",
         data: save,
         error:false,
         success:true
        });

  } catch (error) {
     return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
  });
  }
}
//Fetch all subcategories
export async function getSubcategories(req, res) {
  try {
         const subcategories = await subcategoryModel.find().sort({createdAt:-1}).populate('category')
 
         return res.json({
             data: subcategories,
             error: false,
             success: true
         })
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch subcategories" });
  }
}
// for edit or delete subcategory video time is  

export async function DeleteSubCategorie(req, res) {
  try {
    const { id } = req.params;

    // Check if any product is linked to this subcategory
    const linkedProducts = await productModel.findOne({ subcategory: id });

    if (linkedProducts) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete subcategory. Products are linked to it.",
      });
    }

    // No products found, safe to delete
    await subcategoryModel.findByIdAndDelete(id);

    res.json({ success: true, message: "SubCategory deleted successfully" });
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    res.status(500).json({ success: false, error: "Failed to delete subcategory" });
  }
}

export async function EditSubCategorie(req, res) {
  try {
    const { id } = req.params;
    const { name, category } = req.body;
    let imagePath;

    // Find the existing subcategory
    const existingSubcategory = await subcategoryModel.findById(id);
    if (!existingSubcategory) return res.status(404).json({ error: "Subcategory not found" });

    // If a new image is uploaded, update the imagePath
    if (req.file) {
      // Delete the old image if exists
      if (existingSubcategory.image) {
        const oldImagePath = path.join(__dirname, existingSubcategory.image);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      imagePath = `/uploads/${req.file.filename}`;
    } else {
      imagePath = existingSubcategory.image; // Keep the existing image if no new image is uploaded
    }

    // Update the subcategory
    const updatedSubcategory = await subcategoryModel.findByIdAndUpdate(
      id,
      { name, category, image: imagePath },
      { new: true }
    );

    res.json(updatedSubcategory);
  } catch (error) {
    console.error("Error updating subcategory:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Fetch subcategories when category changes
export async function CategoryShowById(req, res) {
  try {
    const { categoryId } = req.params;
    const subcategories = await subcategoryModel.find({ category: categoryId });
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json(subcategories);

  } catch (error) {
    console.error("Error find by Id subcategory:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

}