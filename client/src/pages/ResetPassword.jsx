import React, { useEffect, useState } from 'react';
import { IoEye, IoEyeOffSharp } from "react-icons/io5";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosTostError from '../utils/AxiosTosterror';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [data, setData] = useState({
        newPassword: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email; // email passed from OtpVerification page

    useEffect(() => {
        if (!location?.state?.email) {
            navigate('/forgot-password')
        }
    }, [])

    // Handle form input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const isFormValid =
        data.newPassword.trim() !== '' &&
        data.confirmPassword.trim() !== '' &&
        data.newPassword === data.confirmPassword;

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Email is missing! Please go through the forgot password flow again.");
            return;
        }

        try {
            const response = await Axios({
                ...SummaryApi.reset_password, // Make sure this is set up in your API config
                data: {
                    email: email,
                    newPassword: data.newPassword,
                    confirmPassword:data.confirmPassword
                },
            });

            if (response.data.error) {
                toast.error(response.data.message);
            } else if (response.data.success) {
                toast.success("Password reset successful!");
                navigate("/login");
            } else {
                toast.error("Something went wrong.");
            }
        } catch (error) {
            AxiosTostError(error);
        }
    };

    return (
        <div className="flex items-center justify-center w-full mx-auto p-2">
            <div className="bg-white my-2 w-full max-w-md mx-auto rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-center text-gray-800 mb-3">
                    Reset Password
                </h2>

                <form className="grid gap-3" onSubmit={handleSubmit}>
                    {/* New Password */}
                    <div>
                        <label htmlFor="newPassword" className="text-sm text-gray-700">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="newPassword"
                                value={data.newPassword}
                                onChange={handleChange}
                                placeholder="Enter new password"
                                className="w-full p-2 rounded border outline-none text-sm bg-blue-100 focus:ring-1 focus:ring-yellow-500"
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <IoEyeOffSharp /> : <IoEye />}
                            </span>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="confirmPassword" className="text-sm text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={data.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm password"
                            className="w-full p-2 rounded border outline-none text-sm bg-blue-100 focus:ring-1 focus:ring-yellow-500"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!isFormValid}
                        className={`w-full py-1.5 mt-2 rounded text-sm font-semibold transition ${isFormValid ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`}
                    >
                        Reset Password
                    </button>
                </form>
                <p className="text-center mt-2 text-gray-700 text-xs ">
                    Already have an account? <Link to={"/login"} className="text-blue-500 font-bold cursor-pointer hover:text-blue-800">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;
