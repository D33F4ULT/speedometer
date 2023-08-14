"use client";

import Link from "next/link";
import Lottie from "react-lottie-player";
import lottieJson from "../assets/lotties/car.json";
import { useEffect, useState } from "react";
import { useOrientationStates } from "./components/OrientationComponent";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black">
      <Lottie
        loop
        animationData={lottieJson}
        play
        style={{ width: 200, height: 200 }}
        className="-mt-40"
      />

      <Link href="/speedometer" className="bg">
        START
      </Link>
    </main>
  );
}
