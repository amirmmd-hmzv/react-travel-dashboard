import { getExistingUser, storeUserData } from "lib/appwrite/auth";
import { account } from "lib/appwrite/client";
import { getServerUserDocument } from "lib/appwrite/server";
import { syncSessionToCookie } from "lib/appwrite/session-cookie";
import {
  Outlet,
  redirect,
  type LoaderFunctionArgs,
  type ClientLoaderFunctionArgs,
} from "react-router";
import { MobileSidebar, NavItems } from "~/components";

export async function loader({ request }: LoaderFunctionArgs) {
  const userDoc = await getServerUserDocument(request);

  if (!userDoc) throw redirect("/sign-in");
  if (userDoc.status !== "admin") throw redirect("/");

  return { user: userDoc };
}

export async function clientLoader({
  serverLoader,
}: ClientLoaderFunctionArgs) {
  try {
    const serverData = await serverLoader<Awaited<ReturnType<typeof loader>>>();
    if (serverData?.user) return serverData;
  } catch (e) {
    if (e instanceof Response) throw e;
  }

  try {
    await syncSessionToCookie();

    const user = await account.get();
    if (!user?.$id) throw redirect("/sign-in");

    const existingUser = await getExistingUser(user.$id);

    if (existingUser?.status === "user") throw redirect("/");

    if (existingUser?.$id) return { user: existingUser };

    const newUser = await storeUserData();
    if (newUser instanceof Response) throw newUser;
    if (newUser?.status !== "admin") throw redirect("/");

    return { user: newUser ?? null };
  } catch (e) {
    if (e instanceof Response) throw e;
    console.error("Error client loader", e);
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
