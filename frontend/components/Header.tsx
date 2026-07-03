import NavLinks from "next/link";

export default function Header() {
  return (
    <>
      <header>
        <nav>
          <div className="project-name">
            <p>Consultation Booking</p>
          </div>
          <div className="nav-links">
            <NavLinks className="nav-link" href="/">
              Home
            </NavLinks>
            <NavLinks className="nav-link" href="/bookings">
              Booking
            </NavLinks>
          </div>
        </nav>
      </header>
    </>
  );
}
