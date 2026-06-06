import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aviv Nachshon",
  description: "Film & Video Director",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
