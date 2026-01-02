import { getAllUsers } from "lib/appwrite/auth";
import { cn, formatDate } from "lib/utils";
import { Header } from "~/components";
import { CustomTable } from "~/components/CustomTable";
import { users } from "~/constants";
import type { Route } from "./+types/dashboard";

export async function loader() {
  const { total, users } = await getAllUsers(10, 0);
  return { total, users };
}

const AllUsers = ({ loaderData }: Route.ComponentProps) => {
  console.log(loaderData);

  const user = {
    name: " Amir",
  };

  return (
    <main className="dashboard wrapper ">
      <Header
        title={`Manage Users`}
        description={"Track, manage, and support your users"}
      />

      <CustomTable
        hoverable
        bordered
        compact
        headerClassName=" font-clash-display font-bold! border-0!  p-10 "
        rowIdKey="id"
        data={loaderData?.users}
        // data={users}
        striped
        columns={[
          {
            // minWidth: "250px",
            key: "name",
            header: "Name",
            cellClassName: "font-medium  ",
            render: (value: string, row: any) => (
              <div className="flex items-center mr-8  md:mr-4  ">
                <img
                  referrerPolicy="no-referrer"
                  src={row.imageUrl}
                  alt="Profile"
                  className="aspect-square size-8 md:size-10 rounded-full mr-2 "
                />
                <span>{value}</span>
              </div>
            ),
          },
          { key: "email", header: "Email" },
          {
            key: "joinedAt",
            header: "Date Joined",
            // width: "20%",
            render: (value: string) => {
              return formatDate(value);
            },
          },
          {
            key: "itineraryCreated",
            header: " Created Trips",
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
    </main>
  );
};

export default AllUsers;
