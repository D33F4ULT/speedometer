"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    if (navigator.geolocation) {
      let previousPosition = null;
      let previousSpeed = 0;

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          if (position.coords.speed !== null) {
            const speedInKmh = position.coords.speed * 3.6;

            // Calculate acceleration using previous speed and current speed
            const acceleration = (speedInKmh - previousSpeed) / 1; // Time interval = 1 second

            // Apply filtering or fusion algorithms to combine speed and acceleration
            const combinedSpeed = calculateCombinedSpeed(
              speedInKmh,
              acceleration
            );

            // Update speed state
            setSpeed(combinedSpeed);

            // Update previous position and speed
            previousPosition = position;
            previousSpeed = speedInKmh;
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

  // Implement a function to calculate combined speed using speed and acceleration
  function calculateCombinedSpeed(gpsSpeed, acceleration) {
    // Define weight factors for combining speed and acceleration
    const gpsWeight = 0.7; // Adjust this based on sensor reliability
    const accelerationWeight = 0.3; // Adjust this based on desired response

    // Calculate combined speed using weighted average
    const combinedSpeed =
      gpsSpeed * gpsWeight + acceleration * accelerationWeight;

    // Return the combined speed value
    return combinedSpeed;
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-slate-500">
      <h1 className="absolute bg-slate-700 text-[50vw] font-bold">
        {speed > 0 ? `${speed.toFixed(0)}` : 0}
      </h1>
    </main>
  );
}
