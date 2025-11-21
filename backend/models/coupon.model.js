import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, "Coupon code is required"],
        unique: true,
        uppercase: true,
        trim: true,
    },
    discountPercentage: {
        type: Number,
        required: [true, "Discount percentage is required"],
        min: [0, "Discount percentage must be at least 0"],
        max: [100, "Discount percentage cannot exceed 100"],
    },
    expirationDate: {
        type: Date,
        required: [true, "Expiration date is required"],
    },
    isActive:{
        type: Boolean,
        default: true,
    },
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"],
        unique: true,
    }
}, { timestamps: true });

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;