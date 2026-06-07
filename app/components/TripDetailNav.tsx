import { Link } from "react-router";

const TripDetailNav = () => {
  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-light-300">
      <div className="wrapper h-14 flex items-center justify-between">
        <Link
          to="/trips"
          className="flex items-center gap-1.5 text-dark-400 font-plus-jakarta text-sm hover:text-primary-100 transition-colors"
        >
          <img src="/assets/icons/arrow-left.svg" alt="" className="h-4 w-4" />
          All Trips
        </Link>
        {/* <Link to="/" className="flex items-center gap-2">
          <img src="/assets/icons/logo.svg" alt="Teal Horizon" className="h-7 w-7" />
          <span className="font-clash-display text-dark-100 font-semibold hidden sm:block">
            Teal Horizon
          </span>
        </Link> */}
        <div className="w-20" />
      </div>
    </nav>
  );
};

export default TripDetailNav;
