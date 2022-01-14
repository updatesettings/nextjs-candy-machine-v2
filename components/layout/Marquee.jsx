import React from "react";

export default function Marquee() {
  return (
    <a
      href="https://github.com/updatesettings/nextjs-candy-machine-v2"
      target="_blank"
      rel="noreferrer"
    >
      <div className="relative flex overflow-x-hidden bg-green-400 text-white">
        <div className="animate-marquee whitespace-nowrap">
          <span className="text-lg font-semibold mx-16 uppercase">
            Beta Release
          </span>
          <span className="text-lg font-semibold mx-16 uppercase">
            Update Settings
          </span>
          <span className="text-lg font-semibold mx-16 uppercase">
            Candy Machine v2
          </span>
          <span className="text-lg font-semibold mx-16 uppercase">Next.js</span>
          <span className="text-lg font-semibold mx-16 uppercase">0.1.0</span>
        </div>

        <div className="absolute top-0 animate-marquee2 whitespace-nowrap">
          <span className="text-lg font-semibold mx-16 uppercase">
            Beta Release
          </span>
          <span className="text-lg font-semibold mx-16 uppercase">
            Update Settings
          </span>
          <span className="text-lg font-semibold mx-16 uppercase">
            Candy Machine v2
          </span>
          <span className="text-lg font-semibold mx-16 uppercase">Next.js</span>
          <span className="text-lg font-semibold mx-16 uppercase">0.1.0</span>
        </div>
      </div>
    </a>
  );
}
