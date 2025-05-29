import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { validURLConverter } from "../utils/valideURLConvert";
import banner1 from "../../public/banner1.jpeg";
import banner2 from "../../public/banner_2.jpg";
import banner3 from "../../public/banner3.jpg";
import { Link, useNavigate } from "react-router-dom";
import CategoryWiseProduct from "../components/CategoryWiseProduct";
import Header from "../components/Header";
import RecentlyViewed from "../components/RecentlyViewed";

const bannerImages = [banner3, banner1, banner2];

const Home = () => {
  const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const categoryData = useSelector((state) => state.product.allCategory);
  const SubcategoryData = useSelector((state) => state.product.subCategory);
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Manual next/prev
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? bannerImages.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handelRedirectProductListpage = (id, cat) => {
    const subCategory = SubcategoryData.find((sub) => {
      // Check if category object exists and compare its _id
      if (sub.category && sub.category._id == id) {
        return true;
      }
      return false;
    });

    if (subCategory) {
      const url = `/${validURLConverter(cat)}-${id}/${validURLConverter(
        subCategory.name
      )}-${subCategory._id}`;
      navigate(url);
    } else {
      console.warn("No matching subcategory found for category ID:", id);
    }
  };

  const splitCategoryDataForMobile = (categories) => {
    if (window.innerWidth >= 640) {
      // For screens sm and up, return all in one array (no split)
      return [categories];
    }

    const firstRow = categories.slice(0, 2);
    const secondRow = categories.slice(2, 5);
    const remaining = categories.slice(5);

    // Break remaining into chunks of 4
    const restRows = [];
    for (let i = 0; i < remaining.length; i += 4) {
      restRows.push(remaining.slice(i, i + 4));
    }

    return [firstRow, secondRow, ...restRows];
  };

  return (
    <section className="bg-white">
      {/* <Header/> */}
      {/* header */}
      <div className="container mx-auto hidden lg:block py-3">
        <div className="relative w-full min-h-80 border bg-blue-100 rounded-xl overflow-hidden">
          {bannerImages.map((banner, index) => (
            <img
              key={index}
              src={banner}
              alt={`banner-${index}`}
              className={`w-full h-80 object-cover rounded-xl absolute top-0 left-0 transition-opacity duration-700 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          {/* Manual controls */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-gray-300 hover:text-white shadow-lg rounded-full p-3 transition duration-300 ease-in-out"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-gray-300 hover:text-white shadow-lg rounded-full p-3 transition duration-300 ease-in-out"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* category */}
      <div className="bg-transparent container mx-auto px-1">
      {loadingCategory
        ? // your loading skeleton stays as is
          new Array(14).fill(null).map((_, index) => (
            <div
              key={index + "loadingCategory"}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 h-40 flex flex-col justify-between items-center shadow-lg animate-pulse"
              style={{
                animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                background: `linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%)`,
                backgroundSize: `400% 100%`,
              }}
            >
              <div className="bg-gray-700 w-20 h-20 rounded-full opacity-70"></div>
              <div className="bg-gray-700 w-3/4 h-4 rounded-full mt-2 opacity-70"></div>
            </div>
          ))
        : splitCategoryDataForMobile(categoryData).map((row, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className={`grid gap-1 md:gap-3 ${
                rowIndex === 0
                  ? "grid-cols-2 first-row-mobile"
                  : rowIndex === 1
                  ? "grid-cols-3 secoend-row-mobile"
                  : "grid-cols-4"
              } sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-10 mb-2 lg:mx-20`}
            >
              {row.map((cat, index) => (
                <div
                  className="p-1 group"
                  key={cat._id || index}
                  onClick={() =>
                    handelRedirectProductListpage(cat._id, cat.name)
                  }
                >
                  <div className="flex flex-col items-center cursor-pointer justify-between text-center border border-gray-200 rounded-xl md:px-2 md:pb-1 hover:shadow-lg transition-all duration-500 h-28 md:h-40 bg-gradient-to-b transform lg:hover:-translate-y-1 lg:hover:scale-105">
                    <div className="relative w-16 h-16 md:w-24 md:h-24 md:mt-2">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-xs md:text-sm w-full line-clamp-2 px-1 text-gray-800 font-medium items-center min-h-[40px]">
                      {cat.name}
                    </p>

                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-green-600 to-transparent opacity-0 lg:group-hover:opacity-100 transition-all duration-700"></div>
                  </div>
                </div>
              ))}
            </div>
          ))}

      </div>

      <RecentlyViewed />

      {/* display category Products */}
      {categoryData.slice(0, 10).map((c, index) => {
        return (
          <CategoryWiseProduct
            key={c?._id + "categorywiseProduct"}
            id={c?._id}
            name={c?.name}
          />
        );
      })}
    </section>
  );
};

export default Home;
