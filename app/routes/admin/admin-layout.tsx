import { useState } from "react";
import { Outlet } from "react-router";
import { MobileSidebar, NavItems } from "~/components";

export default function AdminLayout() {
  const [visible, setVisible] = useState(false);
  return (
    <div className="admin-container">
      <MobileSidebar />
      <aside className="w-full max-w-70 hidden h-screen sticky top-0 bg-white lg:block">
        <div className="w-full  h-full ">
          <NavItems />
        </div>
      </aside>
      <aside className="children ">
        <Outlet />
      </aside>
      <main>
   
      </main>
    </div>
  );
}
