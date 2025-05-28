import sendemail from "../config/sendEmail.js";
import UserModel from "../models/user.models.js";
import bcryptjs from "bcryptjs"
import crypto from "crypto";
import verificationemailtamplate from "../utils/verificationemailtamplate.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import generatedOpt from "../utils/generateOtp.js";
import forgotpasswordTemplate from "../utils/forgotpasswordTemplate.js";
import jwt from "jsonwebtoken";
import { error } from "console";
import { logActivity } from "./External.controller.js";

// cheked
export async function resisterUsercontroller(request, response) {
    try {
        const { name, email, password } = request.body;

        if (!name || !email || !password) {
            return response.status(400).json({
                message: "provide email,name, password",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email })

        if (user) {
            return response.status(400).json({
                message: "Already resister email",
                error: true,
                success: false
            })
        }
        const salt = await bcryptjs.genSalt(10);
        const hashpassword = await bcryptjs.hash(password, salt);

        const payload = {
            name,
            email,
            password: hashpassword
        }

        const newUser = new UserModel(payload);
        const save = await newUser.save()

        const verifyEmailUrl = `${process.env.FRONTED_URL}/verify-email?code=${save?._id}`

        const verifyEmail = await sendemail({
            sendTo: email,
            subject: 'verify email from blinkit',
            html: verificationemailtamplate({
                name,
                url: verifyEmailUrl
            })
        })


        await logActivity('user_registered', `New user registered: ${name},${email}`);

        return response.status(201).json({
            message: "user resistration successfully",
            error: false,
            success: true,
            data: save
        })

    } catch (error) {
        // return res.status(500).send("reisterUsercontroller file show error")
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function verifiyEmailcontroller(request, response) {
    try {
        const { code } = request.body;

        const user = await UserModel.findOne({ _id: code })

        if (!user) {
            return response.status(400).json({
                message: "Invalid code",
                error: true,
                success: false
            })
        }

        const updateUser = await UserModel.updateOne({ _id: code }, {
            verify_email: true
        })

        return response.json({
            message: "verify email done",
            success: true,
            error: false
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: true
        })
    }
}

// login controller
// check
export async function loginController(request, response) {
    try {
        const { email, password } = request.body;

        if (!email || !password) {
            return response.status(400).json({
                message: 'Provide the email and password',
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({
                message: 'User Not Registered',
                error: true,
                success: false
            });
        }

        if (user.status !== "Active") {
            return response.status(400).json({
                message: 'Contact to Admin',
                error: true,
                success: false
            });
        }

        const checkPassword = await bcryptjs.compare(password, user.password);
        if (!checkPassword) {
            return response.status(400).json({
                message: 'Check Your Password',
                error: true,
                success: false
            });
        }

        // ✅ Generate Access & Refresh Tokens
        const accessToken = await generatedAccessToken(user._id);
        const refreshToken = await generateRefreshToken(user._id);

        // ✅ Update last login date
        await UserModel.findByIdAndUpdate(user._id, {
            last_login_date: new Date()
        }); 
        // await logActivity('product_added', `New product added: ${name}`);
        // ✅ Cookie Options
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        };

        // ✅ Set Tokens in Cookies
        response.cookie("accessToken", accessToken, cookieOptions);
        response.cookie("refreshToken", refreshToken, cookieOptions);

        // ✅ Debugging: Log response headers to confirm cookies are sent
        // console.log("Response Headers:", response.getHeaders());

        return response.json({
            message: 'Login Successful',
            error: false,
            success: true,
            data: {
                accessToken,
                refreshToken,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }
            }
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

//logout cotroller

export async function logoutController(request, response) {
    try {
      // Disable cache
      response.setHeader("Cache-Control", "no-store");
      response.setHeader("Pragma", "no-cache");
  
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
      };
  
      response.clearCookie("accessToken", cookieOptions);
      response.clearCookie("refreshToken", cookieOptions);
  
      if (request.userId) {
        await UserModel.findByIdAndUpdate(request.userId, {
          refresh_token: ""
        });
      }
  
      return response.status(200).json({
        message: "Logout successful",
        error: false,
        success: true
      });
  
    } catch (error) {
      return response.status(500).json({
        message: error.message || "Internal Server Error",
        error: true,
        success: false
      });
    }
  }
  

//uplaad user avtar 3:08:21
export async function uploadAvtar(request, response) {
    try {
        const userId = request.userId;  // auth middelware
        const image = request.file;   //multer middelware

        // If storing locally:
        // const imageUrl = `/uploads/avtar/${image.filename}`;

        // If using Cloudinary:
        const upload = await uploadImageCloudinary(image);
        // const imageUrl = upload.url;

        // ✅ Save to MongoDB
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {
            avtar: upload.url
        });

        return response.json({
            message: "Profile uploaded",
            success:true,
            error:false,
            data: {
                _id: userId,
                avtar: upload.url
            }
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
}

export const updateUserDetails = async (req, res) => {
    try {
        const userId = req.userId;  // Extracted from auth middleware
        const { name, email, mobile, password } = req.body;

        let hashpassword = ""

        if (password) {
            const salt = await bcryptjs.genSalt(10);
            hashpassword = await bcryptjs.hash(password, salt);
        }

        const updatedUser = await UserModel.updateOne({ _id: userId }, {
            ...(name && { name: name }),
            ...(email && { email: email }),
            ...(mobile && { mobile: mobile }),
            ...(password && { password: hashpassword })

        });



        return res.json({
            message: "Updated successfully",
            error: false,
            success: true,
            data: updatedUser
        });
    } catch (error) {
        // console.error("Error updating profile:", error);
        res.status(500).json({
            message: "Server error",
            error: true,
            success: false
        });
    }
};

//for forgot password
export async function forgotPasswordController(req, res) {
    try {
        const { email } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: 'email not valid',
                success: false,
                error: true,
            });
        }

        // Generate OTP and save it with expiry time (5 mins)
        const otp = generatedOpt()
        const expireTime = Date.now() + 60 * 60 * 1000; //1hr
        // await user.save();

        const update = await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: otp,
            forgot_password_expiry: new Date(expireTime).toISOString()
        })

        // Send OTP via email
        await sendemail({
            sendTo: email,
            subject: 'forgot password form NexBasket',
            html: forgotpasswordTemplate({
                name: user.name,
                otp: otp
            })
        });

        return res.status(200).json({
            message: 'check your email',
            success: true,
            error: false,
        });
    } catch (error) {
        // console.error('❌ Error in forgotPasswordController:', error);
        res.status(500).json({
            message: error.message || error,
            success: false,
            error: true,
        });
    }
}

//verify opt 
export async function verifyforgotPasswordController(req, res) {
    try {
        const { email, otp } = req.body;

        // 1. Validate Input
        if (!email || !otp) {
            return res.status(400).json({
                message: 'Email and OTP are required',
                success: false,
                error: true,
            });
        }

        // 2. Find User by Email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false,
                error: true,
            });
        }

        const currrentTime = new Date().toISOString
        // const currrentTime = new Date().toISOString(); // ✅ Correct


        if (user.forgot_password_expiry < currrentTime) {
            return res.status(400).json({
                message: 'expired OTP',
                success: false,
                error: true,
            })
        }
        // 3. Check OTP Validity
        if (otp !== user.forgot_password_otp) {
            return res.status(400).json({
                message: 'Invalid Otp',
                success: false,
                error: true,
            })
        }

        // 5. Update User's Password and Clear OTP Fields
      const updateuser = await UserModel.findByIdAndUpdate(user?._id,{
        forgot_password_otp:"",
        forgot_password_expiry:""
      })

        return res.status(200).json({
            message: 'verify email successful',
            success: true,
            error: false,
        });
    } catch (error) {
        console.error('❌ Error in verifyOtpController:', error);
        return res.status(500).json({
            message: 'Internal Server Error',
            success: false,
            error: true,
        });
    }
}

