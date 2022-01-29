import React from "react";
import siteData from "../../data/siteData";

export default function Marquee() {
  // To Do: Create a function that determines if this is an internal (should use next/link) or external link (has target="_blank")
  const { text, link } = siteData.marquee;
  return (
    <a href={link} target="_blank" rel="noreferrer">
      <div className="relative flex overflow-x-hidden bg-green-400 text-white">
        <div className="animate-marquee whitespace-nowrap">
          {text.map((text, index) => {
            return (
              <span
                className="text-lg font-semibold mx-16 uppercase"
                key={index}
              >
                {text}
              </span>
            );
          })}
        </div>

        <div className="absolute top-0 animate-marquee2 whitespace-nowrap">
          {text.map((text, index) => {
            return (
              <span
                className="text-lg font-semibold mx-16 uppercase"
                key={index}
              >
                {text}
              </span>
            );
          })}
        </div>
      </div>
    </a>
  );
}
