"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Loading from "../../../components/Loading";
import { db } from "../../../../firebase"; // Import your Firebase configuration
import { doc, getDoc } from "firebase/firestore";

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    // Reset state when product ID changes
    setLoading(true);
    setError(null);
    setAddedToCart(false);
    setQuantity(1);

    const fetchProduct = async () => {
      try {
        const productRef = doc(db, "products", id);
        const docSnap = await getDoc(productRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product data");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setQuantity(Math.min(value, product?.stockCount || 999));
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    try {
      // Retrieve current cart from localStorage
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");

      // Check if product already exists in cart
      const existingItemIndex = cart.findIndex(
        (item) => item.id === product.id
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        cart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: quantity,
        });
      }

      // Save updated cart
      localStorage.setItem("cart", JSON.stringify(cart));

      // Show success message
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleIncrement = () => {
    if (product && quantity < product.stockCount) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="container mx-auto px-4 py-6 flex-grow flex flex-col items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {error || "Product not found"}
            </h2>
            <p className="text-gray-600 mb-6">
              The product you're looking for may have been removed or doesn't
              exist.
            </p>
            <button
              onClick={handleGoBack}
              className="bg-primary px-6 py-3 rounded-lg text-lg font-medium hover:bg-primary-dark transition-colors"
            >
              Return to Products
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-6 flex-grow">
        {/* Breadcrumb navigation */}
        <nav className="flex mb-6 text-sm">
          <button
            onClick={() => router.push("/")}
            className="text-gray-500 hover:text-gray-700"
          >
            Home
          </button>
          <span className="mx-2 text-gray-500">/</span>
          <button
            onClick={() => router.push("/products")}
            className="text-gray-500 hover:text-gray-700"
          >
            Products
          </button>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image with better image handling */}
          <div className="w-full">
            <div
              className="relative w-full bg-gray-100 rounded-lg overflow-hidden"
              style={{ height: "400px" }}
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="px-0 md:px-4 flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {product.name}
            </h1>

            {/* Price and Rating */}
            <div className="flex items-center mb-4">
              <p className="text-xl md:text-2xl font-semibold text-gray-800">
                ${product.price.toFixed(2)}
              </p>
              {product.rating && (
                <div className="ml-4 flex items-center">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-1 text-sm text-gray-600">
                    ({product.rating})
                  </span>
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-4">
              {product.stockCount > 0 ? (
                <span className="text-green-600 font-medium">
                  In Stock ({product.stockCount} available)
                </span>
              ) : (
                <span className="text-red-600 font-medium">Out of Stock</span>
              )}
            </div>

            {/* Description */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h2 className="font-semibold text-lg mb-2">Description</h2>
              <p className="text-gray-700">{product.description}</p>
            </div>

            {/* Features list if available */}
            {product.features && product.features.length > 0 && (
              <div className="mb-6">
                <h2 className="font-semibold text-lg mb-2">Key Features</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity selector */}
            <div className="flex flex-col mb-6">
              <label htmlFor="quantity" className="mb-2 font-semibold">
                Quantity:
              </label>
              <div className="flex items-center border rounded max-w-xs">
                <button
                  onClick={handleDecrement}
                  className="px-4 py-2 hover:bg-gray-100 focus:outline-none disabled:opacity-50"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-16 text-center py-2 px-2 focus:outline-none"
                  min="1"
                  max={product.stockCount || 999}
                />
                <button
                  onClick={handleIncrement}
                  className="px-4 py-2 hover:bg-gray-100 focus:outline-none disabled:opacity-50"
                  aria-label="Increase quantity"
                  disabled={
                    product.stockCount && quantity >= product.stockCount
                  }
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="mt-auto">
              {addedToCart ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Added to cart!
                </div>
              ) : null}

              <button
                onClick={handleAddToCart}
                disabled={!product.stockCount}
                className={`w-full md:w-auto bg-primary px-6 py-3 rounded-lg text-lg font-medium transition-colors ${
                  product.stockCount
                    ? "hover:bg-primary-dark"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                {product.stockCount ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
