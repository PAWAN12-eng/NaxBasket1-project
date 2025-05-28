import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosTostError from "../utils/AxiosTosterror";

const OtpVerification = () => {
    const [data, setData] = useState(["", "", "", "", "", ""]);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location?.state?.email || ""; // <-- Get email from route state

    useEffect(() => {
        if (!location?.state?.email) {
            navigate('/forgot-password')
        }
    }, [])
    const isFormValid = data.every((el) => el);

    const handleChange = (index, value) => {
        if (isNaN(value)) return; // Only allow numbers

        const newData = [...data];
        newData[index] = value.slice(-1); // Allow only one digit per box
        setData(newData);


        // Move to next input field
        if (value && index < data.length - 1) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !data[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await Axios({
                ...SummaryApi.verifyOtp,
                data: { email, otp: data.join("") }, // Send OTP as string
            });

            if (response.data.error) {
                toast.error(response.data.message);
            } else if (response.data.success) {
                toast.success(response.data.message);
                setData(["", "", "", "", "", ""]);
                navigate("/reset-password",{
                    state:{
                        data: response.data,
                        email:email
                    }
                });
            } else {
                toast.error("Something went wrong, please try again");
            }
        } catch (error) {
            AxiosTostError(error);
        }
    };

    return (
        <div className="flex items-center justify-center w-full mx-auto p-1">
            <div className="bg-white my-2 w-full max-w-md mx-auto rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-center text-gray-800">
                    Enter OTP
                </h2>
                <p className="text-sm text-gray-600 mb-4">Enter Your OTP :</p>

                <form onSubmit={handleSubmit} className="flex flex-col items-center">
                    <div className="flex gap-2 mb-4">
                        {data.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-10 h-10 text-center text-lg border rounded focus:ring-2 focus:ring-green-500 bg-blue-100 outline-none"
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-2 text-white font-semibold rounded transition ${isFormValid
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-gray-400 cursor-not-allowed"
                            }`}
                        disabled={!isFormValid}
                    >
                        Verify OTP
                    </button>
                </form>

                <p className="text-center mt-3 text-gray-700 text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500 cursor-pointer">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default OtpVerification;
