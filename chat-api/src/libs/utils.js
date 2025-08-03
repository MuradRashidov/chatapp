import jwt from "jsonwebtoken";
export const generateToken = async (userId,res) => {
    const secret = process.env.JWT_SECRET_KEY
    const token = jwt.sign({userId},secret,{expiresIn: "7d"});
    res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000,
        httpOnly:true,
        sameSite:"strict",
        secure: process.env.NODE_ENV !== "development"
    })
    return token
}