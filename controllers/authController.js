import User from "../models/User.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"
import validator from "validator";
import crypto from "crypto"



export const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Please enter a valid email' });
        }
        const existUserCheck = await User.findOne({ email })
        if (existUserCheck) return res.status(400).json({ message: 'User already exists1' })
        const hashedpass = await bcrypt.hash(password, 10)
        const newUser = await User.create({ name, email, password: hashedpass });
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token, user: { id: newUser._id, name: newUser.name, email: newUser.email } });

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server error' });
    }

}

export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(404).json({ message: "user not found" })
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' });
    }
}

export const forgotPassword = async (req, res) => {
    try{
    const { email } = req.body;
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: "user not found" })

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    const resetUri = `https://sales-tracker-three-pi.vercel.app/reset-password/${resetToken}`;


    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASSWORD },
    })

      await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Password Reset Request",
      text: `Click the link to reset your password: ${resetUri}`,
    });

    res.status(200).json({ message: "Reset link sent successfully" });
  } catch (err) {
    console.error("ForgotPassword error:", err);
    res.status(500).json({ message: "Email could not be sent", error: err.message });
  }
};

export const resetPassword=async(req,res)=>{
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
 if (!user) return res.status(400).json({ message: "Invalid or expired token" });

  user.password = await bcrypt.hash(password, 10); // hash if using bcrypt
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ message: "Password reset successful" });
};

