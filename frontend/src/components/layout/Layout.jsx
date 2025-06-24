import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-white overflow-hidden text-gray-900">
      {/* Sidebar - fixed width */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 mr-[72px]">
        <Navbar />
        <main className="flex-1 overflow-auto mt-20 px-6 pb-24 py-2 bg-white">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
