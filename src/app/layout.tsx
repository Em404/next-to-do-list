import type { Metadata } from "next";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { dark } from "@clerk/themes";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body>
          <div className="min-h-screen bg-neutral-950 text-neutral-50">
            <div className="py-4 px-4 md:px-16 sticky top-0 bg-purple-800 z-10">
              <Navbar />
            </div>
            <div className="container mx-auto px-4 md:px-16">
              <TRPCReactProvider>{children}</TRPCReactProvider>
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
