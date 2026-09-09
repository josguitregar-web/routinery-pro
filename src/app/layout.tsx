import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Routinery Pro | Nothing OS Habit Tracker",
  description: "Minimalist habit and routine tracking designed with Nothing OS aesthetics.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark h-full bg-[#000000] text-white antialiased">
      <body className="min-h-full flex flex-col bg-[#000000] text-white font-sans selection:bg-[#FF0000] selection:text-white">
        {children}
      </body>
    </html>
  );
}
