import React from "react";
import { IndianRupee } from "lucide-react";
import { Link } from "react-router-dom";
import { validURLConverter } from "../utils/valideURLConvert";
import PriceWithDiscount from "../utils/PriceWithDiscount";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosTostError from "../utils/AxiosTosterror";
import { useState } from "react";
import toast from "react-hot-toast";
import { useGlobleContext } from "../provider/GlobleProvider";
import AddToCartButton from "./AddToCartButton";

const CartProduct = ({ data }) => {
  const url = `/product/${validURLConverter(data.name)}-${data._id}`;
  const [loading, setLoading] = useState(false);
  // const {fetchCartItems,handleUpdateQty}=useGlobleContext()

  // const handelAddToCart = async(e)=>{
  //     e.preventDefault()
  //     e.stopPropagation()
  //     try {
  //        setLoading(true)
  //         const response = await Axios({
  //             ...SummaryApi.AddToCart,
  //             data:{
  //                 productId:data?._id
  //             }
  //         })
  //         const {data:responseData}=response
  //         if(responseData.success){
  //             toast.success(responseData.message)
  //             if(fetchCartItems){
  //                 fetchCartItems()
  //             }

  //         }
  //     } catch (error) {
  //         AxiosTostError(error)
  //     }finally{
  //         setLoading(false)
  //     }
  // }
  // Define color based on discount
  const getDiscountColor = (discount) => {
    if (discount >= 35) return "animate-pulse bg-red-500"; 
    if (discount >= 10) return "bg-green-600"; 
    return " bg-orange-300"; 
  };
  

  return (
    <Link
      to={url}
      className="relative border px-2 lg:px-3 pb-2 grid gap-1 lg:gap-3 lg:max-w-52 max-w-40 lg:min-w-52 min-w-[150px] rounded-lg bg-white cursor-pointer"
    >
      {data.discount > 0 && (
        <div className="absolute top-0 left-1 z-10 hidden lg:block">
          <span className={`${getDiscountColor(data.discount)} text-white text-[11px] lg:text-xs font-bold px-2 py-0.5 rounded shadow-md tracking-wide transition-transform duration-300 ease-in-out`}>
            {data.discount}% OFF
          </span>
        </div>
      )}

      {data.discount > 0 && (
        <div className="absolute top-0 left-1 z-0 block lg:hidden">
          <div
            className={`text-white font-bold shadow-sm pt-1.5 pb-0.5 ${getDiscountColor(
              data.discount
            )}`}
            style={{
              width: "25px", // reduced width
              clipPath:
                "polygon(0 0, 12.5% 20%, 25% 0, 37.5% 20%, 50% 0, 62.5% 20%, 75% 0, 87.5% 20%, 100% 0, 100% 100%, 0 100%)",
              transform: "rotate(180deg)",
            }}
          >
            <div
              className="text-[0.55rem] text-center"
              style={{ transform: "rotate(180deg)" }}
            >
              OFF
            </div>
            <div
              className="text-[0.65rem] leading-tight text-center"
              style={{ transform: "rotate(180deg)" }}
            >
              {data.discount}%
            </div>
          </div>
        </div>
      )}

      <div className="relative min-h-20 max-h-20 lg:min-h-32 lg:max-h-32 overflow-hidden rounded-lg">
        {/* Discount badge */}

        {/* Product image */}
        <div className="w-fit h-full rounded-lg overflow-hidden mx-auto">
          <img
            src={data.image[0]}
            alt=""
            className="w-full h-full object-contain transition-transform duration-300 ease-in-out"
          />
        </div>
      </div>

      <div className="px-2 p-[1px] text-green-600 text-sm rounded bg-green-100 w-fit">
        11 min
      </div>
      <div className="font-medium line-clamp-2 text-ellipsis lg:min-h-12 min-h-12">
        {data.name}
      </div>
      {/* show stock according to the warehosue */}

      <div className="w-fit">{data.unit}</div>

      <div className="flex items-center justify-between gap-2 h-10 ">
        <div className="w-fit font-semibold text-center">
          <span className="flex items-center">
            <IndianRupee size={12} className="text-black mt-0.5" />
            {PriceWithDiscount(data.price, data.discount)}
          </span>
          {data.discount > 0 && (
            <p className="line-through text-sm text-gray-600">
              {" "}
              ₹{data.price}{" "}
            </p>
          )}
        </div>

        <div>
          {data.stock == 0 ? (
            <p className="text-red-500 text-sm text-center font-semibold">
              Out of stock
            </p>
          ) : (
            <AddToCartButton data={data} />
          )}
        </div>
      </div>
    </Link>
  );
};

export default CartProduct;
