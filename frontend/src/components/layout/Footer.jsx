import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-0 w-[calc(100%-72px)] bg-white border-t border-gray-100 py-4 z-30">
      <div className="text-center">
        <span className="text-[#575757] [font-family:'Rubik',Helvetica]">
          © {currentYear} جميع الحقوق محفوظة لشركة{" "}
        </span>
        <a
          href="https://www.m-iit.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#5e5adb] [font-family:'Rubik',Helvetica] hover:underline"
        >
          Millennium
        </a>
      </div>
    </footer>
  );
};

export default Footer;
