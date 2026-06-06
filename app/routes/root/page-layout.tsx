import { Outlet } from "react-router";
import { UserProvider, useUser } from "lib/useCurrentUser";
import SiteHeader from "~/components/SiteHeader";
import SiteFooter from "~/components/SiteFooter";

function PageShell() {
  const currentUser = useUser();

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader currentUser={currentUser} />
      <div className="flex-1">
        <Outlet />
      </div>
      <SiteFooter />
    </div>
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
