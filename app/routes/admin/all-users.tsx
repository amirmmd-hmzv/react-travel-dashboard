import { type LoaderFunctionArgs } from "react-router";
import { getAllUsersWithTripCount } from "lib/appwrite/auth";
import { cn, formatDate } from "lib/utils";
import { Header } from "~/components";
import { CustomTable } from "~/components/CustomTable";
import AppPagination from "~/components/AppPagination";
import { useNavigation } from "react-router";
import type { Route } from "./+types/all-users";

const LIMIT = 10;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const offset = (page - 1) * LIMIT;

  const { total, users } = await getAllUsersWithTripCount(LIMIT, offset);

  return { total, users, currentPage: page };
};

const AllUsers = ({ loaderData }: Route.ComponentProps) => {
  const users = loaderData?.users ?? [];
  const total: number = loaderData?.total ?? 0;
  const currentPage: number = loaderData?.currentPage ?? 1;
  const totalPages = Math.ceil(total / LIMIT);
  const isLoading = useNavigation().state === "loading";

  return (
    <main className="dashboard wrapper">
      <Header
        title="Manage Users"
        description="Track, manage, and support your users"
      />

      <CustomTable
        hoverable
        bordered
        compact
        loading={isLoading}
        headerClassName="font-clash-display font-bold! border-0! p-10"
        rowIdKey="$id"
        data={users}
        striped
        columns={[
          {
            key: "name",
            header: "Name",
            cellClassName: "font-medium",
            render: (value: string, row: any) => (
              <div className="flex items-center mr-8 md:mr-4">
                <img
                  referrerPolicy="no-referrer"
                  src={row.imageUrl}
                  alt="Profile"
                  className="aspect-square size-8 md:size-10 rounded-full mr-2"
                />
                <span>{value}</span>
              </div>
            ),
          },
          { key: "email", header: "Email" },
          {
            key: "joinedAt",
            header: "Date Joined",
            render: (value: string) => formatDate(value),
          },
          {
            key: "tripCount",
            header: "Created Trips",
            align: "center",
          },
          {
            key: "status",
            header: "Role",
            render: (value: string, row: any) => (
              <div className="flex items-center justify-center">
                <span
                  className={cn("px-2 p-1 rounded-xl border", {
                    "bg-pink-50 text-pink-500 border-pink-500":
                      value === "admin",
                    "bg-primary-50 text-primary-500 border-primary-500":
                      value !== "admin",
                  })}
                >
                  {value}
                </span>
              </div>
            ),
          },
        ]}
      />

      <AppPagination
        currentPage={currentPage}
        totalPages={totalPages}
        className="my-4"
      />
    </main>
  );
};

export default AllUsers;
