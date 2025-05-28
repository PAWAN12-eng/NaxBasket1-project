import React, { useState } from 'react';
import { IoEyeOffSharp, IoEye } from "react-icons/io5";
import toast, { Toaster } from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosTostError from '../utils/AxiosTosterror';
import { toFormData } from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [data, setData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });
   const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid = Object.values(data).every(value => value.trim() !== '');

  const handelSubmit = async (e) => {
    e.preventDefault()

    if (data.password !== data.confirmPassword) {
      toast.error(
        "password and Confirm password must be same"
      )
      return
    }

    try {
      const response = await Axios({
        ...SummaryApi.register,
        data: data
      })
        if(response.data.error){
          toast.error(response.data.message)
        }
      if (response.data.success) {
        toast.success("Registration successful!");
        setData({
          name: "",
          email: "",
          mobile: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/login")
      } else {
        toast.error("Something went wrong, please try again");
      }
    } catch (error) {
      AxiosTostError(error)

    }
  }

  return (
    <div className="flex items-center justify-center w-full mx-auto p-1">
      <div className="bg-white my-2 w-full max-w-md mx-auto rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-center text-gray-800 mb-2">
          Welcome to NexBasket
        </h2>

        <form className="grid gap-2" onSubmit={handelSubmit}>
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-gray-700 text-sm">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={data.name}
              onChange={handleChange}
              className="w-full p-2 rounded border outline-none text-sm focus:ring-1 focus:ring-yellow-500 bg-blue-100"
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={data.email}
              onChange={handleChange}
              className="w-full p-2 rounded border outline-none text-sm focus:ring-1 focus:ring-yellow-500 bg-blue-100"
            />
          </div>

          {/* Mobile Input */}
          <div>
            <label htmlFor="mobile" className="block text-gray-700 text-sm">Mobile</label>
            <input
              type="text"
              name="mobile"
              placeholder="Enter your mobile number"
              value={data.mobile}
              onChange={handleChange}
              className="w-full p-2 rounded border outline-none text-sm focus:ring-1 focus:ring-yellow-500 bg-blue-100"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter password"
                value={data.password}
                onChange={handleChange}
                className="w-full p-2 rounded border outline-none text-sm focus:ring-1 focus:ring-yellow-500 bg-blue-100"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <IoEyeOffSharp /> : <IoEye />}
              </span>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Re-enter password"
                value={data.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 rounded border outline-none text-sm focus:ring-1 focus:ring-yellow-500 bg-blue-100"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <IoEyeOffSharp /> : <IoEye />}
              </span>
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-1.5 mt-2 rounded text-sm font-semibold transition ${isFormValid ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
          >
            Register
          </button>
        </form>

        {/* Switch to Login */}
        <p className="text-center mt-2 text-gray-700 text-xs ">
          Already have an account? <Link to={"/login"} className="text-blue-500 font-bold cursor-pointer hover:text-blue-800">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
