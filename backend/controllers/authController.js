const User = require('../models/User');const bcrypt = require("bcryptjs");const jwt = require("jsonwebtoken");const sendEmail = require("../utils/sendEmail");const generateToken = (id) => {    return jwt.sign({id},process.env.JWT_SECRET, {expiresIn: "30d"});};const registerUser = async (req,res) =>{     const { name, email, password} = req.body;     try{        const existingUser = await User.findOne({ email });        const salt = await bcrypt.genSalt(10);        const hashedPassword = await bcrypt.hash(password,salt);        const otp = Math.floor(100000 + Math.random() * 900000).toString();        const otpExpire = new Date(Date.now() + 10 * 60 * 1000); 
        if(existingUser){            if (existingUser.verified) {                return res.status(400).json({ message: "User already exists" });            }            existingUser.name = name;            existingUser.password = hashedPassword;            existingUser.otp = otp;            existingUser.otpExpire = otpExpire;            await existingUser.save();        } else {            await User.create({                name,                email,                password: hashedPassword,                verified: false,                otp,                otpExpire            });        }        const message = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">  <!-- Header -->  <div style="background-color: #f97316; padding: 20px; text-align: center; color: #ffffff;">    <h1 style="margin: 0;">Welcome to VemiroNest!</h1>  </div>  <!-- Body -->  <div style="padding: 30px; line-height: 1.6; color: #333;">    <h2 style="color: #f97316;">Hi ${name},</h2>    <p>Thank you for registering with <strong>VemiroNest</strong>. We are excited to have you on board!</p>    <p>Your account is almost ready. Please verify your email address to complete your registration.</p>    <!-- OTP Section -->    <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 25px 0;">      <p style="margin: 0; font-size: 16px; color: #ffffff;">Your Registration OTP is:</p>      <h2 style="margin: 10px 0 0 0; color: #f97316; letter-spacing: 5px; font-size: 32px;">${otp}</h2>    </div>    <p>We look forward to providing you with the best shopping experience possible.</p>    <p>Best regards,<br>The VemiroNest Team</p>  </div></div>`;        sendEmail(email, 'Welcome To VemiroNest - Your OTP for Registration', message).catch(err => console.error(err));        res.status(200).json({             success: true,            message: "OTP sent to email. Please verify to complete registration."        });     }     catch(error){        res.status(500).json({message: "Server error", details: error.message});     }};const loginUser = async (req,res) =>{    const {email, password} =req.body;    try{        const user = await User.findOne({email});        if (user && (await bcrypt.compare(password,user.password))){            if (!user.verified) {                return res.status(401).json({message: "Account is unverified. Please register a new account."});            }            res.json({                _id: user._id,                name: user.name,                email: user.email,                role: user.role,                token: generateToken(user._id)            });        } else {            res.status(401).json({message: "Invalid Email or Password"});        }    }    catch(error){        res.status(500).json({message: "Server error"});    }};const verifyOTP = async (req, res) => {    const { email, otp } = req.body;    try {        const user = await User.findOne({ email });        if (!user) {            return res.status(404).json({ message: "User not found" });        }        if (user.verified) {            return res.status(400).json({ message: "User is already verified" });        }        if (user.otp !== otp || user.otpExpire < new Date()) {            return res.status(400).json({ message: "Invalid or expired OTP" });        }        user.verified = true;        user.otp = undefined;        user.otpExpire = undefined;        await user.save();        res.json({            _id: user._id,            name: user.name,            email: user.email,            role: user.role,            token: generateToken(user._id)        });    } catch (error) {        res.status(500).json({ message: "Server error", details: error.message });    }};const getUsers = async (req,res) =>{    try{        const users = await User.find({}).select('-password');        res.json(users);    }    catch(error){        res.status(500).json({message: "Server error"});    }};const toggleWishlist = async (req, res) => {    try {        const user = await User.findById(req.user._id);        const productId = req.params.id;        const alreadyAdded = user.wishlist.find((id) => id.toString() === productId);        if (alreadyAdded) {            user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);            await user.save();            res.json({ message: "Product removed from wishlist", wishlist: user.wishlist });        } else {            user.wishlist.push(productId);            await user.save();            res.json({ message: "Product added to wishlist", wishlist: user.wishlist });        }    } catch (error) {        res.status(500).json({ message: "Server error", details: error.message });    }};const getWishlist = async (req, res) => {    try {        const user = await User.findById(req.user._id).populate('wishlist');        res.json(user.wishlist);    } catch (error) {        res.status(500).json({ message: "Server error" });    }};const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "No account found with that email" });
        }
        
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpire = new Date(Date.now() + 10 * 60 * 1000);
        
        user.otp = otp;
        user.otpExpire = otpExpire;
        await user.save();
        
        const message = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
  <div style="background-color: #f97316; padding: 20px; text-align: center; color: #ffffff;">
    <h1 style="margin: 0;">Password Reset Request</h1>
  </div>
  <div style="padding: 30px; line-height: 1.6; color: #333;">
    <h2 style="color: #f97316;">Hi ${user.name},</h2>
    <p>You recently requested to reset your password for your <strong>VemiroNest</strong> account.</p>
    <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 25px 0;">
      <p style="margin: 0; font-size: 16px; color: #333;">Your Password Reset OTP is:</p>
      <h2 style="margin: 10px 0 0 0; color: #f97316; letter-spacing: 5px; font-size: 32px;">${otp}</h2>
    </div>
    <p>This OTP will expire in 10 minutes. If you did not request a password reset, please ignore this email.</p>
    <p>Best regards,<br>The VemiroNest Team</p>
  </div>
</div>`;
        sendEmail(user.email, 'VemiroNest - Password Reset OTP', message).catch(err => console.error(err));        res.status(200).json({ success: true, message: "OTP sent to email. Please verify to reset password." });    } catch (error) {        res.status(500).json({ message: "Server error", details: error.message });    }};

const verifyResetOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.otp !== otp || user.otpExpire < new Date()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        res.status(200).json({ success: true, message: "OTP verified successfully. You may now reset your password." });
    } catch (error) {
        res.status(500).json({ message: "Server error", details: error.message });
    }
};

const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.otp !== otp || user.otpExpire < new Date()) {
            return res.status(400).json({ message: "Invalid or expired OTP. Please request a new one." });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        user.password = hashedPassword;
        user.otp = undefined;
        user.otpExpire = undefined;
        await user.save();
        
        res.status(200).json({ success: true, message: "Password reset successfully. You can now log in." });
    } catch (error) {
        res.status(500).json({ message: "Server error", details: error.message });
    }
};

const updateUserRole = async (req, res) => {
    const { passkey, role } = req.body;
    
    try {
        if (passkey !== process.env.ADMIN_PROMOTION_PASSKEY) {
            return res.status(401).json({ message: "Invalid passkey. Unauthorized." });
        }
        
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        user.role = role || "admin";
        await user.save();
        
        res.status(200).json({ success: true, message: "User role updated successfully", user: { _id: user._id, name: user.name, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: "Server error", details: error.message });
    }
};

module.exports = { registerUser, loginUser, verifyOTP, getUsers, toggleWishlist, getWishlist, forgotPassword, verifyResetOTP, resetPassword, updateUserRole };