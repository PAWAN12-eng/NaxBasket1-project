import mongoose from "mongoose";


const subcategorySchema = new mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: ""
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "category", // ✅ Ensure the reference name is correct
        required: true 
    }
}, {
    timestamps: true
})


const subcategoryModel = mongoose.model('subcategory', subcategorySchema)

export default subcategoryModel
