import { useEffect, useState } from "react";
import ReactGlobe from "react-globe.gl";
import randomColor from "randomcolor";

const DEFAULT_COLOR = "#9ca3af";
const VISITED = [
  "NL",
  "TN",
  "BE",
  "GR",
  "FR",
  "DE",
  "LU",
  "GB",
  "ID",
  "HU",
  "ES",
  "IT",
  "SE",
  "DK",
  "CH",
  "CY",
  "CZ",
  "SI",
];

function makeRandomColor() {
  const color = randomColor();
  if (color === DEFAULT_COLOR) return makeRandomColor();
  else return color;
}

type Properties = { properties: unknown };

function hasProperties(x: object | Properties): x is Properties {
  return typeof x === "object" && "properties" in x;
}

type IsoA2 = { ISO_A2: string };

function hasIsoA2(x: unknown | IsoA2): x is IsoA2 {
  return (
    typeof x === "object" &&
    x !== null &&
    "ISO_A2" in x &&
    typeof x.ISO_A2 === "string"
  );
}

type WB_A2 = { WB_A2: string };

function hasWbA2(x: unknown | WB_A2): x is WB_A2 {
  return (
    typeof x === "object" &&
    x !== null &&
    "WB_A2" in x &&
    typeof x.WB_A2 === "string"
  );
}

export default function Globe() {
  const [countries, setCountries] = useState({
    features: [],
  });

  useEffect(() => {
    fetch("data.geojson")
      .then((res) => res.json())
      .then(setCountries);
  }, []);

  return (
    <ReactGlobe
      globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-dark.jpg"
      hexPolygonsData={countries.features}
      hexPolygonResolution={3}
      hexPolygonMargin={0.3}
      hexPolygonUseDots={true}
      hexPolygonColor={(country) => {
        const visited = VISITED.some((visitedCountry) => {
          if (!hasProperties(country)) return DEFAULT_COLOR;
          if (!hasIsoA2(country.properties)) return DEFAULT_COLOR;
          if (hasWbA2(country.properties) && country.properties.WB_A2 === "FR")
            return true; // ISO_A2 = -99 in my dataset for some reason so we check it with WB_A2
          return visitedCountry === country?.properties?.ISO_A2;
        });

        if (visited) return makeRandomColor();

        return DEFAULT_COLOR;
      }}
    />
  );
}
