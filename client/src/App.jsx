import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import "./App.css";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import fatchUserDetails from "./utils/fatchUserDetails";
import { setUserDetails } from "./Store/userSlice";
import { useDispatch } from "react-redux";
import {
  setAllCategory,
  setSubCategory,
  setLoadingCategory,
} from "./Store/productSlice";
import SummaryApi from "./common/SummaryApi";
import AxiosTostError from "./utils/AxiosTosterror";
import Axios from "./utils/Axios";
import { handleAddItemCart } from "./Store/CartProduct";
import GlobleProvider from "./provider/GlobleProvider";
import CartMobile from "./components/CartMobile";
import CursorTrail from "./components/CursorTrail";
import ScrollToTop from "./AdminDashboard/ScrollToTop";

function App() {
  const dispatch = useDispatch();

  const fetchUser = async () => {
    const userData = await fatchUserDetails();
    dispatch(setUserDetails(userData.data));
  };

  const fetchCategories = async () => {
    try {
      dispatch(setLoadingCategory(true));
      const response = await Axios(SummaryApi.getcetogry);
      dispatch(setAllCategory(response.data.data));
      // setCategories(response.data.data || []);
    } catch (error) {
      AxiosTostError(error);
    } finally {
      setLoadingCategory(false);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await Axios(SummaryApi.getSubcategory);
      dispatch(setSubCategory(response.data.data));
      // setCategories(response.data.data || []);
    } catch (error) {
      AxiosTostError(error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchCategories();
    fetchSubCategories();
    // fetchCartItme()
  }, []);

  return (
    <GlobleProvider>
      {/* <> */}
      <ScrollToTop />
      <Header />
      <main className="min-h-[78vh]">
        <Outlet />
      </main>
      <Footer />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#333',
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          },
        }}
      />

      {/* </> */}
      <div className=" sticky bottom-2 p-2 block md:hidden">
        <CartMobile />
      </div>
    </GlobleProvider>
  );
}

export default App;
