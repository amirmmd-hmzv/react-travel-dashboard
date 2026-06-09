import { useState } from "react";
import { Link } from "react-router";
import NavItems from "./NavItems";
import { cn } from "lib/utils";
import { HiOutlineMenuAlt2 } from "react-icons/hi";

const MobileSidebar = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <div className="mobile-sidebar wrapper bg-white">
      <header className="border-none">
        <Link className="py-6" to="/">
          <img src="/assets/icons/logo.svg" alt="logo" className="size-10" />
        </Link>

        <button
          className="cursor-pointer"
          onClick={() => setSidebarVisible(true)}
        >
          <HiOutlineMenuAlt2 className="text-primary-100" size={26} />
        </button>
      </header>

      <div
        className={cn(
          " transition-all duration-500  fixed inset-0 z-50",
          sidebarVisible ? "visible opacity-100" : "invisible opacity-0"
        )}
      >
        <div
          className={cn(
            "bg-black/50 fixed inset-0 transition-opacity duration-500",
            sidebarVisible ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setSidebarVisible(false)}
        ></div>

        <div
          className={cn(
            ` sidebar-content h-full w-70 rounded-l-lg rounded-lg bg-white fixed left-0 top-0 min-h-screen z-10 transition-transform duration-700 ease-in-out  `,
            sidebarVisible ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="w-full h-full">
            <NavItems onClosesidebar={() => {setSidebarVisible(false)}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
