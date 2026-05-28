import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ProProvider } from '@/context/ProContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Connect Four - Play Online",
  description: "Play Connect Four against the computer or friends. Clean, fast, and competitive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased bg-black text-white w-full`}>
        <ProProvider>
          {children}
        </ProProvider>
      </body>
    </html>
  );
}
