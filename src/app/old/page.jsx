"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    if (navigator.geolocation) {
      let previousPosition = null;

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          if (position.coords.speed !== null) {
            // Convert speed from meters per second to kilometers per hour
            const speedInKmh = position.coords.speed * 3.6;

            if (previousPosition) {
              // Calculate time difference between previous and current positions
              const timeDiff =
                (position.timestamp - previousPosition.timestamp) / 1000;

              // Filter out low-speed or erratic data
              if (speedInKmh > 1 && timeDiff > 0) {
                // Apply dead reckoning or Kalman filtering here if desired

                // Update speed state
                setSpeed(speedInKmh);
              }
            }

            // Update previous position
            previousPosition = position;
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
      <h1 className="bg-slate-700 text-[31vw] font-bold">
        {isNaN(speed) ? "?" : `${speed.toFixed(0)}`}
      </h1>
    </main>
  );
}
