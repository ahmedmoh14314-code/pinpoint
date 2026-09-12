import { useState } from "react";

export function useGeolocation(defaultPosition = null) {
  const [loading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(defaultPosition);
  const [error, setError] = useState(null);

  function getPosition() {
    console.log("Requesting location...");

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log("SUCCESS", pos);

        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });

        setIsLoading(false);
      },

      (error) => {
        console.log("GEO ERROR", error);

        setError(error.message);
        setIsLoading(false);
      },

      {},
    );
  }
  return { loading, position, error, getPosition };
}
