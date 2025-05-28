import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        require:[true,"Provide name"]
    },
    email:{
        type:String,
        require:[true,"Provide email"],
       unique:true
    },
    password:{
        type:String,
        require:[true,"Provide password"]
    },
    avtar:{
        type:String,
        default:""
    },
    mobile:{
       type:String, 
       default:null
    },
    refresh_token:{
        type:String,
        default:""
    },
    verify_email:{
        type:Boolean,
        default:false
    },
    last_login_date:{
        type:Date,
        default:""
    },
    status:{
        type:String,
       enum:["Active","Inactive","Suspanded"],
       default:"Active"
    },
    address_detalis:{
        type:mongoose.Schema.ObjectId,
        ref:"Address"
    },
    shopping_cart: [{
        type: mongoose.Schema.ObjectId,
        ref: "cartProduct"
      }],      
    orderHistory:{
       type:mongoose.Schema.ObjectId,
       ref:"order"
    },
    forgot_password_otp: {
        type: String,
        default: null,
    },
    forgot_password_expiry: {
        type: Date,
        default: null,
    },
    role:{
        type:String,
        enum:["ADMIN","USER","WAREHOUSE"],
        default:"USER"
    },
    cretedAt:{
        type:String,
        default:null
    },
    updateAt:{
        type:String,
        default:null
    },
},{
    timestamps:true
})

const UserModel = mongoose.model("User",userSchema)

export default UserModel