"use client";

import { useEffect, useState } from "react";
import { useOrientationStates } from "../components/OrientationComponent";
import CustomConsole from "../components/customConsole";

export default function Home() {
  const [selectedDeviceName, setSelectedDeviceName] = useState("");
  const [connectedToDevice, setConectedToDevice] = useState(false);
  const [writeCharacteristic, setWriteCharacteristic] = useState(null);
  const [notifyCharacteristic, setNotifyCharacteristic] = useState(null);
  const [isListeningForNotifications, setIsListeningForNotifications] =
    useState(false);
  const [speed, setSpeed] = useState(0);
  const { isLandscape, isReverseLandscape } = useOrientationStates();

  const combinedUUID = "0000fff0-0000-1000-8000-00805f9b34fb";
  const characteristicUUID1 = "0000fff1-0000-1000-8000-00805f9b34fb";
  const characteristicUUID2 = "0000fff2-0000-1000-8000-00805f9b34fb";

  // Request permission to access Bluetooth devices
  async function requestBluetoothDevice() {
    try {
      console.log("Requesting Bluetooth device...");
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [combinedUUID], // Add the UUID of the desired service
      });

      console.log("Selected device:", device.name);
      setSelectedDeviceName(device.name);

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
      console.log("Retrieving primary service...");
      const service = await server.getPrimaryService(combinedUUID);

      console.log("Retrieving characteristic UUID1...");
      const characteristic1 = await service.getCharacteristic(
        characteristicUUID1
      );
      setNotifyCharacteristic(characteristic1);
      console.log("Notify Characteristic: ", notifyCharacteristic);

      console.log("Retrieving characteristic UUID2...");
      const characteristic2 = await service.getCharacteristic(
        characteristicUUID2
      );
      setWriteCharacteristic(characteristic2);
      console.log("Write Characteristic: ", writeCharacteristic);

      console.log("Connected to GATT server: ", server);
      setConectedToDevice(true);

      // Start listening for notifications on notify characterictic
      console.log("Start Notifications...");
      await notifyCharacteristic.startNotifications();
      notifyCharacteristic.addEventListener(
        "characteristicvaluechanged",
        handleCharacteristicValueChanged
      );
      console.log("Notifications Started on: ", notifyCharacteristic);
      setIsListeningForNotifications(true);

      // Now you can interact with the GATT server and its services
    } catch (error) {
      console.log("[ERROR]:", error);
      setConectedToDevice(false);
      setIsListeningForNotifications(false);
    }
  }

  // Process received notifications
  function handleCharacteristicValueChanged(event) {
    console.log("[RECEIVED DATA]");
    const value = event.target.value;
    console.log("Received (Hex): ", value);

    const dataView = new Uint8Array(value.buffer);
    console.log("Converted to Uint8Array: ", dataView);

    const decoded = new TextDecoder().decode(dataView);
    console.log("Uint8Array decoded: ", decoded);

    // Extract the engine RPM data (assuming byteA and byteB are the RPM bytes)
    // const byteA = dataView[0];
    // const byteB = dataView[1];

    // // Calculate the engine RPM using the formula you mentioned
    // const engineRpm = (byteA * 256 + byteB) / 4;
    // console.log("Engine RPM: ", engineRpm);

    // Update the state or perform any other action with the engine RPM value
    // setSpeed(engineRpm);
  }

  // Write commands to the device
  async function sendObdCommand(command) {
    try {
      // Convert the ASCII command to Uint8Array
      const commandString = command + "\r"; // Include the "\r" character
      const commandArray = new TextEncoder().encode(commandString);

      // Send the command to the ELM327 adapter
      console.log("Sending: ", command, " as ", commandArray, " to device...");
      await writeCharacteristic.writeValue(commandArray);
      console.log("Sent successfully!");
    } catch (error) {
      console.error("Error sending OBD command:", error);
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col p-2 items-center justify-center overflow-hidden bg-black">
      {/* PORTRAIT MODE */}
      {!isLandscape && !isReverseLandscape && (
        <>
          <ul className=" border-2 mb-5 p-4 rounded-md">
            <li>
              Selected device:{" "}
              <span className=" text-cyan-500">
                {selectedDeviceName || "none"}
              </span>
            </li>

            <li>
              Connected:{" "}
              <span
                className={
                  connectedToDevice ? "text-green-600" : "text-red-500"
                }
              >
                {connectedToDevice.toString()}
              </span>
            </li>

            <li>
              Listening for notifications:{" "}
              <span
                className={
                  isListeningForNotifications
                    ? "text-green-600"
                    : "text-red-500"
                }
              >
                {isListeningForNotifications.toString()}
              </span>
            </li>
          </ul>

          <button
            onClick={requestBluetoothDevice}
            className=" bg-slate-200 mt-2 text-black active:scale-95 px-2"
          >
            Request Bluetooth Device
          </button>

          {/* SETUP BUTTONS */}
          <p>SETUP COMMANDS:</p>
          <button
            onClick={() => sendObdCommand("ATZ")}
            className="bg-slate-200 mt-2 text-black active:scale-95 px-2"
          >
            ATZ - Reset and returns ELM identification
          </button>
          <button
            onClick={() => sendObdCommand("ATL0")}
            className="bg-slate-200 mt-2 text-black active:scale-95 px-2"
          >
            ATL0 - Turn off extra line feed
          </button>
          <button
            onClick={() => sendObdCommand("ATS0")}
            className="bg-slate-200 mt-2 text-black active:scale-95 px-2"
          >
            ATS0 - Disable spaces in in output
          </button>
          <button
            onClick={() => sendObdCommand("ATH0")}
            className="bg-slate-200 mt-2 text-black active:scale-95 px-2"
          >
            ATH0 - Turn off headers
          </button>
          <button
            onClick={() => sendObdCommand("ATE0")}
            className="bg-slate-200 mt-2 text-black active:scale-95 px-2"
          >
            ATE0 - Turn off echo
          </button>
          <button
            onClick={() => sendObdCommand("ATAT2")}
            className="bg-slate-200 mt-2 text-black active:scale-95 px-2"
          >
            ATAT2 - Set adaptive timing to 2
          </button>
          <button
            onClick={() => sendObdCommand("ATSP0")}
            className="bg-slate-200 mt-2 text-black active:scale-95 px-2"
          >
            ATSP0 - Set Protocol to auto
          </button>

          <p>GET COMMANDS:</p>
          <button
            onClick={() => sendObdCommand("010C")}
            className="bg-slate-200 mt-2 text-black active:scale-95 px-2"
          >
            010C - ENGINE RPM
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
