import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date }
}, { timestamps: true }); // adds createdAt and updatedAt

export default mongoose.model("User", userSchema);
