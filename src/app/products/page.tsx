"use client";
import { useState, useEffect, useMemo } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import Loading from "../../components/Loading";
import { db } from "../../../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { FiSearch } from "react-icons/fi";

const Products = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [showFilters, setShowFilters] = useState(false);

  // Load products from Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productsRef = collection(db, "products");
        const q = query(productsRef, orderBy("name")); // Add default ordering
        const querySnapshot = await getDocs(q);
        const productsData = [];
        querySnapshot.forEach((doc) => {
          productsData.push({ id: doc.id, ...doc.data() });
        });
        setProducts(productsData);

        // Extract unique categories and sort them alphabetically
        const allCategories = ["All"];
        const uniqueCategories = new Set();

        productsData.forEach((product) => {
          if (product.category && product.category.trim() !== "") {
            uniqueCategories.add(product.category);
          }
        });

        // Convert to array, sort, and combine with "All"
        setCategories([
          ...allCategories,
          ...Array.from(uniqueCategories).sort(),
        ]);
      } catch (error) {
        console.error("Error fetching products:", error);
        // Handle error appropriately, e.g., show an error message to the user
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Memoized filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (product) =>
          product.name?.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query)
      );
    }

    // Filter by price range
    result = result.filter(
      (product) =>
        product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Sort products
    switch (sortOption) {
      case "price-low-high":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        // Assuming you have a 'createdAt' timestamp field in your product data
        result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        break;
      default:
        // Default sorting (by name)
        result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortOption, priceRange]);

  // Event handlers
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handlePriceRangeChange = (type, value) => {
    setPriceRange((prev) => ({
      ...prev,
      [type]: Number(value) || 0, 
    }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setPriceRange({ min: 0, max: 1000 });
    setSortOption("default");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col">
        <main className="container mx-auto py-6 px-4 flex-grow">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">Our Products</h1>
          </div>

          {/* Mobile filter toggle */}
          <button
            className="md:hidden w-full bg-gray-100 py-2 mb-4 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-200"
            onClick={toggleFilters}
            aria-expanded={showFilters}
            aria-controls="product-filters"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>

          <div className="md:flex">
            {/* Left sidebar for filters */}
            <div
              id="product-filters"
              className={`md:w-1/4 lg:w-1/5 pr-0 md:pr-6 ${
                showFilters ? "block" : "hidden md:block"
              }`}
            >
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                {/* Search bar */}
                <div className="mb-4">
                  <label
                    htmlFor="search"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Search Products
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="search"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />

                    <FiSearch className="absolute left-2 top-2 h-7 w-4 text-gray-400" />
                  </div>
                </div>
                {/* Category filter */}
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Categories</h3>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`block w-full text-left px-2 py-1 rounded transition-colors ${
                          selectedCategory === category
                            ? "bg-primary text-blue-500"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price range filter */}
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">
                    Price Range
                  </h3>
                  <div className="flex space-x-2">
                    <div>
                      <label
                        htmlFor="min-price"
                        className="block text-xs text-gray-500"
                      >
                        Min ($)
                      </label>
                      <input
                        type="number"
                        id="min-price"
                        min="0"
                        value={priceRange.min}
                        onChange={(e) =>
                          handlePriceRangeChange("min", e.target.value)
                        }
                        className="w-full p-1 text-sm border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="max-price"
                        className="block text-xs text-gray-500"
                      >
                        Max ($)
                      </label>
                      <input
                        type="number"
                        id="max-price"
                        min="0"
                        value={priceRange.max}
                        onChange={(e) =>
                          handlePriceRangeChange("max", e.target.value)
                        }
                        className="w-full p-1 text-sm border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* Sort options */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Sort By</h3>
                  <select
                    value={sortOption}
                    onChange={handleSortChange}
                    className="w-full p-2 border border-gray-300 rounded bg-white"
                    aria-label="Sort products by"
                  >
                    <option value="default">Default</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Main products grid */}
            <div className="md:w-3/4 lg:w-4/5">
              {/* Results summary */}
              <div className="mb-4 text-sm text-gray-600">
                Showing {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"}
                {selectedCategory !== "All" && ` in ${selectedCategory}`}
              </div>

              {filteredProducts.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No products found
                  </h3>
                  <p className="mt-1 text-gray-500">
                    Try adjusting your search or filter criteria.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="mt-4 text-primary hover:text-primary-dark"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Products;
