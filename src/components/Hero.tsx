"use client";
import React, { useState } from "react";
import {
  Smartphone,
  Laptop,
  Headphones,
  Camera,
} from "lucide-react";
import { useRouter } from "next/navigation"; // Import useRouter

const Hero = () => {
  const featuredCategories = [
    {
      name: "Smartphones",
      icon: <Smartphone className="w-10 h-10" />,
      color: "bg-blue-500/60",
    },
    {
      name: "Laptops",
      icon: <Laptop className="w-10 h-10" />,
      color: "bg-lime-500/60",
    },
    {
      name: "Audio",
      icon: <Headphones className="w-10 h-10" />,
      color: "bg-yellow-500/60",
    },
    {
      name: "Cameras",
      icon: <Camera className="w-10 h-10" />,
      color: "bg-purple-500/60",
    },
  ];

  const promotions = [
    { id: 1, title: "20% OFF", description: "New Arrivals" },
    { id: 2, title: "FREE SHIPPING", description: "Orders over $100" },
    { id: 3, title: "FLASH SALE", description: "Ends in 24h" },
  ];

  // Product Data (Example)
  const [products, setProducts] = useState([
    {
      id: "1",
      name: "Wireless Headphones",
      price: 129.99,
      description: "High-quality wireless headphones with noise cancellation",
      imageUrl: "https://placehold.co/600x400",
      category: "Electronics",
      rating: 4.7,
      stockCount: 15,
      features: ["Noise cancellation", "Bluetooth 5.0", "30-hour battery life"],
    },
    {
      id: "2",
      name: "Laptop",
      price: 299.0,
      description: "15.6-inch laptop with Intel Core i5 processor and 8GB RAM",
      imageUrl: "https://placehold.co/600x400",
      category: "Electronics",
      rating: 4.9,
      stockCount: 20,
      features: ["Intel Core i5 processor", "8GB RAM", "128GB SSD"],
    },
    {
      id: "3",
      name: "Smartphone",
      price: 199.99,
      description:
        "High-quality smartphone with Snapdragon 888 processor and 6GB RAM",
      imageUrl: "https://placehold.co/600x400",
      category: "Electronics",
      rating: 4.5,
      stockCount: 30,
      features: ["Snapdragon 888 processor", "6GB RAM", "128GB storage"],
    },
    {
      id: "4",
      name: "Camera",
      price: 149.99,
      description: "High-quality camera with 12MP sensor and autofocus",
      imageUrl: "https://placehold.co/600x400",
      category: "Cameras",
      rating: 4.8,
      stockCount: 25,
      features: ["12MP sensor", "Autofocus", "LED flash"],
    },
  ]);

  const [cart, setCart] = useState([]);
  const router = useRouter(); // Initialize useRouter

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.id === product.id
      );

      if (existingItemIndex !== -1) {
        // If the item already exists, update the quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1,
        };
        localStorage.setItem("cart", JSON.stringify(updatedCart)); // Save to localStorage
        return updatedCart;
      } else {
        // If the item doesn't exist, add it to the cart with a quantity of 1
        const newCart = [...prevCart, { ...product, quantity: 1 }];
        localStorage.setItem("cart", JSON.stringify(newCart)); // Save to localStorage
        return newCart;
      }
    });
  };

  const handleViewCart = () => {
    router.push("/cart"); // Navigate to the cart page
  };

  return (
    <>

    <div className="bg-gradient-to-t from-blue-50  py-10">
      {/* Main Hero Section */}
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-10">
          {/* Left Side Content */}
          <div className="md:w-1/2 space-y-6  ">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Next-Gen Tech{" "}
              <span className="text-indigo-600">At Your Fingertips</span>
            </h1>
            <p className="text-lg text-gray-700 max-w-md">
              Discover cutting-edge electronics with unbeatable prices and
              exceptional customer service.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300 flex items-center gap-2">
                Shop Now
              </button>
              <button className="bg-white hover:bg-gray-100 text-indigo-600 font-medium py-2 px-6 rounded-lg border border-indigo-600 transition duration-300">
                View Deals
              </button>
            </div>
          </div>

          {/* Right Side Image */}

          <div className="">
            <img
              src="https://m-cdn.phonearena.com/images/article/64576-wide-two_940/The-Best-Phones-to-buy-in-2024.jpg?1721310720"
              alt="Latest Electronics"
              className="rounded-lg object-cover w-full h-[340px]"
            />
          </div>
        </div>

        {/* Promotion Banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-10">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="bg-white border border-gray-200 p-6 rounded-lg text-center"
            >
              <h3 className="text-xl font-bold text-indigo-600">
                {promo.title}
              </h3>
              <p className="text-gray-700">{promo.description}</p>
            </div>
          ))}
        </div>

        {/* Category Quick Access */}
        <div className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Shop By Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredCategories.map((category, index) => (
              <div
                key={index}
                className={`${category.color} p-6 rounded-lg hover:shadow-md transition duration-300 text-center cursor-pointer`}
              >
                <div className="flex justify-center mb-3">{category.icon}</div>
                <p className="font-medium">{category.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div className="my-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {product.name}
                  </h3>
                  <p className="text-gray-700">${product.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {product.description}
                  </p>
                  <button
                    onClick={() => addToCart(product)}
                    className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Hero;
