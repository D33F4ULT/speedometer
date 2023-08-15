"use client";

import { useEffect, useState } from "react";
import { useOrientationStates } from "../components/OrientationComponent";

export default function Home() {
  const [speed, setSpeed] = useState(0);
  const [serverData, setServerData] = useState(null);
  const { isLandscape, isReverseLandscape } = useOrientationStates();

  // Request permission to access Bluetooth devices
  async function requestBluetoothDevice() {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
      });

      // Now that you have a device, you can establish a connection
      connectToDevice(device);
    } catch (error) {
      console.error("Bluetooth error:", error);
    }
  }

  async function connectToDevice(device) {
    try {
      const server = await device.gatt.connect();
      // Now you can interact with the GATT server and its services
      setServerData(server);
    } catch (error) {
      console.error("Connection error:", error);
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black">
      {/* PORTRAIT MODE */}
      {!isLandscape && !isReverseLandscape && (
        <>
          <button
            onClick={requestBluetoothDevice}
            className=" bg-slate-200 text-black active:scale-95"
          >
            Request Bluetooth Device
          </button>
          <p>Server: {serverData || "no data"}</p>
        </>
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
