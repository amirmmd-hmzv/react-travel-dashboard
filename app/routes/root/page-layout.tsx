import { Outlet } from "react-router";
import { UserProvider, useUser } from "lib/useCurrentUser";
import SiteHeader from "~/components/SiteHeader";
import SiteFooter from "~/components/SiteFooter";

function PageShell() {
  const currentUser = useUser();

  return (
    <>
      <SiteHeader currentUser={currentUser} />
      <div className="flex-1">
        <Outlet />
      </div>
      <SiteFooter />
    </>
  );
}

const PageLayout = () => {
  return (
    <UserProvider>
      <PageShell />
    </UserProvider>
  );
};

export default PageLayout;
