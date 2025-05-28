import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Divider from "./Divider";
import SummaryApi from "../common/SummaryApi";
import { logoutUser } from "../Store/userSlice";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import { FaArrowRight, FaEdit } from "react-icons/fa";
import isAdmin from "../utils/isAdmin";

const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.Logout,
      });

      if (response.data.success) {
        if (close) {
          close();
        }
        dispatch(logoutUser());
        localStorage.clear();
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Something went wrong during logout.");
    }
  };

  const handleClose = () => {
    if (close) {
      close();
    }
  };
  return (
    <div>
      <div className="font-semibold">My Account</div>
      <div className="text-sm flex items-center gap-1 ">
        {" "}
        <span>{user.name || user.mobile}</span>
        <Link
          onClick={handleClose}
          to={"/dashboard/profile"}
          className="hover:text-primary-200"
        >
          <FaEdit />
        </Link>
        <span className="text-xs text-red-600 font-semibold flex items-center gap-1">
          {user.role === "ADMIN" && (
            <>
              (Admin)
              <Link to="/admin/Dashboard" title="Go to Admin Dashboard">
                <FaArrowRight className="text-red-600 cursor-pointer hover:scale-110 transition" />
              </Link>
            </>
          )}
        </span>
      </div>
      {user.role === "WAREHOUSE" && (
        <div className="relative group inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-800 transition duration-300">
          {/* Glowing background */}
          <div className="absolute inset-0 bg-red-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition-all duration-300 z-[-1]" />

          {/* Pulsing dot */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-300"></span>
          </span>

          {/* Label */}
          <span>Warehouse</span>

          {/* Arrow icon */}
          <Link
            to="/warehouse-List"
            title="Go to Warehouse Dashboard"
            className="flex items-center hover:text-white transition-transform duration-300 transform group-hover:translate-x-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-red-200"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>

          {/* Tooltip */}
          {/* <div className="absolute left-full ml-2 px-2 py-1 text-xs bg-gray-800 text-white rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
      Warehouse Management
      <div className="absolute right-full top-1/2 -mt-1 w-2 h-2 bg-gray-800 transform rotate-45"></div>
    </div> */}
        </div>
      )}

      <Divider />
      <div className="text-sm grid gap-1.5">
        {/* {
          isAdmin(user.role) && (
            <Link onClick={handleClose} to="/dashboard/category" className="px-2 hover:bg-orange-100 py-1">Category</Link>

          )
        }
        {
          isAdmin(user.role) && (
            <Link onClick={handleClose} to="/dashboard/sub-category" className="px-2 hover:bg-orange-100 py-1">Sub Category</Link>

          )
        }
        {
          isAdmin(user.role) && (
            <Link onClick={handleClose} to="/dashboard/upload-product" className="px-2 hover:bg-orange-100 py-1">Upload Product</Link>

          )
        }
        {
          isAdmin(user.role) && (
            <Link onClick={handleClose} to="/dashboard/product" className="px-2 hover:bg-orange-100 py-1">Product</Link>

          )
        }
        {
          isAdmin(user.role) && (
            <Link onClick={handleClose} to="/dashboard/create-pickup" className="px-2 hover:bg-orange-100 py-1">Manage Warehouses</Link>

          )
        } */}
        <Link
          onClick={handleClose}
          to="/dashboard/my-order"
          className="px-2 hover:bg-orange-100 py-1"
        >
          My Orders
        </Link>
        <Link
          onClick={handleClose}
          to="/dashboard/address"
          className="px-2 hover:bg-orange-100 py-1"
        >
          Address
        </Link>
        <button
          onClick={handleLogout}
          className="text-left hover:bg-red-300 px-2 py-1 "
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
