"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          if (position.coords.speed !== null) {
            // Convert speed from meters per second to kilometers per hour
            const speedInKmh = position.coords.speed * 3.6;
            setSpeed(speedInKmh);
          }
        },
        (error) => {
          console.error("Error getting position:", error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-500">
      {/* <p>{speed}</p> */}
      {/* text-[31vw] */}
      <h1 className="bg-slate-700">
        {isNaN(speed) ? "Calculating..." : `${speed.toFixed(2)} km/h`}
      </h1>
    </main>
  );
}
