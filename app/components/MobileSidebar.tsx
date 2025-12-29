import { useState } from "react";
import { CgMenuRight } from "react-icons/cg";
import { IoClose } from "react-icons/io5"; // برای دکمه بستن
import { Link } from "react-router";
import NavItems from "./NavItems";

const MobileSidebar = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <div className="mobile-sidebar wrapper">
      <header className="border-none">
        <Link to="/">
          <img src="/assets/icons/logo.svg" alt="logo" className="size-8" />
          <span className="text-primary-100 font-bold text-lg">
            Teal Horizon
          </span>
        </Link>

        <button 
          className="cursor-pointer"
          onClick={() => setSidebarVisible(true)}
        >
          <CgMenuRight className="text-primary-100" size={26} />
        </button>
      </header>

      {/* Sidebar Container با انیمیشن */}
      <div 
        className={`
          fixed inset-0 z-50
          transition-all duration-300
          ${sidebarVisible ? 'visible opacity-100' : 'invisible opacity-0'}
        `}
      >
        {/* Backdrop */}
        <div 
          className={`
            bg-black/50 fixed inset-0
            transition-opacity duration-300
            ${sidebarVisible ? 'opacity-100' : 'opacity-0'}
          `}
          onClick={() => setSidebarVisible(false)}
        ></div>

        {/* Sidebar Content */}
        <div 
          className={`
            sidebar-content h-full w-70 rounded-l-lg bg-white  
            fixed left-0 top-0 min-h-screen z-10
            transition-transform duration-500 ease-in-out
            ${sidebarVisible ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="w-full h-full">
       

            {/* Nav Items */}
            <NavItems  />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;