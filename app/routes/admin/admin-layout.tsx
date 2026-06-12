import { storeUserData } from "lib/appwrite/auth";
import { getClientUser } from "lib/client-user";
import {
  Outlet,
  redirect,
  type LoaderFunctionArgs,
  type ClientLoaderFunctionArgs,
} from "react-router";
import { MobileSidebar, NavItems } from "~/components";



export async function clientLoader() {
  try {
    let user = await getClientUser();

    if (!user) {
      const newUser = await storeUserData();
      if (newUser instanceof Response) throw redirect("/sign-in");
      user = newUser;
    }

    if (!user) throw redirect("/sign-in");
    // if (user.status !== "admin") throw redirect("/");

    return { user };
  } catch (e) {
    if (e instanceof Response) throw e;
    throw redirect("/sign-in");
  }
}


clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-light-200">
      <div className="size-10 rounded-full bg-primary-100/30 animate-pulse" />
    </div>
  );
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
