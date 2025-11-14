import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Name is required"]
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    }, 
    cartItem:[
        {
            quantity:{
                type: Number,
                required: [true, "Quantity is required"],
                min: [1, "Quantity must be at least 1"],
                default: 1
            },
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: [true, "Product reference is required"]
            }
        }
    ],
    role:{
        type: String,
        enum: ["customer", "admin"],
        default: "customer"
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    // Here you can add password hashing logic if needed
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        return next(error);
    }
       
    
    next();
});

export default User;