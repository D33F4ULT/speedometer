"use client";

import { useEffect, useState } from "react";
import { useOrientationStates } from "./components/OrientationComponent";

export default function Home() {
  if (typeof navigator.serviceWorker !== "undefined") {
    navigator.serviceWorker.register("sw.js");
  }

  const [speed, setSpeed] = useState(0);
  const { isLandscape, isReverseLandscape } = useOrientationStates();

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
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black">
      {/* PORTRAIT MODE */}
      {!isLandscape && !isReverseLandscape && (
        <h1 className="absolute flex flex-col gap-1 justify-center text-center text-[10vw] font-bold">
          {speed > 0 ? `${speed.toFixed(0)}` : 0}
          <p className="text-sm">km/h</p>
        </h1>
      )}

      {/* LANDSCAPE MODE */}
      {isLandscape && (
        <h1 className="absolute flex flex-col gap-1 justify-center text-center text-[50vw] font-bold">
          {speed > 0 ? `${speed.toFixed(0)}` : 0}
        </h1>
      )}

      {/*REVERSE LANDSCAPE MODE */}
      {isReverseLandscape && (
        <h1 className="absolute flex flex-col gap-1 scale-x-[-1] justify-center text-center text-[50vw] font-bold">
          {speed > 0 ? `${speed.toFixed(0)}` : 0}
        </h1>
      )}
    </main>
  );
}
