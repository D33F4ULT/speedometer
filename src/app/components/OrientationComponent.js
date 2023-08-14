import { useEffect, useState } from "react";

export const useOrientationStates = () => {
  const [isLandscape, setIsLandscape] = useState(false);
  const [isReverseLandscape, setIsReverseLandscape] = useState(false);

  useEffect(() => {
    const handleOrientationChange = () => {
      const orientationAngle = window.orientation;

      setIsLandscape(orientationAngle === 90);
      setIsReverseLandscape(orientationAngle === -90);
    };

    // Initial orientation check
    handleOrientationChange();

    // Add orientationchange event listener to detect orientation changes
    window.addEventListener("orientationchange", handleOrientationChange);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  return { isLandscape, isReverseLandscape };
};
