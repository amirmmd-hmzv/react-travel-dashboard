import { Link } from "react-router";

const SiteFooter = () => {
  return (
    <footer className="bg-dark-100 text-white py-12 mt-auto">
      <div className="wrapper flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <img src="/assets/icons/logo.svg" alt="Teal Horizon" className="h-7 w-7" />
          <span className="font-clash-display text-lg font-semibold">Teal Horizon</span>
        </div>

        <p className="font-plus-jakarta text-white/40 text-sm text-center">
          &copy; {new Date().getFullYear()} Teal Horizon. All rights reserved.
        </p>

        <div className="flex items-center gap-6 text-sm font-plus-jakarta text-white/60">
          <Link to="#" className="hover:text-white transition-colors">Terms</Link>
          <Link to="#" className="hover:text-white transition-colors">Privacy</Link>
          <Link to="#" className="hover:text-white transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
