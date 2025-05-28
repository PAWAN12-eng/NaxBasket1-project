import categoryModel from "../models/category.model.js";
import productModel from "../models/product.model.js";
import subcategoryModel from "../models/subcategory.model.js";
import { logActivity } from "./External.controller.js";

// route get categories
export async function getcategories(req, res) {
    try {
        const categories = await categoryModel.find();

        return res.json({
            data: categories,
            error: false,
            success: true
        })
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch categories" });
    }
}

// route post categories
export async function AddcategorieController(req, res) {
    try {
        const { name, image } = req.body;

        if (!name || !image) {
            return res.status(400).json({
                message: 'Enter required fields',
                error: true,
                success: false
            });
        }

        const addcategory = new categoryModel({
            name,
            image
        });
        const saveCategory = await addcategory.save()

        if (!saveCategory) {
            return res.status(500).json({
                message: 'Not Created',
                error: true,
                success: false
            })
        }
               await logActivity('category_added', `Category added: ${name}`);
        
        return res.status(201).json({
            message: "Add successfully!",
            data: saveCategory,
            success: true,
            error: false
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

//route Upate categories
export async function UpdateCategoryController(req, res) {
    try {
        const { _id, name, image } = req.body;


        const updatedCategory = await categoryModel.updateOne({ _id: _id }, { name, image });


        return res.json({
            message: 'Update Category',
            data: updatedCategory,
            success: true,
            error: false
        })
    } catch (error) {
        res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

//route Delete catagories
export async function DeleteCategorie(req, res) {
    try {
        const { _id } = req.body;

        const checkSubCategory = await subcategoryModel.find({
            category: {
                "$in": [_id]
            }
        }).countDocuments()

        const checkProduct = await productModel.find({
            category: {
                "$in": [_id]
            }
        }).countDocuments()

        if (checkSubCategory > 0 || checkProduct > 0) {
            return res.status(400).json({
                message: 'Category is already use can`t delete',
                error: true,
                success: false
            })
        }
        const deletedcategory = await categoryModel.deleteOne({ _id: _id });
        res.json({ message: "Deleted Category Successfully",data:deletedcategory,success:true,error:false });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ error: "Failed to delete category" });
    }
}