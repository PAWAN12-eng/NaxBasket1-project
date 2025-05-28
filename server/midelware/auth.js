import jwt from "jsonwebtoken";

const auth = async(request, response, next) => {
    try {
        // ✅ Debugging: Log received cookies and headers
        // console.log("Cookies:", request.cookies);
        // console.log("Authorization Header:", request.headers.authorization);

        // ✅ Extract token from cookies or authorization header
        const token = request.cookies?.accessToken || request?.headers?.authorization?.split(" ")[1];
        // console.log("Token received:", token);


        if (!token) {
            return response.status(401).json({
                message: "Login Please",
                error: true,
                success: false
            });
        }
        
        // console.log("Extracted Token:", token);

        // ✅ Verify token using SECRET_KEY_ACCESS_TOKEN
        const decoded =await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
        // console.log("Decoded Token:", decoded);

        if(!decoded){
            return response.status(401).json({
                message: "Login Please",
                error: true,
                success: false
            })
        }

        // Attach user ID to request object
        request.userId = decoded.id;
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        return response.status(401).json({
            message: "Login Please",
            error: true,
            success: false
        });
    }
};

export default auth;
