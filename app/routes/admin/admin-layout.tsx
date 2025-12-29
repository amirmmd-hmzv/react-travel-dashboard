import { Sidebar } from "primereact/sidebar";
import { Outlet } from "react-router";
import { NavItems } from "~/components";

export default function AdminLayout() {
  return (
    <div className="admin-container">
      MobileSidebar
      <aside className="w-full max-w-70 hidden lg:block">
        {/* <NavItems /> */}
        <Sidebar
          onHide={() => {}}
          visible={true}
          modal={false} // ❌ حالت modal غیرفعال
          dismissable={false} // ❌ با کلیک بیرون بسته نشود
          showCloseIcon={false} // ❌ دکمه بستن مخفی
          blockScroll={false} // ✅ اسکرول صفحه فعال بماند
        >
          <NavItems/>
        </Sidebar>
      </aside>
      <aside className="children">
        <Outlet />
      </aside>
      <main></main>
    </div>
  );
}
