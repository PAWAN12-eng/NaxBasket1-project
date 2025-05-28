import mongoose from "mongoose";

const productSchema =new mongoose.Schema({
    name:{
        type : String
    },
    image:{
        type:Array,
        default:[]
    },
    category:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"category"
        }
    ]
   ,
    subCategory:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"subcategory"
        }
    ],
    unit:{
        type:String,
        default:""
    },
    stock:{
        type:String,
        default:null
    },
    price:{
        type:String,
        default:null
    },
    description:{
        type:String,
        default:""
    },
    discount: {
        type: String,
        default: "0"
    },
    more_details :{
        type:Object,
        default:{}
    },
    publish:{
        type:Boolean,
        default:true
    },


},{
    timestamps:true
})

productSchema.index({ name: "text", description: "text" });


const productModel=mongoose.model('product',productSchema)

export default productModel
// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema({
//   name: { type: String },
//   image: { type: Array, default: [] },
//   category: [
//     { type: mongoose.Schema.ObjectId, ref: "category" }
//   ],
//   subCategory: [
//     { type: mongoose.Schema.ObjectId, ref: "subcategory" }
//   ],
//   unit: { type: String, default: "" },
//   price: { type: Number, default: 0 },
//   description: { type: String, default: "" },
//   discount: { type: Number, default: 0 },
//   more_details: { type: Object, default: {} },
//   publish: { type: Boolean, default: true }
// }, {
//   timestamps: true
// });

// productSchema.index({ name: "text", description: "text" });

// const productModel = mongoose.model('product', productSchema);
// export default productModel;
