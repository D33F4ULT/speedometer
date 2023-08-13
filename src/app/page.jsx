"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [speed, setSpeed] = useState(0);
  const [previousPosition, setPreviousPosition] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          if (previousPosition) {
            const timeDiff =
              (position.timestamp - previousPosition.timestamp) / 1000;
            const distance = calculateDistance(
              previousPosition.coords.latitude,
              previousPosition.coords.longitude,
              position.coords.latitude,
              position.coords.longitude
            );
            const calculatedSpeed = distance / timeDiff;

            // Convert calculated speed to km/h
            const speedInKmh = calculatedSpeed * 3.6;

            setSpeed(speedInKmh);
          }

          setPreviousPosition(position);
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
  }, [previousPosition]);

  // Calculate distance between two coordinates using Haversine formula
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }

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
