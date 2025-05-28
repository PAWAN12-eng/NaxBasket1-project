import React from 'react';
import { IoCartOutline } from "react-icons/io5";
import { useGlobleContext } from '../provider/GlobleProvider';
import { FaAngleRight } from "react-icons/fa";
import { Link } from 'react-router-dom';

const CartMobile = () => {
  const { totalPrice, totalQty } = useGlobleContext();

  return (
    <>
      {totalQty > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-2">
          <div className="bg-green-700 py-1.5 px-2.5 rounded-lg text-neutral-100 shadow-xl flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-green-600 p-1 rounded-xl">
                <IoCartOutline size={26} />
              </div>
              <div className="pl-3">
                <p className="text-sm">{totalQty} Items</p>
                <p className="text-sm font-medium">₹{totalPrice}</p>
              </div>
            </div>
            <div>
              <Link to="/cart" className="text-lg flex items-center gap-1">
                View Cart <FaAngleRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartMobile;
