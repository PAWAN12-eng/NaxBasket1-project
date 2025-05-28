import { createContext, useContext, useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { useDispatch, useSelector } from "react-redux";
import { handleAddItemCart } from "../Store/CartProduct";
import AxiosTostError from "../utils/AxiosTosterror";
import toast from "react-hot-toast";
import PriceWithDiscount from '../utils/PriceWithDiscount';


// 1. Create Context
export const GlobleContext = createContext(null);

// 2. Custom hook for easier access
export const useGlobleContext = () => useContext(GlobleContext);

// 3. Provider Component
const GlobleProvider = ({ children }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartItem.cart);
  const [notDiscountPrice,setNotDiscountPrice]=useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalQty, setTotalQty] = useState(0)
  const [totalDiscount, setTotalDiscount] = useState(0)
  const user = useSelector((state)=>state.user)


  const fetchCartItems = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getCartItem,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(handleAddItemCart(responseData.data));
        // console.log("Fetched cart data:", responseData.data);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleUpdateQty = async (id, qty) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateQty,
        data: {
          _id: id,
          qty: qty
        }
      })
      const { data: responseData } = response
      if (responseData.success) {
        // toast.success(responseData.message)
        fetchCartItems()
        return responseData
      }

    } catch (error) {
      AxiosTostError(error)
      return error
    }
  }

  const deleteCartItem = async (cartId) => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteQty,
        data: {
          _id: cartId
        }
      })

      const { data: responseData } = response
      if (responseData.success) {
        toast.success(responseData.message)
        fetchCartItems()
      }
    } catch (error) {
      AxiosTostError(error)
    }
  }
  // useEffect(() => {
  //   fetchCartItems();
  // }, []);

  useEffect(() => {
    const qty = cartItems.reduce((preve, curr) => {
      return preve + curr.quantity
    }, 0)
    setTotalQty(qty)

    // const tPrice = cartItems.reduce((preve, curr) => {
    //   const { price, discount } = curr.productId;
    //   const finalPrice = PriceWithDiscount(price, discount);
    //   return preve + finalPrice * curr.quantity;
    // }, 0);
    const tPrice = cartItems.reduce((preve, curr) => {
      if (!curr.productId) return preve; // skip if product is deleted
      const { price, discount } = curr.productId;
      const finalPrice = PriceWithDiscount(price, discount);
      return preve + finalPrice * curr.quantity;
    }, 0);
    
    
    setTotalPrice(tPrice);
    

    // const notDiscount = cartItems.reduce((preve, curr) => {
    //   return preve + (curr.productId.price * curr.quantity)
    // }, 0)

    const notDiscount = cartItems.reduce((preve, curr) => {
      if (!curr.productId) return preve; // Add this check
      return preve + (curr.productId.price * curr.quantity);
    }, 0);
    
    setNotDiscountPrice(notDiscount)
      // 👉 Total Discount
  setTotalDiscount(notDiscount - tPrice)

  }, [cartItems])


  const handelLogOut =()=>{
    localStorage.clear()
    dispatch(handleAddItemCart([]))
  }

  useEffect(() => {
    if (user && user._id) {
      fetchCartItems();
    } else {
      handelLogOut();
    }
  }, [user]);
  
  return (
    <GlobleContext.Provider value={{ fetchCartItems, handleUpdateQty, deleteCartItem, totalPrice, totalQty,notDiscountPrice,totalDiscount }}>
      {children}
    </GlobleContext.Provider>
  );
};

export default GlobleProvider;
