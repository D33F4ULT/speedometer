"use client";

import { useEffect, useState } from "react";
import { useOrientationStates } from "../components/OrientationComponent";
import CustomConsole from "../components/customConsole";

export default function Home() {
  const [speed, setSpeed] = useState(0);
  const { isLandscape, isReverseLandscape } = useOrientationStates();

  // Request permission to access Bluetooth devices
  async function requestBluetoothDevice() {
    try {
      console.log("Requesting Bluetooth device...");
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
      });

      console.log("Selected device:", device);

      // Now that you have a device, you can establish a connection
      connectToDevice(device);
    } catch (error) {
      console.log("[ERROR]:", error);
    }
  }

  // Establish a GATT connection to the device
  async function connectToDevice(device) {
    try {
      console.log("Connecting to device...");
      const server = await device.gatt.connect();

      console.log("Connected to GATT server:", server);

      // Now you can interact with the GATT server and its services
    } catch (error) {
      console.log("[ERROR]:", error);
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col p-2 items-center justify-center overflow-hidden bg-black">
      {/* PORTRAIT MODE */}
      {!isLandscape && !isReverseLandscape && (
        <>
          <ul className=" border-2 mb-5 p-4 rounded-md">
            <li>
              Selected device: <span>none</span>
            </li>

            <li>
              Connected: <span>false</span>
            </li>
          </ul>

          <button
            onClick={requestBluetoothDevice}
            className=" bg-slate-200 text-black active:scale-95 px-2"
          >
            Request Bluetooth Device
          </button>
          {/* <p>Server: {serverData || "no data"}</p> */}
          <div className=" flex flex-col max-w-[500px] w-full">
            log:
            <CustomConsole />
          </div>
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
