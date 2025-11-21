import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push(productId);
    }

    await user.save();
    res.status(200).json({ message: "Product added to cart successfully", cartItems: user.cartItems });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }

    await user.save();
    res.status(200).json({ message: "Products removed from cart successfully", cartItems: user.cartItems });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;

    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
      if(quantity === 0){
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);
      }
      existingItem.quantity = quantity;
      await user.save();
      res.status(200).json({ message: "Product quantity updated successfully", cartItems: user.cartItems });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message }); 
  }
};

export const getCartProduct = async (req, res) => {
  try {
    const products = await Product.find({ _id: { $in: req.user.cartItems } });

    const cartItems = products.map(product => {
      const item = req.user.cartItems.find(item => item.id === product.id);
      return {
        ...product.toJSON(),
        quantity: item.quantity 
      };
    });

    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
