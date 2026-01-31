import { Header } from "~/components";
import { Combobox } from "~/components/ui/combobox";
import type { Route } from "./+types/create-trip";
import { useEffect, useMemo, useState } from "react";
import { comboBoxItems, selectItems } from "~/constants";
import { formatKey } from "lib/utils";
import { WorldMap } from "~/components/WorldMap";
import { Button } from "~/components/ui/button";
import { LuLoader, LuSparkle } from "react-icons/lu";
import { HiSparkles } from "react-icons/hi";
import { account } from "lib/appwrite/client";
import { useNavigate } from "react-router";

export interface CountryOption {
  value: string;
  label: string;
  imgIcon: string;
  cca3: string;
}

// export async function loader() {
//   try {
//     const res = await fetch(
//       "https://restcountries.com/v3.1/all?fields=name,flags,latlng,maps,cca3"
//     );

//     if (!res.ok) {
//       throw new Error("Failed to fetch countries");
//     }

//     const data = await res.json();

//     return data
//       .map((country: any) => ({
//         name: country.name.common,
//         cca3: country.cca3,
//         flag: country.flags.svg,
//         value: country.name.common,
//         coordinates: country.latlng, // 👈 اصلاح شد
//         maps: country.maps.openStreetMaps,
//       }))
//       .sort((a: any, b: any) => a.name.localeCompare(b.name));
//   } catch (err) {
//     console.error("Loader error:", err);
//     console.log(err)
//     return []; // 👈 نذار route بترکه
//   }
// }

const CreateTrip = ({ loaderData }: Route.ComponentProps) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<TripFormData>({
    country: countries[0]?.value || "",
    cca3Country: countries[0]?.cca3 || "",
    duration: 0,
    budget: "",
    groupType: "",
    interest: "",
    travelStyle: "",
  });

  useEffect(() => {
    fetch(
      "https://restcountries.com/v3.1/all?fields=name,flags,latlng,maps,cca3",
    )
      .then((res) => res.json())
      .then((data) => {
        const mapped = data
          .map((country: any) => ({
            name: country.name.common,
            cca3: country.cca3,
            flag: country.flags.svg,
            value: country.name.common,
            coordinates: country.latlng,
            maps: country.maps.openStreetMaps,
          }))
          .sort((a: any, b: any) => a.name.localeCompare(b.name));

        setCountries(mapped);
      })
      .catch((err) => {
        console.error("Client fetch failed:", err);
      })
      .finally(() => setLoadingCountries(false));
  }, []);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const countryOptions = useMemo<CountryOption[]>(
    () =>
      countries.map((country) => ({
        value: country.value,
        label: country.name,
        cca3: country.cca3,
        imgIcon: country.flag,
      })),
    [countries],
  );
  const mapData = [
    {
      country: formData.country,
      color: "#EA382E",
      coordinates:
        countries.find((c: Country) => c.name == formData.country)
          ?.coordinates || [],
    },
  ];
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (
      !formData.country ||
      !formData.duration ||
      !formData.budget ||
      !formData.groupType ||
      !formData.interest ||
      !formData.travelStyle
    ) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (formData.duration <= 0 || formData.duration > 10) {
      setError("Duration must be between 1 and 10 days");
      setLoading(false);
      return;
    }
    const user = await account.get();

    if (!user.$id) {
      setError("You must be logged in to create a trip");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/create-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: formData.country,
          numberOfDays: formData.duration,
          travelStyle: formData.travelStyle,
          interests: formData.interest,
          budget: formData.budget,
          groupType: formData.groupType,
          userId: user.$id,
        }),
      });

      const result: CreateTripResponse = await response.json();

      if (result?.id) navigate(`/trips/${result.id}`);
      else console.error("Failed to generate a trip");
      setError(null);
    } catch (error) {
      console.log("Error creating trip:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: keyof TripFormData, value: string | number) => {
    setFormData({ ...formData, [key]: value });
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
              loading={loadingCountries}
              texts={{ placeholder: "Select a country" }}
              contentClassName="w-full"
              triggerClassName="w-full"
              className="bg-transparent h-auto p-4 hover:bg-transparent! shadow-none  border w-full border-gray-100/20"
              items={countryOptions}
              filterMode="startsWith"
              onChange={(value) => {
                // پیدا کردن کشور انتخاب شده
                const selectedCountry = countries.find(
                  (c) => c.value === value,
                );

                // ذخیره هم country و هم cca3
                setFormData({
                  ...formData,
                  country: value,
                  cca3Country: selectedCountry?.cca3 || "",
                });
              }}
              selectedTextClassName="text-gray-100 font-medium"
            />
          </div>

          <div>
            <label htmlFor="duration">Duration</label>
            <input
              type="number"
              name="duration"
              className="form-input placeholder:text-gray-100 text-dark-100 font-medium"
              placeholder="Enter a number of days"
              id="duration"
              onChange={(e) => handleChange("duration", Number(e.target.value))}
            />
          </div>

          {selectItems.map((k, i) => {
            return (
              <div key={`cn-${i}`}>
                <label htmlFor="type">{formatKey(k)}</label>
                <Combobox
                  loading={loadingCountries}
                  texts={{ placeholder: `Select a ${formatKey(k)}` }}
                  // id="country"
                  contentClassName="w-full text-dark-100"
                  triggerClassName="w-full"
                  className="bg-transparent h-auto p-4 hover:bg-transparent! shadow-none  border w-full border-gray-100/20 "
                  items={comboBoxItems[k].map((item) => ({
                    value: item,
                    label: item,
                  }))}
                  searchable={false}
                  selectedTextClassName="text-gray-100 font-medium  "
                  filterMode="startsWith"
                  onChange={(value) => handleChange(k, value)}
                />
              </div>
            );
          })}

          <div>
            <WorldMap
              highlightColor="red"
              selectedCountry={formData.cca3Country}
            />
          </div>

          {error && <p className="error">{error}</p>}

          <footer className="w-full px-6">
            <Button
              size={"lg"}
              disabled={loading}
              type="submit"
              className="w-full flex items-center flex-row-reverse gap-2 text-base"
            >
              {loading ? "Creating..." : "Create Trip"}
              {loading ? (
                <LuLoader className="size-6 animate-spin" />
              ) : (
                <HiSparkles className="size-6" />
              )}
            </Button>
          </footer>
        </form>
      </section>
    </main>
  );
};

export default CreateTrip;
