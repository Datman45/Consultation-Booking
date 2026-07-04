"use client";

import "./globals.css";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import BootstrapActivation from "@/src/helpers/BootstrapActivation";
import { ClientContex } from "../contex/ClientContex";
import { useEffect, useState } from "react";
import { IClient } from "../types";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [clientInfo, setClientInfo] = useState<IClient | undefined>(undefined);

  useEffect(() => {
    try {
      const storedClientInfo = localStorage.getItem("_client");

      if (storedClientInfo) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setClientInfo(JSON.parse(storedClientInfo) as IClient);
      }
    } catch {
      setClientInfo(undefined);
    }
  }, []);

  const updateClientInfo = (value: IClient) => {
    setClientInfo(value);
    localStorage.setItem("_client", JSON.stringify(value));
  };

  return (
    <html lang="en">
      <body>
        <ClientContex.Provider
          value={{
            clientInfo,
            setClientInfo: updateClientInfo,
          }}
        >
          <Header />
          <main className="appContainer"> {children} </main>
          <Footer />
          <BootstrapActivation />
        </ClientContex.Provider>
      </body>
    </html>
  );
}
