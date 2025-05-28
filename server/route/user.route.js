import { Router } from "express";
import { 
    forgotPasswordController, loginController, logoutController, 
    refreshToken, 
    resetPassword, 
    resisterUsercontroller,  updateUserDetails, uploadAvtar, 
    UserDetails, 
    verifiyEmailcontroller, verifyforgotPasswordController 
} from "../controllers/user.controllers.js";
import auth from "../midelware/auth.js";
import upload from "../midelware/multer.js"; 
import { AddcategorieController, DeleteCategorie, getcategories, UpdateCategoryController } from "../controllers/categories.controllers.js";
import { addSubcategories, CategoryShowById,  DeleteSubCategorie,  EditSubCategorie, getSubcategories } from "../controllers/subcategories.controllers.js";
import { createProductController, deleteProductController, getProductByCategoryAndSubCategory, getProductDetails, GetProducts,getProductsBySubcategory, getProductsByUserLocation, searchProduct } from "../controllers/Product.controller.js";
import { addToCart, deleteCartItmeQtyController, getCartItemContorller, updateCartItemQtyController } from "../controllers/cart.controller.js";
import { getUserAddresses,createUserAddress, updateUserAddress, deleteUserAddress } from "../controllers/Address.controller.js";
import { CashOnDeliveryController,createOrderByRezerPay,getMyOrders,getWarehouseOrders, updateOrderStatus, VerifyPayment} from "../controllers/Order.controller.js";
import { CountAllDetails, createWarehouse, deleteWarehouse, editWarehouse,  GetAllWarehouse,  getOrderStatsByWarehouse,  getSalesStats,  getWarehouseDetails, ShowWareHouseStatus, upsertStockForProduct } from "../controllers/warehouse.controller.js";
import { recentActivites } from "../controllers/External.controller.js";





const userouter = Router();

userouter.post('/register', resisterUsercontroller);
userouter.post('/verify-email', verifiyEmailcontroller);
userouter.post('/login', loginController);
userouter.get('/logout', auth, logoutController);
userouter.put('/upload-avtar', auth, upload.single('avtar'), uploadAvtar);
userouter.put('/update-profile',auth,updateUserDetails );
userouter.put('/forgot-password', forgotPasswordController);
userouter.put('/verify-forgot-password-otp', verifyforgotPasswordController );
userouter.put('/reset-password',resetPassword );
userouter.post('/refresh-token',refreshToken)
userouter.get('/user-details', auth,UserDetails );

// Admin Routes Category , subcategory , product 

// category
userouter.post('/add-categorirs',auth,AddcategorieController)
userouter.get('/get',getcategories)
userouter.put('/update-category',auth,UpdateCategoryController)
userouter.delete('/category-delete',auth,DeleteCategorie)
// subcategories
userouter.post('/add-subcategory',auth,addSubcategories)
userouter.post('/get-subcategory',getSubcategories)
userouter.delete('/delete-subcategory/:id', auth, DeleteSubCategorie)

// product
userouter.post('/create-product',auth,createProductController)
userouter.delete('/delete-product/:id',auth,deleteProductController)
userouter.get('/get-product',GetProducts)
userouter.post('/get-product-by-category',getProductsBySubcategory)
userouter.post('/get-Product-by-Category-and-subcategory',getProductByCategoryAndSubCategory)
userouter.post('/get-product-details',getProductDetails)
userouter.post('/search-product',searchProduct)


// add to cart
userouter.post('/create',auth,addToCart)
userouter.get('/get-cartProduct',auth,getCartItemContorller)
userouter.put('/update-qty',auth,updateCartItemQtyController)
userouter.delete('/delete-cartItem',auth,deleteCartItmeQtyController)

// address
userouter.get("/user-addresses", auth, getUserAddresses);
userouter.post("/add-address", auth, createUserAddress); 
userouter.put("/addresses/:id", auth, updateUserAddress);
userouter.delete("/addresses/:id", auth, deleteUserAddress);

// Order
// userouter.post('/order/create', auth, createOrderController);
userouter.get('/user-orders', auth, getMyOrders);

userouter.post('/order/create', auth, CashOnDeliveryController);
userouter.get('/warehouse-order/:id', auth, getWarehouseOrders);
userouter.get('/details/:id', auth, getWarehouseDetails);
userouter.put("/update/:orderId", updateOrderStatus);
// /warehouse-order/
userouter.get('/get-warehouse', auth, GetAllWarehouse);
userouter.post('/create-warehouse', auth, createWarehouse);
userouter.patch('/:id/warehouse-status', auth, ShowWareHouseStatus);
userouter.put('/:id/edit-warehouse', auth, editWarehouse);
userouter.delete('/:id/delete-warehouse', auth, deleteWarehouse);

// userouter.post('/razorpay', auth, createRazorpayOrder);
// userouter.post('/verify', auth, verifyPaymentAndCreateOrder);
// userouter.post('/stripe-session', auth, createStripeSession);

// count all Categories Subcategories Products Orders Warehouses
userouter.get('/dashboard-counts', auth, CountAllDetails);
userouter.get('/sales-stats', auth,getSalesStats);

userouter.get('/warehouse-order-stats',auth, getOrderStatsByWarehouse);


// update or show stock according to the warehouse --------in user at this time
// userouter.get("/:warehouseId", getAllStockByWarehouse);
userouter.put("/:warehouseId/:productId", upsertStockForProduct);
userouter.get('/products/by-location',getProductsByUserLocation) 

userouter.post('/payment/create-order',createOrderByRezerPay) 
userouter.post('/payment/verify',VerifyPayment) 




userouter.get('/recent-activities',recentActivites) 


    


export default userouter;
