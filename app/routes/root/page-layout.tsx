// page-layout.tsx
import { Outlet } from "react-router";
import { useUser } from "~/hooks/useCurrentUser";
import SiteHeader from "~/components/layout/SiteHeader";
import SiteFooter from "~/components/layout/SiteFooter";

function PageShell() {
  const { user: currentUser } = useUser();

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
  return <PageShell />;
};

export default PageLayout;
