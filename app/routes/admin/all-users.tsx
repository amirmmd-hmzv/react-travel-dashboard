import { Header } from "~/components";

const AllUsers = () => {
  const user = {
    name: " Amir",
  };

  return (
    <main className="dashboard wrapper">
      <Header
        title={`Users`}
        description={"Track, manage, and support your users"}
      />
    </main>
  );
};

export default AllUsers;
