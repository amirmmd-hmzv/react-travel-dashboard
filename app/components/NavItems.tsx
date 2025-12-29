import { cn } from "lib/utils";
import { IconBase } from "react-icons";
import { LuLogOut } from "react-icons/lu";
import { Link, NavLink } from "react-router";
import { sidebarItems } from "~/constants";

const NavItems = () => {
  const user = {
    name: "Amir mohammad",
    email: "amirhamzavi44@gmail.com",
    avatar: "/assets/images/Amir profile 1.jpeg",
  };

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
                      className={cn(" group nav-item transition duration-300", {
                        "bg-primary-100 text-white!": isActive,
                      })}
                    >
                      <Icon size={20} />
                      <span className="label font-medium">{label}</span>
                    </div>
                  );
                }}
              </NavLink>
            );
          })}
        </nav>
        <footer className="nav-footer">
          <img
            className="object-cover size-10"
            src={user?.avatar}
            alt={user?.name}
          />
          <article>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </article>

          <button onClick={() => {}} className="cursor-pointer">
            <LuLogOut className="text-red-500" size={24} />
          </button>
        </footer>
      </div>
    </section>
  );
};

export default NavItems;
