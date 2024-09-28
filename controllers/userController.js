import bcrypt from 'bcryptjs';
import { User } from '../models/userModel.js';
import { Message } from '../models/messageModel.js'; // Ensure this import is needed or remove it
import  jwt  from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { fullName, userName, password, ConfirmPassword, gender } = req.body;

        if (!fullName || !userName || !password || !ConfirmPassword || !gender) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if (password !== ConfirmPassword) {
            return res.status(400).json({ success: false, message: "Password and Confirm Password do not match" });
        }

        const user = await User.findOne({ userName });
        if (user) {
            return res.status(400).json({ success: false, message: "Username already exists, try a different one" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Profile photo
        const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
        const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${userName}`;
        const profilePhoto = gender === 'male' ? maleProfilePhoto : femaleProfilePhoto;

        await User.create({
            fullName,
            userName,
            password: hashedPassword,
            profilePhoto,
            gender
        });

        res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};





export  const login = async (req, res) => {
    try {
        const { userName, password } = req.body;
        
        if (!userName || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(400).json({ message: "Incorrect username", success: false });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Incorrect password", success: false });
        }

        const tokenData = {
            userID: user._id
        };

        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            success: true,
            message: "Login successful",
            _id: user._id,
            username: user.userName,
            fullname: user.fullName,
            profilePhoto: user.profilePhoto
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


export const logout = async(req,res)=>{
    try{
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message:"logged out successfully"
        })
    }catch(err){
        console.log(err);
    }
}

export const getOtherUser = async (req,res)=>{
    try{
    const loggedInUserId = req.id;
    const otheUsers  = await User.find({_id:{$ne:loggedInUserId}}).select("-password");
    return res.status(200).json(otheUsers)
    }catch(err){
        console.log(err);
    }
}