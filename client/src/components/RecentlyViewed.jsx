import React, { useEffect, useState, useRef } from "react";
import { getRecentlyViewed } from "../utils/recentActivity";
import CartProduct from "./CartProduct";
import { Box } from "@mui/material";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const RecentlyViewed = () => {
  const [products, setProducts] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const data = getRecentlyViewed();
    setProducts(data);
  }, []);

  if (products.length === 0) return null;

  const handleScrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 200;
    }
  };

  const handleScrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 200;
    }
  };

  return (
    <div>
      <div className="container mx-auto p-4 flex items-center justify-between gap-4">
        <h3 className="font-semibold text-lg md:text-xl">Recently Viewed Products</h3>
      </div>

      <div
        ref={containerRef}
        className="flex items-center gap-9 md:gap-6 lg:gap-0 container mx-auto p-4 overflow-x-auto scrollbar-none scroll-smooth"
        style={{ scrollBehavior: "smooth" }}
      >
        {products.map((p) => (
          <Box
            key={p._id}
            sx={{
              flex: "0 0 auto",
              width: { xs: 140, sm: 180, md: 220 }, // same width as CategoryWiseProduct for consistency
            }}
          >
            <CartProduct data={p} />
          </Box>
        ))}

        {/* Scroll buttons visible only on large screens */}
        <div className="w-full left-0 right-0 absolute container mx-auto px-2 hidden lg:flex justify-between pointer-events-none">
          <button
            onClick={handleScrollLeft}
            className="pointer-events-auto z-10 relative bg-white hover:bg-gray-100 shadow-lg p-3 text-lg rounded-full"
            aria-label="Scroll left"
          >
            <FaAngleLeft />
          </button>
          <button
            onClick={handleScrollRight}
            className="pointer-events-auto z-10 relative bg-white hover:bg-gray-100 shadow-lg p-3 text-lg rounded-full"
            aria-label="Scroll right"
          >
            <FaAngleRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewed;
