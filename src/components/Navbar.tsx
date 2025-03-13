"use client";

import { useState } from "react";
import Link from "next/link";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import {
  Menu,
  ShoppingCart,
  ShoppingBag,
  User,
  LogOut,
  LogIn,
  UserPlus,
  X,
  House,
} from "lucide-react";

const Navbar = () => {
  const [user, loading, error] = useAuthState(auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/auth/login");
      // Close mobile menu if open
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return ( 
    <nav className="bg-white shadow-md py-4 relative z-10">
      <div className="container mx-auto px-4 md:px-6">
        {/* Desktop and Mobile top bar */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl md:text-2xl font-bold text-blue-600 flex items-center"
          >
            {/* <ShoppingBag className="mr-2" size={24} /> */}
            <span>My Store</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
            >
              <House className="mr-1" size={18} />
              <span>Home</span>
            </Link>

            <Link
              href="/products"
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Menu className="mr-1" size={18} />
              <span>Products</span>
            </Link>
            <Link
              href="/cart"
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
            >
              <ShoppingCart className="mr-1" size={18} />
              <span>Cart</span>
            </Link>

            {user ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <User className="mr-1" size={18} />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                  <LogOut className="mr-1" size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <LogIn className="mr-1" size={18} />
                  <span>Login</span>
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  <UserPlus className="mr-1" size={18} />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`
          md:hidden fixed inset-0 bg-white z-50 pt-20 px-6 transition-transform duration-300 ease-in-out
          ${
            isMenuOpen
              ? "transform translate-x-0"
              : "transform translate-x-full"
          }
        `}
        >
          {/* Close Button in Mobile Menu */}
          <button
            className="absolute top-4 right-4 text-gray-700 focus:outline-none"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>

          <div className="flex flex-col space-y-6">
            <Link
              href="/"
              className="flex items-center text-gray-700 hover:text-blue-600"
              onClick={closeMenu}
            >
              <House className="mr-1" size={18} />
              <span>Home</span>
            </Link>
            <Link
              href="/products"
              className="flex items-center text-gray-700 hover:text-blue-600 py-2 border-b border-gray-100"
              onClick={closeMenu}
            >
              <Menu className="mr-3" size={20} />
              <span>Products</span>
            </Link>

            <Link
              href="/cart"
              className="flex items-center text-gray-700 hover:text-blue-600 py-2 border-b border-gray-100"
              onClick={closeMenu}
            >
              <ShoppingCart className="mr-3" size={20} />
              <span>Cart</span>
            </Link>

            {user ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center text-gray-700 hover:text-blue-600 py-2 border-b border-gray-100"
                  onClick={closeMenu}
                >
                  <User className="mr-3" size={20} />
                  <span>Profile</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center text-red-500 hover:text-red-700 py-2"
                >
                  <LogOut className="mr-3" size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="flex items-center text-gray-700 hover:text-blue-600 py-2 border-b border-gray-100"
                  onClick={closeMenu}
                >
                  <LogIn className="mr-3" size={20} />
                  <span>Login</span>
                </Link>

                <Link
                  href="/auth/register"
                  className="flex items-center text-blue-600 hover:text-blue-800 py-2"
                  onClick={closeMenu}
                >
                  <UserPlus className="mr-3" size={20} />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
