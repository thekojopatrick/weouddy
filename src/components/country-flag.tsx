"use client";

import { useState, useEffect } from "react";
import ReactCountryFlag from "react-country-flag";

export function CountryFlag() {
  const [countryCode, setCountryCode] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((response) => response.json())
      .then((data) => {
        setCountryCode(data.country_code);
      })
      .catch((error) => {
        console.error("Error fetching country:", error);
        setCountryCode("GH"); // Default to Ghana if there's an error
      });
  }, []);

  if (!countryCode) return null;

  return (
    <ReactCountryFlag
      countryCode={countryCode}
      svg
      style={{
        width: "2em",
        height: "2em",
      }}
      title={countryCode}
    />
  );
}
