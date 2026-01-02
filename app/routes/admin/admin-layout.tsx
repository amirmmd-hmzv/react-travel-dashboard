import { getExistingUser, storeUserData } from "lib/appwrite/auth";
import { account } from "lib/appwrite/client";
import { Outlet, redirect } from "react-router";
import { MobileSidebar, NavItems } from "~/components";

export async function clientLoader() {
  try {
    const user = await account.get();
    console.log(user)

    if (!user?.$id) return redirect("/sign-in");


    const existingUser = await getExistingUser(user?.$id);


    if (existingUser?.status == "user") {
      return redirect("/sign-in");
    }


    return existingUser?.$id ? existingUser : await storeUserData();
   


  } catch (e) {
    console.log("Error client loader", e);
    return redirect("/sign-in");
  }
}
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