export async function resetPassword(req, res) {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        // 1. Validate Input
        if (!email || !confirmPassword || !newPassword) {
            return res.status(400).json({
                message: 'Email, confirmPassword, and new password are required',
                success: false,
                error: true,
            });
        }

        // 2. Find User by Email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: 'email not found',
                success: false,
                error: true,
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: 'newpassword and confirmPassword not same',
                success: false,
                error: true,
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashpassword = await bcryptjs.hash(newPassword, salt);

        // 5. Update User's Password and Clear OTP Fields
        await UserModel.findByIdAndUpdate(user._id, {
            password: hashpassword,
        });

        return res.status(200).json({
            message: 'Password update successful',
            success: true,
            error: false,
        });
    } catch (error) {
        console.error('❌ Error in resetPassword:', error)
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true,
        });
    }
}

//refresh token controller
export async function refreshToken(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken || req?.headers?.authorization?.split('')[1]


        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token is missing or invalid token",
                success: false,
                error: true,
            });
        }
        // console.log("refresh token",refreshToken)
        // Verify refresh token
        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN)
        if (!verifyToken) {
            return res.status(403).json({
                message: "token is expire",
                success: false,
                error: true,
            });
        }
        // console.log('verifiytoken',verifyToken)
        const userId = verifyToken?._id

        const newAccessToken = await generatedAccessToken(userId)

        // ✅ Cookie Options
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        };

        res.cookie('accessToken', newAccessToken, cookieOptions)

        return res.status(200).json({
            message: "New Access token generated",
            success: true,
            error: false,
            data: {
                accessToken: newAccessToken
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false,
            error: true,
        });
    }
}

// user Details
export async function UserDetails(req, res) {
    try {
        const userId = req.userId;

        // Fetch user details by ID
        const user = await UserModel.findById(userId).select('-password -refresh_token')

        return res.status(200).json(
            {
                message: "user Details",
                data: user,
                error: false,
                success: true,
            }
        );
    } catch (error) {
        res.status(500).json({ success: false, message: "Something is wrong to fetching user details", error: error.message });
    }
};


// update avtar of the user 

