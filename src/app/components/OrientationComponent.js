import { useEffect, useState } from "react";

export const useOrientationStates = () => {
  const [isLandscape, setIsLandscape] = useState(false);
  const [isReverseLandscape, setIsReverseLandscape] = useState(false);

  useEffect(() => {
    const handleOrientationChange = (event) => {
      const { matches, media } = event;

      if (media === "(orientation: landscape)") {
        setIsLandscape(matches);
        setIsReverseLandscape(false);
      } else if (
        media === "(orientation: landscape) and (transform: rotate(180deg))"
      ) {
        setIsReverseLandscape(matches);
        setIsLandscape(false);
      } else {
        setIsLandscape(false);
        setIsReverseLandscape(false);
      }
    };

    // Initial orientation check
    const landscapeMediaQuery = window.matchMedia("(orientation: landscape)");
    const reverseLandscapeMediaQuery = window.matchMedia(
      "(orientation: landscape) and (transform: rotate(180deg))"
    );

    handleOrientationChange(landscapeMediaQuery);
    handleOrientationChange(reverseLandscapeMediaQuery);

    // Add listeners to detect orientation changes
    landscapeMediaQuery.addEventListener("change", handleOrientationChange);
    reverseLandscapeMediaQuery.addEventListener(
      "change",
      handleOrientationChange
    );

    // Clean up event listeners on unmount
    return () => {
      landscapeMediaQuery.removeEventListener(
        "change",
        handleOrientationChange
      );
      reverseLandscapeMediaQuery.removeEventListener(
        "change",
        handleOrientationChange
      );
    };
  }, []);

  return { isLandscape, isReverseLandscape };
};
