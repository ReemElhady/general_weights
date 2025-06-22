import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="bg-[#ffffff] flex flex-row justify-center w-full">
      <div className="bg-white overflow-hidden w-full max-w-[1440px] relative min-h-screen">
        <Sidebar />
        <Navbar />
        
        {/* Main content area */}
        <main className="ml-0 mr-[72px] mt-20 pb-20 min-h-[calc(100vh-160px)]">
          <div className="p-8">
            {children}
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Layout;