import { Header } from "~/components";
import { Combobox } from "~/components/ui/combobox";
import type { Route } from "./+types/create-trip";
import type { l } from "node_modules/react-router/dist/development/index-react-server-client-CipGfVBI.mjs";

export async function loader() {
  const countriesResponse = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,flags,latlng,maps"
  );
  const countriesData = await countriesResponse.json();

  return countriesData.map((country: any) => ({
    name: country.name.common,
    flag: country.flags.svg,
    value: country.name.common,
    coordianates: country.latlng,
    maps: country.maps.openStreetMaps,
  }));
}

const CreateTrip = ({ loaderData }: Route.ComponentProps) => {
  const countries = loaderData as Country[];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <main className="dashboard wrapper ">
      <Header
        title={`Add New Trip`}
        description={"View and edit trip plan details"}
      />

      <section className="mt-2.5  wrapper-md ">
        <form className="trip-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="country">Country</label>
            <Combobox
              texts={{ placeholder: "Select a country" }}
              // id="country"
              contentClassName="w-full"
              triggerClassName="w-full"
              className="bg-transparent hover:bg-transparent! shadow-none  border w-full border-gray-100/20"
              items={[
                { value: "us", label: "United States" },
                { value: "ca", label: "Canada" },
              ]}
            />
          </div>
        </form>
      </section>
    </main>
  );
};

export default CreateTrip;
