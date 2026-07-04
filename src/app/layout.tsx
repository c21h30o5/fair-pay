import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fair Pay",
  description: "Split badminton bills fairly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
