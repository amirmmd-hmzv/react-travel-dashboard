import { Header } from "~/components";
import { Combobox } from "~/components/ui/combobox";
import { useEffect, useMemo, useState } from "react";
import { comboBoxItems, selectItems } from "~/constants";
import { formatKey } from "lib/utils";
import { WorldMap } from "~/components/sections/WorldMap";
import { Button } from "~/components/ui/button";
import { LuLoader } from "react-icons/lu";
import { HiSparkles } from "react-icons/hi";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { account } from "lib/appwrite/client";
import { syncSessionToCookie } from "lib/appwrite/session-cookie";
import { useUser } from "~/hooks/useCurrentUser";
import type { Country, TripFormData } from "~/types";

interface CountryOption {
  value: string;
  label: string;
  imgIcon: string;
  cca3: string;
}

const CreateTrip = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const navigate = useNavigate();
  const { user } = useUser();

  const [formData, setFormData] = useState<TripFormData>({
    country: "",
    cca3Country: "",
    duration: 0,
    budget: "",
    groupType: "",
    interest: "",
    travelStyle: "",
  });

  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/world-countries@5/countries.json")
      .then((res) => res.json())
      .then((data) => {
        const mapped = data
          .map((country: any) => ({
            name: country.name.common,
            cca3: country.cca3,
            flag: `https://flagcdn.com/${country.cca2.toLowerCase()}.svg`,
            value: country.name.common,
            coordinates: country.latlng,
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user?.status !== "admin") {
      toast.error("Only admins can create trips");
      return;
    }

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

    const appwriteAccount = await account.get();
    if (!appwriteAccount.$id) {
      console.error("User not authenticated");
      setLoading(false);
      return;
    }

  
    try {
      await syncSessionToCookie();

      const response = await fetch("/api/create-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          country: formData.country,
          numberOfDays: formData.duration,
          travelStyle: formData.travelStyle,
          interests: formData.interest,
          budget: formData.budget,
          groupType: formData.groupType,
          userId: appwriteAccount.$id,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        toast.error(result?.error || "Something went wrong");
        setError(result?.error || null);
        return;
      }

      if (result?.id) {
        toast.success("Trip created successfully!");
        navigate(`/admin/trips/${result.id}`);
      }
      setError(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create trip";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: keyof TripFormData, value: string | number) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <main className="dashboard wrapper">
      <Header
        title="Add New Trip"
        description="View and edit trip plan details"
      />

      <section className="mt-2.5 wrapper-md">
        <form className="trip-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="country">Country</label>
            <Combobox
              loading={loadingCountries}
              texts={{ placeholder: "Select a country" }}
              contentClassName="w-full"
              triggerClassName="w-full"
              className="bg-transparent h-auto p-4 hover:bg-transparent! shadow-none border w-full border-gray-100/20"
              items={countryOptions}
              filterMode="startsWith"
              onChange={(value) => {
                const selectedCountry = countries.find(
                  (c) => c.value === value,
                );

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

          {selectItems.map((k, i) => (
            <div key={`cn-${i}`}>
              <label htmlFor="type">{formatKey(k)}</label>
              <Combobox
                loading={loadingCountries}
                texts={{ placeholder: `Select a ${formatKey(k)}` }}
                contentClassName="w-full text-dark-100"
                triggerClassName="w-full"
                className="bg-transparent h-auto p-4 hover:bg-transparent! shadow-none border w-full border-gray-100/20"
                items={comboBoxItems[k].map((item) => ({
                  value: item,
                  label: item,
                }))}
                searchable={false}
                selectedTextClassName="text-gray-100 font-medium"
                filterMode="startsWith"
                onChange={(value) => handleChange(k, value)}
              />
            </div>
          ))}

          <div>
            <WorldMap
              highlightColor="red"
              selectedCountry={formData.cca3Country}
            />
          </div>

          {error && <p className="error">{error}</p>}

          <footer className="w-full px-6">
            <Button
              size="lg"
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
