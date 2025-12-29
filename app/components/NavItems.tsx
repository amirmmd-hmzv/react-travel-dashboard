import { Link } from "react-router";

const NavItems = () => {
  return (
    <section className="nav-items">
      <Link className="link-logo" to="/">
        <img src="/assets/icons/logo.svg" alt="logo" className="size-12" />
        <h1 className="text-primary-100">TealHorizon</h1>
      </Link>
    </section>
  );
};

export default NavItems;
