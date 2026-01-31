import { useEffect, useState } from "react";

interface WorldMapProps {
  selectedCountry?: string;
  highlightColor?: string;
}

interface CountryFeature {
  type: string;
  properties: {
    name: string;
  };
  id: string;
  geometry: any;
}

export const WorldMap = ({
  selectedCountry = "",
  highlightColor = "#EA382E",
}: WorldMapProps) => {
  const [countries, setCountries] = useState<CountryFeature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json"
    )
      .then((res) => res.json())
      .then((data) => {
        setCountries(data.features);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading map:", err);
        setLoading(false);
      });
  }, []);

  // Simple Mercator projection
  const projectPoint = (lon: number, lat: number) => {
    const width = 1000;
    const height = 500;

    // Mercator projection formulas
    const x = (lon + 180) * (width / 360);
    const latRad = (lat * Math.PI) / 180;
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = height / 2 - (width * mercN) / (2 * Math.PI);

    return [x, y];
  };

  const getCountryPath = (geometry: any): string => {
    if (!geometry || !geometry.coordinates) return "";

    const coordsToPath = (coords: number[][]) => {
      return coords
        .map((point, i) => {
          const [x, y] = projectPoint(point[0], point[1]);
          return `${i === 0 ? "M" : "L"} ${x} ${y}`;
        })
        .join(" ");
    };

    if (geometry.type === "Polygon") {
      return geometry.coordinates.map(coordsToPath).join(" Z ");
    } else if (geometry.type === "MultiPolygon") {
      return geometry.coordinates
        .map((polygon: number[][][]) => polygon.map(coordsToPath).join(" Z "))
        .join(" ");
    }
    return "";
  };

  if (loading) {
    return (
      <div className="w-full h-auto bg-gray-50 rounded-lg border border-gray-100/20 flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 rounded-lg border border-gray-100/20 overflow-hidden">
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-auto"
        style={{ minHeight: "400px", maxHeight: "600px" }}
        preserveAspectRatio="xMidYMid meet"
      >
        <rect width="1000" height="500" fill="#f9fafb" />
        <g>
          {countries.map((country, index) => {
            const isSelected = country.id === selectedCountry;
            const path = getCountryPath(country.geometry);

            if (!path) return null;

            return (
              <path
                key={`${country.properties.name}-${index}`}
                d={path}
                fill={isSelected ? highlightColor : "#E5E7EB"}
                stroke="#FFFFFF"
                strokeWidth="0.5"
                className="transition-colors duration-200 cursor-pointer"
                style={{
                  fill: isSelected ? highlightColor : "#E5E7EB",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.fill = "#D1D5DB";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.fill = "#E5E7EB";
                  }
                }}
              >
                <title>{country.properties.name}</title>
              </path>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
