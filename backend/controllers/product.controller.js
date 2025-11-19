import Product from "../models/product.model.js";
import { redis } from "../lib/redis.js";

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({}); // Fetch all products from the database
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const getFeaturedProducts = async (req, res) => {
    try {
        let featuredProducts = await redis.get("featured_products");
        if (featuredProducts) {
            return res.status(200).json(JSON.parse(featuredProducts));
        }

        featuredProducts = await Product.find({ isFeatured: true }).limit(10).lean();

        if(!featuredProducts){
            return res.status(404).json({ message: "No featured products found" });
        }

        await redis.set("featured_products", JSON.stringify(featuredProducts), "EX", 3600); // Cache for 1 hour

        res.status(200).json(featuredProducts);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};