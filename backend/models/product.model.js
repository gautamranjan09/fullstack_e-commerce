import mongoose from "mongoose";

const productScehma = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      min: 0,
      required: [true, "Product price is required"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productScehma);
export default Product;
