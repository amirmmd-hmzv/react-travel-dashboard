import { Outlet } from "react-router";
import { UserProvider, useUser } from "lib/useCurrentUser";
import SiteHeader from "~/components/SiteHeader";
import SiteFooter from "~/components/SiteFooter";

function PageShell() {
  const currentUser = useUser();

  return (
    <div className="min-h-screen bg-light-200">
      <SiteHeader currentUser={currentUser} />
      <Outlet />
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
