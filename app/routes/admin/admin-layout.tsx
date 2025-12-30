import { Outlet } from "react-router";
import { MobileSidebar, NavItems } from "~/components";

export default function AdminLayout() {
  return (
    <div className="admin-layout ">
      <MobileSidebar />
      <aside className="w-full max-w-70 hidden h-screen sticky top-0 bottom-0  bg-white lg:block rounded-lg">
        <div className="w-full  h-full ">
          <NavItems />
        </div>
      </aside>
      <aside className="children overflow-y-auto">
        <Outlet />
      </aside>
    </div>
  );
}
