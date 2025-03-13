"use client";
import { useState, useEffect } from "react";
import { db, auth } from "../../../../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Navbar from "@/components/AdminComponent/Navbar";
import Footer from "@/components/Footer";

const Hero = () => {
  const [user, loading] = useAuthState(auth);
  const [products, setProducts] = useState([]);
  const [newProductName, setNewProductName] = useState("");
  const [newProductDescription, setNewProductDescription] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductImageUrl, setNewProductImageUrl] = useState("");
  const [newProductStockCount, setNewProductStockCount] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("");
  const [editProductId, setEditProductId] = useState(null);
  const [editProductName, setEditProductName] = useState("");
  const [editProductDescription, setEditProductDescription] = useState("");
  const [editProductPrice, setEditProductPrice] = useState("");
  const [editProductImageUrl, setEditProductImageUrl] = useState("");
  const [editProductStockCount, setEditProductStockCount] = useState("");
  const [editProductCategory, setEditProductCategory] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (loading) {
      return; // Wait for auth to load
    }

    if (!user) {
      // Redirect or display a message if not authenticated
      console.log("User not authenticated. Redirect to login or show message.");
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        const productList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);

        // Extract unique categories
        const uniqueCategories = new Set();
        productList.forEach((product) => {
          if (product.category && product.category.trim() !== "") {
            uniqueCategories.add(product.category);
          }
        });
        setCategories(Array.from(uniqueCategories).sort());

        setLoadingProducts(false);
        setError(null); // Clear any previous errors
      },
      (error) => {
        console.error("Error fetching products: ", error);
        setError("Failed to load products. Please try again.");
        setLoadingProducts(false);
      }
    );

    return () => unsubscribe(); // Cleanup on unmount
  }, [user, loading]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProductName || !newProductDescription || !newProductPrice) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await addDoc(collection(db, "products"), {
        name: newProductName,
        description: newProductDescription,
        price: parseFloat(newProductPrice),
        imageUrl: newProductImageUrl || "",
        stockCount: newProductStockCount
          ? parseInt(newProductStockCount, 10)
          : 0,
        category: newProductCategory || "", // Add category
        features: [], // Adding an empty features array for future use
        rating: null, // Adding a null rating for future use
        createdAt: Date.now(), // Add timestamp for sorting by newest
      });

      // Clear form
      setNewProductName("");
      setNewProductDescription("");
      setNewProductPrice("");
      setNewProductImageUrl("");
      setNewProductStockCount("");
      setNewProductCategory("");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Check console for details.");
    }
  };

  const handleEditProduct = (product) => {
    setEditProductId(product.id);
    setEditProductName(product.name);
    setEditProductDescription(product.description);
    setEditProductPrice(product.price);
    setEditProductImageUrl(product.imageUrl || "");
    setEditProductStockCount(
      product.stockCount !== undefined ? product.stockCount : 0
    );
    setEditProductCategory(product.category || "");
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editProductName || !editProductDescription || !editProductPrice) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const productRef = doc(db, "products", editProductId);
      await updateDoc(productRef, {
        name: editProductName,
        description: editProductDescription,
        price: parseFloat(editProductPrice),
        imageUrl: editProductImageUrl || "",
        stockCount: editProductStockCount
          ? parseInt(editProductStockCount, 10)
          : 0,
        category: editProductCategory || "",
        updatedAt: Date.now(), // Add update timestamp
      });
      setEditProductId(null); // Exit edit mode
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Check console for details.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "products", productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Check console for details.");
    }
  };

  const getStockStatusClass = (stockCount) => {
    if (stockCount === undefined || stockCount === null) return "text-gray-500";
    if (stockCount <= 0) return "text-red-500 font-semibold";
    if (stockCount < 10) return "text-orange-500 font-semibold";
    return "text-green-500 font-semibold";
  };

  const getStockStatusText = (stockCount) => {
    if (stockCount === undefined || stockCount === null) return "Not set";
    if (stockCount <= 0) return "Out of Stock";
    if (stockCount < 10) return `Low Stock (${stockCount})`;
    return `In Stock (${stockCount})`;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <p>Please log in to access the admin panel.</p>
        {/* You could add a link to your login page here */}
      </div>
    );
  }

  if (loadingProducts) {
    return (
      <div className="container mx-auto p-4">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Product Details</h1>

        {/* Add Product Form */}
        <div className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8">
          <h2 className="text-xl font-semibold mb-2">Add Product</h2>
          <form onSubmit={handleAddProduct}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="productName"
              >
                Name <span className="text-red-500">*</span>
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="productName"
                type="text"
                placeholder="Product Name"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="productDescription"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="productDescription"
                placeholder="Product Description"
                value={newProductDescription}
                onChange={(e) => setNewProductDescription(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="productCategory"
              >
                Category
              </label>
              <div className="flex items-center">
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="productCategory"
                  type="text"
                  list="categoryOptions"
                  placeholder="Product Category"
                  value={newProductCategory}
                  onChange={(e) => setNewProductCategory(e.target.value)}
                />
                <datalist id="categoryOptions">
                  {categories.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Enter an existing category or create a new one
              </p>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="productPrice"
              >
                Price <span className="text-red-500">*</span>
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="productPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="Product Price"
                value={newProductPrice}
                onChange={(e) => setNewProductPrice(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="productStockCount"
              >
                Stock Count
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="productStockCount"
                type="number"
                min="0"
                placeholder="Available Quantity"
                value={newProductStockCount}
                onChange={(e) => setNewProductStockCount(e.target.value)}
              />
              <p className="text-sm text-gray-500 mt-1">
                Set to 0 for out of stock items
              </p>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="productImageUrl"
              >
                Image URL
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="productImageUrl"
                type="text"
                placeholder="Image URL"
                value={newProductImageUrl}
                onChange={(e) => setNewProductImageUrl(e.target.value)}
              />
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Add Product
            </button>
          </form>
        </div>

        {/* Product List */}
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
          <h2 className="text-xl font-semibold mb-2">Products</h2>
          {products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Description</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Stock</th>
                    <th className="px-4 py-2">Image</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className={
                        editProductId === product.id ? "bg-yellow-100" : ""
                      }
                    >
                      {editProductId === product.id ? (
                        <>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={editProductName}
                              onChange={(e) =>
                                setEditProductName(e.target.value)
                              }
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              required
                            />
                          </td>
                          <td className="px-4 py-2">
                            <textarea
                              value={editProductDescription}
                              onChange={(e) =>
                                setEditProductDescription(e.target.value)
                              }
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              required
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              list="editCategoryOptions"
                              value={editProductCategory}
                              onChange={(e) =>
                                setEditProductCategory(e.target.value)
                              }
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            <datalist id="editCategoryOptions">
                              {categories.map((category) => (
                                <option key={category} value={category} />
                              ))}
                            </datalist>
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={editProductPrice}
                              onChange={(e) =>
                                setEditProductPrice(e.target.value)
                              }
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              required
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              min="0"
                              value={editProductStockCount}
                              onChange={(e) =>
                                setEditProductStockCount(e.target.value)
                              }
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={editProductImageUrl}
                              onChange={(e) =>
                                setEditProductImageUrl(e.target.value)
                              }
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <button
                              className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2"
                              onClick={(e) => handleUpdateProduct(e)}
                            >
                              Save
                            </button>
                            <button
                              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded"
                              onClick={() => setEditProductId(null)}
                            >
                              Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-2">{product.name}</td>
                          <td className="px-4 py-2">
                            {product.description.length > 50
                              ? `${product.description.substring(0, 50)}...`
                              : product.description}
                          </td>
                          <td className="px-4 py-2">
                            {product.price !== undefined &&
                            product.price !== null
                              ? `$${product.price.toFixed(2)}`
                              : "-"}
                          </td>
                          <td
                            className={`px-4 py-2 ${getStockStatusClass(
                              product.stockCount
                            )}`}
                          >
                            {getStockStatusText(product.stockCount)}
                          </td>
                          <td className="px-4 py-2">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="h-10 w-10 object-cover"
                              />
                            ) : (
                              <span className="text-gray-400">No image</span>
                            )}
                          </td>
                          <td className="px-4 py-2">
                            <button
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                              onClick={() => handleEditProduct(product)}
                            >
                              Edit
                            </button>
                            <button
                              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Hero;
