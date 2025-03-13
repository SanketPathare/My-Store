import Hero from "@/components/AdminComponent/Hero";
import React from "react";
import Navbar from "@/components/AdminComponent/Navbar";
import Footer from "@/components/Footer";

const AdminPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className=" container mx-auto px-4 py-8">
        <Hero />
      </div>
      <Footer/>
    </div>
  );
};

export default AdminPage;