import { cn } from "lib/utils";
import { IconBase } from "react-icons";
import { Link, NavLink } from "react-router";
import { sidebarItems } from "~/constants";

const NavItems = () => {
  return (
    <section className="nav-items">
      <Link className="link-logo" to="/">
        <img src="/assets/icons/logo.svg" alt="logo" className="size-12" />
        <span className="text-primary-100 font-bold text-2xl ">
          Teal Horizon
        </span>
      </Link>

      <div className="container">
        <nav>
          {sidebarItems.map(({ href, icon, id, label }) => {
            const Icon = icon;
            return (
              <NavLink to={href}>
                {({ isActive }: { isActive: boolean }) => {
                  return (
                    <div
                      key={id}
                      className={cn(" group nav-item", {
                        "bg-primary-100 text-white!": isActive,
                      })}
                    >
                      <Icon size={20} />
                      {/* <img src={icon} alt={label} className="size-6" /> */}
                      <span className="label">{label}</span>
                    </div>
                  );
                }}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </section>
  );
};

export default NavItems;
