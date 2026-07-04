"use client";

import NavLinks from "next/link";
import { useContext } from "react";
import { ClientContex } from "../contex/ClientContex";

export default function Header() {
  const { setClientInfo, clientInfo } = useContext(ClientContex);

  return (
    <>
      <header>
        <nav>
          <div className="project-name">
            <p>Consultation Booking | credits: {clientInfo?.credits ?? 0}</p>
          </div>
          <div className="nav-links">
            <NavLinks className="nav-link" href="/">
              Home
            </NavLinks>

            {clientInfo?.id && (
              <NavLinks className="nav-link" href="/bookings">
                Booking
              </NavLinks>
            )}
            {clientInfo?.id && (
              <NavLinks
                className="nav-link"
                href="#"
                onClick={() => {
                  setClientInfo!(undefined);
                }}
              >
                Log out
              </NavLinks>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}
