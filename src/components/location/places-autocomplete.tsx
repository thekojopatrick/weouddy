// components/PlacesAutocomplete.tsx
"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { searchPlaces } from "@/lib/google";

type Prediction = {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
};

export default function PlacesAutocomplete() {
  const [input, setInput] = useState("");
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Use your custom debounce hook
  const debouncedInput = useDebounce(input, 300);

  useEffect(() => {
    async function fetchPredictions() {
      if (!debouncedInput || debouncedInput.length < 2) {
        setPredictions([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchPlaces(debouncedInput);
        setPredictions(results);
      } catch (error) {
        console.error("Failed to fetch predictions:", error);
        setPredictions([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPredictions();
  }, [debouncedInput]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Enter an address"
          aria-label="Search for an address"
        />
        {isLoading && (
          <div className="absolute right-2 top-2 text-sm text-gray-400">
            Loading...
          </div>
        )}
      </div>

      {predictions.length > 0 && (
        <ul className="mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {predictions.map((prediction) => (
            <li
              key={prediction.place_id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setInput(prediction.description);
                setPredictions([]);
                // Handle selection here
                console.log("Selected:", prediction);
              }}
            >
              <div className="font-medium">
                {prediction.structured_formatting.main_text}
              </div>
              <div className="text-sm text-gray-600">
                {prediction.structured_formatting.secondary_text}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
