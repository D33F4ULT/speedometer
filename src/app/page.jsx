"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-5 bg-black">
      <ul className="flex flex-col items-center max-w-[200px] w-full gap-4">
        <li className=" border-2 w-full flex flex-col items-center rounded-md overflow-hidden active:scale-95">
          <Link
            href="/gps"
            className="flex items-center gap-2 w-full py-2 px-4 justify-center hover:bg-slate-900"
          >
            <Image
              src="/icons/location-dot.svg"
              width={16}
              height={16}
              alt="gps"
              priority
            />
            GPS
          </Link>
        </li>
        <li className=" border-2 w-full flex flex-col items-center rounded-md overflow-hidden active:scale-95">
          <Link
            href="obd"
            className="flex items-center gap-2 w-full py-2 px-4 justify-center hover:bg-slate-900"
          >
            <Image
              src="/icons/ethernet.svg"
              width={18}
              height={18}
              alt="obd"
              priority
            />
            OBD-II
          </Link>
        </li>
      </ul>
    </main>
  );
}
