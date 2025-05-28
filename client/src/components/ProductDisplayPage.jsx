import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MdOutlineWatchLater } from "react-icons/md";
import { GrSubtract } from "react-icons/gr";
import { IoMdAdd } from "react-icons/io";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosTostError from "../utils/AxiosTosterror";
import Divider from "./Divider";
import PriceWithDiscount from "../utils/PriceWithDiscount";
import toast from "react-hot-toast";
import { useGlobleContext } from "../provider/GlobleProvider";
import AddToCartButton from "./AddToCartButton";
import Header from "./Header";
import { Link } from "react-router-dom";
import { saveRecentlyViewed } from "../utils/recentActivity";

const ProductDisplayPage = () => {
  const params = useParams();
  const productId = params?.product?.split("-").slice(-1)[0];
  const { fetchCartItems } = useGlobleContext();

  const [data, setData] = useState({
    name: "",
    image: [],
    description: "",
    unit: "",
    price: "",
  });
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: { ProductId: productId },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        setData(responseData.data);
        setImage(responseData.data.image[0]);
        setDescription(responseData.data.description);
        saveRecentlyViewed(responseData.data);
      }
    } catch (error) {
      AxiosTostError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [params]);

  const handelAddToCart = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.AddToCart,
        data: {
          productId: data?._id,
        },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        if (fetchCartItems) {
          fetchCartItems();
        }
      }
    } catch (error) {
      AxiosTostError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrease = () => {
    setCartQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setCartQuantity((prev) => (prev > 0 ? prev - 1 : 0));
  };

  return (
    <section>
      {/* <Header/> */}
      <div className="flex flex-col md:flex-row gap-10 items-start">
        {/* Left Side - Product Image */}
        <div className="w-full md:w-1/2 flex flex-col items-center self-stretch">
          {/* Product Image Viewer */}

          <div className="w-full max-w-[480px] mt-5">
            {/* Main Image with Zoom Effect (only on desktop) */}
            <div className="w-full h-[300px] lg:h-[420px] bg-white shadow-xl rounded-2xl overflow-hidden relative group">
              {image && (
                <img
                  src={image}
                  alt="Product"
                  className="w-full h-full object-contain p-4 transition-transform duration-500 lg:group-hover:scale-110"
                />
              )}
            </div>

            {/* Thumbnail Selector */}
            <div className="mt-4">
              {/* for mobile */}
              <div className="flex lg:hidden overflow-x-auto gap-3 px-2 no-scrollbar">
                {data.image.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setImage(img)}
                    className={`relative flex-shrink-0 rounded-xl overflow-hidden border-2 p-0.5 transition-all duration-300 ${
                      image === img
                        ? "border-green-500 shadow-md"
                        : "border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumb-${index}`}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    {image === img && (
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600 animate-pulse"></div>
                    )}
                  </button>
                ))}
              </div>

              {/* Desktop: Horizontal scroll (same as mobile) */}
              <div className="hidden lg:flex overflow-x-auto gap-3 mt-4 px-2 no-scrollbar">
                {data.image.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setImage(img)}
                    className={`relative flex-shrink-0 rounded-xl overflow-hidden border-2 p-0.5 transition-all duration-300 ${
                      image === img
                        ? "border-green-500 shadow-lg"
                        : "border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumb-${index}`}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    {image === img && (
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600 animate-pulse"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="my-4 hidden  lg:grid gap-3 border-t p-4 w-full">
            {/* description */}
            {data.description && (
              <div className="">
                <p className="font-semibold text-lg">Product Details</p>
                <p className="text-base">{data.description}</p>
              </div>
            )}
            {/* unit */}
            <div>
              <p className="font-semibold text-lg">Unit</p>
              <p className="text-base">{data.unit}</p>
            </div>
            {data?.more_details &&
              Object.keys(data?.more_details).map((element, index) => (
                <div key={element}>
                  <p className="font-semibold text-lg">{element}</p>
                  <p className="text-base">{data?.more_details[element]}</p>
                </div>
              ))}
          </div>

          {/* -------------------------------------------------------------------------- */}
        </div>

        {/* Right Side - Product Details */}
        <div className="w-full md:w-1/2 border pt-5 lg:pt-16 pl-4 lg:pl-10 lg:pr-16 self-stretch overflow-auto">
          <div className="text-gray-500 text-sm mb-2">
            Home /
            {data.category &&
              data.category.map((cat, index) => (
                <span key={cat._id}>
                  {index > 0 && " / "}
                  {cat.name}
                </span>
              ))}
            {data.name && ` / ${data.name}`} {/* Home / Milk / {data.name} */}
          </div>
          <h1 className="text-2xl font-bold mb-2">{data.name}</h1>

          <div className="flex items-center text-sm text-gray-600 mb-4">
            <span className="flex items-center gap-1">
              <span>⏱</span>
              10 MINS
            </span>
          </div>

          <div className="text-green-600 mb-4 font-medium cursor-pointer">
            {data.category?.[0] && data.subCategory?.[0] && (
              <Link
                to={`/${data.category[0].name}-${data.category[0]._id}/${data.subCategory[0].name}-${data.subCategory[0]._id}`}
                className="text-green-600 mb-4 font-medium cursor-pointer"
              >
                View all in {data.subCategory[0].name} ➤
              </Link>
            )}
          </div>

          <div className="mb-2 font-semibold">
            <p> {data.unit}</p>
          </div>
          <div className="flex lg:gap-4 gap-2 mb-4 items-center">
            {/* <button
        className="border border-gray-300 px-4 py-2 rounded-lg text-gray-400"
        disabled
      >
        1 ltr <br /> out of stock
      </button> */}

            <button className="border px-3 py-2 rounded-lg border-green-500">
              <p className="text-lg font-semibold">
                {" "}
                MRP ₹{PriceWithDiscount(data.price, data.discount)}
              </p>
            </button>
            {data.discount > 0 && (
              <p className="line-through text-lg text-gray-600">
                {" "}
                ₹{data.price}{" "}
              </p>
            )}
            {data.discount > 0 && (
              <p className="font-bold text-green-600 lg:text-2xl">
                {data.discount}%{" "}
                <span className="text-base text-neutral-500">Discount</span>
              </p>
            )}
          </div>

          <div className="text-sm text-gray-500 mb-4">
            (Inclusive of all taxes)
          </div>

          {/* <button
          onClick={handelAddToCart}
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "ADD" : "ADD"}
        </button> */}
          <div>
            {data.stock == 0 ? (
              <p className="text-red-500 text-sm text-center font-semibold">
                Out of stock
              </p>
            ) : (
              <AddToCartButton data={data} />
            )}
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">
              Why shop from blinkit?
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <img
                  src="https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=90/assets/web/blinkit-promises/10_minute_delivery.png"
                  alt="Delivery Icon"
                  className="w-12 h-12"
                />
                <div>
                  <h3 className="font-medium">Superfast Delivery</h3>
                  <p className="text-sm text-gray-600">
                    Get your order delivered to your doorstep at the earliest
                    from dark stores near you.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <img
                  src="https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=90/assets/web/blinkit-promises/Best_Prices_Offers.png"
                  alt="Offers Icon"
                  className="w-12 h-12"
                />
                <div>
                  <h3 className="font-medium">Best Prices & Offers</h3>
                  <p className="text-sm text-gray-600">
                    Best price destination with offers directly from the
                    manufacturers.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <img
                  src="https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=90/assets/web/blinkit-promises/Wide_Assortment.png"
                  alt="Delivery Icon"
                  className="w-12 h-12"
                />
                <div>
                  <h3 className="font-medium">Wide Assortment</h3>
                  <p className="text-sm text-gray-600">
                    Choose from 5000+ products across food, personal care,
                    household & other categories.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDisplayPage;
