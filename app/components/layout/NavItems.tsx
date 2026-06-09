import { cn } from "lib/utils";
import { LuLogOut } from "react-icons/lu";
import { Link, NavLink, useLoaderData } from "react-router";
import { sidebarItems } from "~/constants";
import { useState } from "react";
import LogoutConfirmDialog from "~/components/LogoutConfirmDialog";

interface NavItemsProps {
  onClosesidebar?: () => void;
}

const NavItems = ({ onClosesidebar }: NavItemsProps) => {
  const { user } = useLoaderData() as { user: Record<string, any> | null };
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsLogoutDialogOpen(true);
  };

  return (
    <section className="nav-items h-full flex flex-col">
      <Link className="link-logo" to="/">
        <img src="/assets/icons/logo.svg" alt="logo" className="size-12" />
        <span className="text-primary-100 font-bold text-2xl">
          Teal Horizon
        </span>
      </Link>

      <div className="container overflow-y-auto flex-1">
        <nav>
          {sidebarItems.map(({ href, icon, id, label }) => {
            const Icon = icon;
            return (
              <NavLink onClick={onClosesidebar} key={id} to={href}>
                {({ isActive }) => (
                  <div
                    className={cn("group nav-item transition duration-300", {
                      "bg-linear-to-r from-primary-100 to-navy-500 text-white!":
                        isActive,
                    })}
                  >
                    <Icon size={20} />
                    <span className="label font-medium">{label}</span>
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* footer بیرون از اسکرول */}
      <footer className="nav-footer   ">
        <img
          referrerPolicy="no-referrer"
          className="object-cover size-10"
          src={user?.imageUrl}
          alt={user?.name}
        />
        <article>
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>
        </article>

        <button
          onClick={handleLogoutClick}
          className="cursor-pointer hover:opacity-80 transition"
        >
          <LuLogOut className="text-red-500" size={24} />
        </button>
      </footer>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmDialog
        open={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
      />
    </section>
  );
};

export default NavItems;
