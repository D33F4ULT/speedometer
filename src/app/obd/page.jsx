"use client";

import { useEffect, useState } from "react";
import { useOrientationStates } from "../components/OrientationComponent";
import CustomConsole from "../components/customConsole";

export default function Home() {
  const [selectedDeviceName, setSelectedDeviceName] = useState("");
  const [connectedToDevice, setConectedToDevice] = useState(false);
  const [selectedCharacteristic, setSelectedCharacteristic] = useState(null); // hold the characteristic
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
      console.log("Retrieving characteristic UUID2...");
      const characteristic2 = await service.getCharacteristic(
        characteristicUUID2
      );
      setSelectedCharacteristic(characteristic1); // Set the characteristic in the state

      console.log("Connected to GATT server: ", server);
      setConectedToDevice(true);

      // Start listening for notifications only if not already listening
      if (!isListeningForNotifications) {
        console.log("Start Notifications...");
        await characteristic.startNotifications();
        setIsListeningForNotifications(true);
        characteristic.addEventListener(
          "characteristicvaluechanged",
          handleCharacteristicValueChanged
        );
      }

      // Now you can interact with the GATT server and its services
    } catch (error) {
      console.log("[ERROR]:", error);
      setConectedToDevice(false);
    }
  }

  // Process received notifications
  function handleCharacteristicValueChanged(event) {
    console.log("Characteristic Value Changed!");
    const value = event.target.value;
    console.log("Received: ", value);

    // Convert the received Uint8Array to a string
    const receivedData = new TextDecoder().decode(value);
    console.log("Received Decoded: ", receivedData);

    // Process the received data to extract engine RPM
    // You need to know the response format of your ELM327 adapter
    // and the appropriate command to retrieve engine RPM
    // const engineRpm = /* extract engine RPM from receivedData */;
    // ((parseInt(byteA, 16) * 256) + parseInt(byteB, 16)) / 4;
    // setSpeed(engineRpm); // Assuming you want to display RPM in the speed field
  }

  // Write commands to the device
  async function sendObdCommand(characteristic, command) {
    try {
      // Convert the ASCII command to Uint8Array
      console.log("Converting ", command, " to Uint8Array...");
      const commandArray = new TextEncoder().encode(command);

      // Send the command to the ELM327 adapter
      console.log("Sending: ", commandArray, " to device...");

      await characteristic.writeValue(commandArray);
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
            onClick={() => sendObdCommand(selectedCharacteristic, "ATZ")}
            className="bg-slate-200 mt-2 text-black active:scale-95 px-2"
          >
            ATZ - Reset and returns ELM identification
          </button>
          <button
            onClick={() => sendObdCommand(selectedCharacteristic, "ATL0")}
            className="bg-slate-200 mt-2 text-black active:scale-95 px-2"
          >
            ATL0 - Turn off extra line feed
          </button>
          <button
            onClick={() => sendObdCommand(selectedCharacteristic, "ATS0")}
            className="bg-slate-200 mt-2 text-black active:scale-95 px-2"
          >
            ATS0 - Disable spaces in in output
          </button>
          <button
            onClick={() => sendObdCommand(selectedCharacteristic, "ATH0")}
            className="bg-slate-200 mt-2 text-black active:scale-95 px-2"
          >
            ATH0 - Turn off headers
          </button>
          <button
            onClick={() => sendObdCommand(selectedCharacteristic, "ATE0")}
            className="bg-slate-200 mt-2 text-black active:scale-95 px-2"
          >
            ATE0 - Turn off echo
          </button>
          <button
            onClick={() => sendObdCommand(selectedCharacteristic, "ATAT2")}
            className="bg-slate-200 mt-2 text-black active:scale-95 px-2"
          >
            ATAT2 - Turn adaptive timing to 2
          </button>
          <button
            onClick={() => sendObdCommand(selectedCharacteristic, "ATSP0")}
            className="bg-slate-200 mt-2 text-black active:scale-95 px-2"
          >
            ATSP0 - Set Protocol to auto
          </button>

          <p>GET COMMANDS:</p>
          <button
            onClick={() => sendObdCommand(selectedCharacteristic, "010C")}
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
