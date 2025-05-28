import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaLocationArrow, FaUserCircle } from "react-icons/fa";
import Search from "./Search";
import logo from "../../public/logo.png";
import logoicon from "../../public/logoicon.png";
import useMobile from "../hooks/useMobile";
import { motion } from "framer-motion";
import { IoCartOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import UserMenu from "./UserMenu";
import { useGlobleContext } from "../provider/GlobleProvider";
import DisplayCartItem from "./DisplayCartItem";
import LocationModal from "./LocationModal";

const Header = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [openUserMenu, setOpenUserMeny] = useState(false);
  const cartItems = useSelector((state) => state.cartItem.cart);
  // const [totalPrice, setTotalPrice] = useState(0)
  // const [totalQty, setTotalQty] = useState(0)
  const { totalPrice, totalQty } = useGlobleContext();
  const [openCartSection, setOpenCartSection] = useState(false);
  const [isLocationModalOpen, setLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Load location from localStorage
  useEffect(() => {
    const savedLocation = localStorage.getItem("selectedLocation");
    if (savedLocation) {
      try {
        setSelectedLocation(JSON.parse(savedLocation));
      } catch (error) {
        console.error("Failed to parse selectedLocation:", error);
        setSelectedLocation(null);
      }
    }
  }, []);

  // Save location to localStorage when changed
  useEffect(() => {
    if (selectedLocation) {
      localStorage.setItem(
        "selectedLocation",
        JSON.stringify(selectedLocation)
      );
    }
  }, [selectedLocation]);

  const redirectToLoginPage = () => {
    navigate("/login");
  };

  const handelCloseUserMenu = () => {
    setOpenUserMeny(false);
  };
  const handelMobileVersion = () => {
    if (!user._id) {
      navigate("/login");
      return;
    }
    navigate("/user");
  };

  const dummyAddress = [
    {
      id: 1,
      label: "Home",
      full: "pawan, 73A Jawahar Camp, Kirti Nagar, Delhi",
    },
  ];

  // total item and total price
  // useEffect(() => {
  //     const qty = cartItems.reduce((preve, curr) => {
  //         return preve + curr.quantity
  //     }, 0)
  //     setTotalQty(qty)

  //     const tPrice = cartItems.reduce((preve, curr) => {
  //         return preve + curr.productId.price*curr.quantity
  //     }, 0)
  //     setTotalPrice(tPrice)
  // }, [cartItems])

  // const { isMobile } = useMobile();
  // const location = useLocation()
  // const isSearchPage = location.pathname ===  "/search"
  // console.log("search",isSearchPage)
  // console.log(location)
  return (
    <header className="sticky top-0 bg-white w-full h-28 md:h-20 md:border-b md:shadow-md z-50 ">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between p-4 lg:px-10 h-full">
        {/* Logo & User Icon */}
        <div className="w-full flex justify-between items-center md:w-auto">
          {/* Logo */}
          <Link to="/" className="flex">
            <img
              src={logoicon}
              alt="logo"
              className="w-12 sm:w-12 md:w-12 lg:w-12  h-auto"
            />
            <img
              src={logo}
              alt="logo"
              className="w-28 sm:w-32 md:w-40 lg:w-44 ml-[-1px] h-auto"
            />
          </Link>
          {/* address select */}
          {/* <LocationModal/> */}
          {/* <div
            onClick={() => setLocationModalOpen(true)}
            className="cursor-pointer hidden sm:flex flex-col items-start justify-center w-60 px-3 py-2"
          >
            <p className="text-sm font-semibold text-black">
              Delivery in 11 minutes
            </p>
            <div className="flex items-center w-full">
              <span className="text-sm font-semibold text-gray-700 mr-1">
                Home
              </span>
              {selectedLocation ? (
                <span
                  className="text-gray-700 max-w-xs truncate"
                  title={selectedLocation.address}
                >
                  {selectedLocation.address}
                </span>
              ) : (
                <span className="text-gray-500 italic">
                  No location selected
                </span>
              )}

              <svg
                className="ml-1 w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div> */}

          {/* User Icon (Hidden on Desktop) */}

          <button
            className="w-10 h-10 flex items-center border hover:border-red-400 justify-center rounded-full overflow-hidden drop-shadow-lg cursor-pointer md:hidden"
            onClick={handelMobileVersion}
          >
            {user.avtar ? (
              <img
                src={user.avtar}
                alt={user.name}
                className="w-10 h-10 object-cover"
              />
            ) : (
              <FaUserCircle size={40} />
            )}
          </button>
        </div>

        {/* Search Bar (Below Logo & User Icon on Mobile, Inside Header on Desktop) */}
        <div className="w-full mt-1.5 md:mt-0 md:w-auto">
          <Search className="w-full md:w-auto" />
        </div>

        {/* User Account & Cart (Only on Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {/* User Icon show only mobile verison */}
          <button
            className="text-neutral-500 hover:text-black lg:hidden"
            onClick={handelMobileVersion}
          >
            <FaUserCircle size={26} />
          </button>

          {/*Desktop */}
          <div className="hidden lg:flex items-center gap-10 ">
            {user?._id ? (
              <div className="relative">
                <div
                  onClick={() => setOpenUserMeny((preve) => !preve)}
                  className=" flex select-none6 items-center gap-2 cursor-pointer"
                >
                  <p>Account</p>
                  {openUserMenu ? (
                    <FaChevronUp size={15} />
                  ) : (
                    <FaChevronDown size={15} />
                  )}{" "}
                  {/* <FaChevronUp /> */}
                </div>
                {openUserMenu && (
                  <div className="absolute right-0 top-12">
                    <div className="bg-white  rounded p-4 min-w-52 shadow-lg">
                      <UserMenu close={handelCloseUserMenu} />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={redirectToLoginPage} className="text-lg px-8">
                Login
              </button>
            )}

            <button
              onClick={() => {
                if (cartItems.length !== 0) {
                  setOpenCartSection(true);
                }
              }}
              className={`flex items-center gap-2 px-2 py-1 rounded-lg transition relative ${
                cartItems.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-700 hover:bg-green-600"
              }`} // onClick={() => setShowCartDropdown(!showCartDropdown)}
            >
              {/* Animated Cart Icon */}
              <motion.div
                animate={{ y: [3, -3, 2] }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  ease: "easeInOut",
                }}
              >
                <IoCartOutline size={26} className=" text-white" />
              </motion.div>
              {/* Cart Text */}
              {cartItems[0] ? (
                <div className="text-white">
                  <p>{totalQty} Items</p>
                  <p>₹{totalPrice}</p>
                </div>
              ) : (
                <div className="text-sm text-white font-semibold py-2">
                  <p>My Cart</p>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {openCartSection && (
        <DisplayCartItem close={() => setOpenCartSection(false)} />
      )}

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        onSave={(location) => {
          setSelectedLocation(location);
        }}
      />
    </header>
  );
};

export default Header;
