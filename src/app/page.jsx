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

              // Access sensor data (e.g., accelerometer, gyroscope)
              const sensorData = getSensorData(); // Implement this function

              // Apply filtering or fusion algorithms to combine sensor and GPS data
              const combinedSpeed = calculateCombinedSpeed(
                speedInKmh,
                sensorData
              );

              // Update speed state
              setSpeed(combinedSpeed);
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

  // Implement a function to retrieve sensor data
  function getSensorData() {
    // Implement code to access and return sensor data
    return {
      accelerometer: { x: 0, y: 0, z: 0 },
      gyroscope: { alpha: 0, beta: 0, gamma: 0 },
      // Additional sensor data as needed
    };
  }

  // Implement a function to calculate combined speed using sensor data
  function calculateCombinedSpeed(gpsSpeed, sensorData) {
    // Extract accelerometer data
    const { x, y, z } = sensorData.accelerometer;

    // Calculate accelerometer magnitude
    const accelerometerMagnitude = Math.sqrt(x ** 2 + y ** 2 + z ** 2);

    // Define weight factors for combining GPS and accelerometer data
    const gpsWeight = 0.8; // Adjust this based on sensor reliability
    const accelerometerWeight = 0.2; // Adjust this based on sensor reliability

    // Calculate combined speed using weighted average
    const combinedSpeed =
      gpsSpeed * gpsWeight + accelerometerMagnitude * accelerometerWeight;

    // Return the combined speed value
    return combinedSpeed;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-500">
      <p>{speed}</p>
      {/* text-[31vw]  */}
      <h1 className="bg-slate-700 font-bold">
        {speed > 0 ? `${speed.toFixed(0)} km/h` : 0}
      </h1>
    </main>
  );
}
