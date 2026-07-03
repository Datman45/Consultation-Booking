import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BootstrapActivation from "@/helpers/BootstrapActivation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="appContainer"> {children} </main>
        <Footer />
        <BootstrapActivation />
      </body>
    </html>
  );
}
