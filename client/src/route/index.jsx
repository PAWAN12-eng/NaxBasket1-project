import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import App from "../App";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import OtpVerification from "../pages/OtpVerification";
import ResetPassword from "../pages/ResetPassword";
import UserMenuMobile from "../pages/UserMenuMobile";
import Dashboard from "../pages/Dashboard";
import Profile from "../components/Profile";
import MyOrder from "../components/MyOrder";
import Address from "../components/Address";
import Category from "../pages/Category";
import SubCategory from "../pages/SubCategory";
import UploadProduct from "../pages/UploadProduct";
import ProductAdmin from "../pages/ProductAdmin";
import AdminPermission from "../pages/AdminPermission";
import ProductListPage from "../pages/ProductListPage";
import ProductDisplayPage from "../components/ProductDisplayPage";
import MobileCart from "../components/MobileCart";
import CheckOutPage from "../components/CheckOutPage"
import Success from "../components/Success"
import CreatePickUpCenter from "../pages/CreatePickUpCenter";
import WarehouseDashboard from "../warehouseComponent/WarehouseDashboard";
import StockDashboard from "../warehouseComponent/StockDashboard";
import AddUpdateStock from "../warehouseComponent/AddUpdateStock";
import LowStockAlert from "../warehouseComponent/LowStockAlert";
import OrderAcceptOrRejectByWareHouse from "../warehouseComponent/OrderAcceptOrReject";
import WarehouseList from "../warehouseComponent/WareHouseList";
import WarehouseListPage from "../warehouseComponent/WareHouseList";
import HomePage from "../AdminDashboard/HomePage";
import AdminDashboardPage from "../AdminDashboard/AdminDashboardPage";





const routerpage = createBrowserRouter([
    {
        path: "/",
        element: <App></App>,
        children: [
            {
                path: "",
                element: <Home></Home>
            },
            {
                path: "/search",
                element: <SearchPage />
            },
            {
                path: "login",
                element: <Login></Login>
            },
            {
                path: "register",
                element: <Register></Register>
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />
            },
            {
                path: "otp-verification",
                element: <OtpVerification></OtpVerification>
            },
            {
                path: "reset-password",
                element: <ResetPassword />
            },
           {
                 path: "user",
                element: <UserMenuMobile />
            },
            {
                path: "dashboard",
                element: <Dashboard/>,
                children: [
                    {
                        path: "profile",
                        element: <Profile/>
                    },
                    {
                        path: "my-order",
                        element: <MyOrder/>
                    },
                    {
                        path: "address",
                        element: <Address />
                    },
                    // {
                    //     path: "category",
                    //     element:<AdminPermission> <Category/></AdminPermission>
                    // },
                    // {
                    //     path: "sub-category",
                    //     element: <AdminPermission> <SubCategory/></AdminPermission>
                    // },
                    // {
                    //     path: "upload-product",
                    //     element: <AdminPermission><UploadProduct/></AdminPermission>
                    // },
                    // {
                    //     path: "product",
                    //     element: <AdminPermission><ProductAdmin /></AdminPermission>
                    // },
                    // {
                    //     path: "create-pickup",
                    //     element: <AdminPermission><CreatePickUpCenter/></AdminPermission>
                    // },
                ]
            },

            {
                path:':category',
                children:[
                    {
                        path:':subCategory',
                        element:<ProductListPage/>
                    }
                ]
            },
            {
                path:"product/:product",
                element:<ProductDisplayPage/>
            },
            {
                path:"cart",
                element:<MobileCart/>
            },
            {
                path: "CheckOutPage",
                element: <CheckOutPage />
            },  
            {
                path: "order-confirmation",
                element: <Success/>
            }
        ],
        
    },
    // admin
    {
        path:'admin',
        element:<HomePage/>,
        children:[
            {
                path: "Dashboard",
                element: <AdminDashboardPage/>
            },
            {
                path: "profile",
                element: <Profile/>
            },
            {
                path: "category",
                element:<AdminPermission> <Category/></AdminPermission>
            },
            {
                path: "sub-category",
                element: <AdminPermission> <SubCategory/></AdminPermission>
            },
            {
                path: "upload-product",
                element: <AdminPermission><UploadProduct/></AdminPermission>
            },
            {
                path: "product",
                element: <AdminPermission><ProductAdmin /></AdminPermission>
            },
            {
                path: "create-pickup",
                element: <AdminPermission><CreatePickUpCenter/></AdminPermission>
            },
        ]
    },
    {
        path: "warehouse-List",
        element: <WarehouseListPage/>,
      },
      {
        path: "warehouse/:id",
        element: <WarehouseDashboard />, // layout with sidebar + Outlet
        children: [

          {
            path: "orders",
            element: <OrderAcceptOrRejectByWareHouse />,
          },
          {
            path: "warehouse-Dashboard",
            element: <StockDashboard />,
          },
          {
            path: "low-stock-alert",
            element: <LowStockAlert />,
          },
          // Optional additional routes
        //   {
        //     path: "manage-product-stock",
        //     element: <div>Manage Product Stock Page</div>,
        //   },  
        ],
      },
]);

export default routerpage;