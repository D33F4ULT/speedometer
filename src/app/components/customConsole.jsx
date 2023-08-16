import React, { useState, useEffect } from "react";

function CustomConsole() {
  const [consoleMessages, setConsoleMessages] = useState([]);

  useEffect(() => {
    // Function to capture console messages
    const captureConsoleMessages = (message) => {
      setConsoleMessages((prevMessages) => [...prevMessages, message]);
    };

    // Redirect console messages to your capture function
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      originalConsoleLog(...args);
      captureConsoleMessages(args.join(" "));

      const element = document.getElementById("log");
      element.scroll({ top: element.scrollHeight, behavior: "smooth" });
    };

    // Clean up by restoring the original console.log
    return () => {
      console.log = originalConsoleLog;
    };
  }, []);

  return (
    <pre
      id="log"
      className="bg-slate-900 p-4 rounded-md w-full h-80 text-xs whitespace-pre-wrap overflow-y-auto"
    >
      {consoleMessages.join("\n-")}
    </pre>
  );
}

export default CustomConsole;
