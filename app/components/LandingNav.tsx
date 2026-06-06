import { useState } from "react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import LogoutConfirmDialog from "~/components/LogoutConfirmDialog";

interface LandingNavProps {
  currentUser?: Record<string, any> | null;
}

const LandingNav = ({ currentUser }: LandingNavProps) => {

  console.log(currentUser)
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-light-300">
        <div className="wrapper flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src="/assets/icons/logo.svg" alt="Teal Horizon" className="h-8 w-8" />
            <span className="font-clash-display text-xl font-semibold text-dark-100">
              Teal Horizon
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/trips"
              className="hidden sm:block text-dark-400 font-plus-jakarta text-sm hover:text-primary-100 transition-colors"
            >
              Browse Trips
            </Link>

            {currentUser ? (
              <>
                <Link to="/admin/dashboard">
                  <Button className="hidden sm:inline-flex bg-primary-100 hover:bg-primary-500 text-white rounded-lg text-sm px-4 py-2">
                    Dashboard
                  </Button>
                </Link>
                <div className="flex items-center gap-2">
                  <img
                    src={currentUser.imageUrl || ""}
                    alt={currentUser.name || "User"}
                    className="h-8 w-8 rounded-full object-cover border border-light-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <span className="hidden sm:block font-plus-jakarta text-sm text-dark-400 font-medium">
                    {currentUser.name?.split(" ")[0]}
                  </span>
                  <button
                    onClick={() => setLogoutOpen(true)}
                    className="text-dark-400 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <img src="/assets/icons/logout.svg" alt="Logout" className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <Link to="/sign-in">
                <Button className="bg-primary-100 hover:bg-primary-500 text-white rounded-lg text-sm px-4 py-2">
                  Get Started Free
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <LogoutConfirmDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </>
  );
};

export default LandingNav;
