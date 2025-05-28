import React, { useState } from "react";
import { FaEdit, FaUserCircle } from "react-icons/fa";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { logoutUser } from "../Store/userSlice";
import isAdmin from "../utils/isAdmin";

import logo from "../../public/logo.png";
import logoicon from "../../public/logoicon.png";

const HomePage = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const togglePopup = () => setShowPopup((prev) => !prev);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      const response = await Axios({ ...SummaryApi.Logout });
      if (response.data.success) {
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

  const sidebarLinks = [
    { path: "/admin/Dashboard", label: "Dashboard" },
    { path: "/admin/category", label: "Category" },
    { path: "/admin/sub-category", label: "Sub Category" },
    { path: "/admin/upload-product", label: "Upload Product" },
    { path: "/admin/product", label: "Product" },
    { path: "/admin/create-pickup", label: "Manage Warehouses" },
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top Navbar */}
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b">
        {/* Logo */}
        <Link to="/" className="flex">
          <img
            src={logoicon}
            alt="logo"
            className="w-12 sm:w-12 md:w-12 lg:w-12 h-auto"
          />
          <img
            src={logo}
            alt="logo"
            className="w-28 sm:w-32 md:w-40 lg:w-44 ml-[-1px] h-auto"
          />
        </Link>

        <div className="flex items-center gap-3">
          {/* Hamburger button for mobile */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md bg-white shadow"
            aria-label="Toggle Sidebar"
          >
            <svg
              className="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden ">
        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full w-64 bg-gray-100 p-6 shadow-md border-r transform transition-transform duration-300 ease-in-out pt-20 z-40
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            lg:translate-x-0 lg:static lg:block`}
        >
          <div className="text-sm grid gap-1.5 mt-3">
            {isAdmin(user.role) &&
              sidebarLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="px-2 py-1 text-lg hover:bg-orange-100"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
          </div>
        </aside>

        {/* Background overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 overflow-y-auto h-[calc(100vh-80px)] mt-[73px]">
          <Toaster position="top-center" />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HomePage;
