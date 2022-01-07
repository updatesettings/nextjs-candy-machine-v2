// this is an overall context provider to use for random info you may need to store in state or call

import { useState, createContext, useContext } from "react";

const MainContext = createContext();

export default function MainContextProvider({ children }) {
  const [demo, setDemo] = useState("Welcome to Main Context");

  const value = { demo, setDemo };
  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
}

export function useMainContext() {
  return useContext(MainContext);
}
