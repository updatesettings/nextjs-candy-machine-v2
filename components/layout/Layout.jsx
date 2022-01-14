import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Menu from "../menu/Menu";
import Marquee from "./Marquee";

export default function Layout({ children }) {
  return (
    <div className="layout">
      <Marquee />
      <Header />
      <div className="body">
        <main className="main">{children}</main>
        <Footer />
      </div>
      <Menu />
    </div>
  );
}
