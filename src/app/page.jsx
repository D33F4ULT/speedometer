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
            const speedInKmh = position.coords.speed * 3.6;

            // Calculate acceleration using sensor data
            const acceleration = calculateAcceleration(
              position,
              previousPosition
            );

            // Apply filtering or fusion algorithms to combine speed and acceleration
            const combinedSpeed = calculateCombinedSpeed(
              speedInKmh,
              acceleration
            );

            // Update speed state
            setSpeed(combinedSpeed);

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

  // Implement a function to calculate acceleration
  function calculateAcceleration(currentPosition, previousPosition) {
    if (!previousPosition) {
      return 0;
    }

    const timeDiff =
      (currentPosition.timestamp - previousPosition.timestamp) / 1000;
    const velocityDiff =
      currentPosition.coords.speed - previousPosition.coords.speed;
    const acceleration = velocityDiff / timeDiff;

    return acceleration;
  }

  // Implement a function to calculate combined speed using speed and acceleration
  function calculateCombinedSpeed(gpsSpeed, acceleration) {
    // Define weight factors for combining speed and acceleration
    const gpsWeight = 0.9; // Adjust this based on sensor reliability
    const accelerationWeight = 0.1; // Adjust this based on sensor reliability

    // Calculate combined speed using weighted average
    const combinedSpeed =
      gpsSpeed * gpsWeight + acceleration * accelerationWeight;

    // Return the combined speed value
    return combinedSpeed;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-500">
      <h1 className="bg-slate-700 font-bold">
        {speed > 0 ? `${speed.toFixed(0)}` : 0}
      </h1>
    </main>
  );
}
