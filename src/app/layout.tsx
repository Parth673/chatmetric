import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "./header";
import Providers from "./providers";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Metric Chat",
  description: "AI in your finger tips",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
        <body className={cn(
          "min-h-screen dark:bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black font-sans antialiased overflow-x-hidden",
          fontSans.variable
        )} suppressHydrationWarning={true}>
          <Providers>
            <Header />
            {/* <header><Header /></header> */}
            {children}
          </Providers>
        </body>
      </html>

  );
}
