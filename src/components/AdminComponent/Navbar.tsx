"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Package, User, Menu, X, Home } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/admin" className="font-bold text-xl text-gray-800">
                Admin Dashboard
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                <Link
                  href="/admin"
                  className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  <Home className="mr-2 h-5 w-5" />
                  Home
                </Link>
                <Link
                  href="/admin/products"
                  className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  <Package className="mr-2 h-5 w-5" />
                  Products
                </Link>
                <Link
                  href="/admin/carts"
                  className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Carts
                </Link>
                <Link
                  href="/admin/users"
                  className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  <User className="mr-2 h-5 w-5" />
                  Users
                </Link>
              </div>
            </div>

            {/* User profile section */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-center">
                <button className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white">
                  <span className="sr-only">User profile</span>
                  <User className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/admin"
                className="block px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                <Home className="mr-2 h-5 w-5" />
                Home
              </Link>

              <Link
                href="/admin/products"
                className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                <Package className="mr-2 h-5 w-5" />
                Products
              </Link>
              <Link
                href="/admin/carts"
                className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Carts
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                <User className="mr-2 h-5 w-5" />
                Users
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
