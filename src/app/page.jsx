"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [speed, setSpeed] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          // Calculate speed from position data
          const currentSpeed = position.coords.speed;
          setSpeed(currentSpeed);
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
      <h1 className="bg-slate-700 text-[31vw]">
        {speed !== null ? `${speed.toFixed(2)} m/s` : "Calculating..."}
      </h1>
    </main>
  );
}
