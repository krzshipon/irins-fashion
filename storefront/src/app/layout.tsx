import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "@/styles/globals.css";
import { LocalizationProvider } from "@/context/LocalizationContext";
import { CartProvider } from "@/context/CartContext";
import MainLayout from "@/components/layout/MainLayout";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Irin's Fashion | Modest & Elegant",
  description: "Premium modest fashion for women.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
        <LocalizationProvider>
          <CartProvider>
            <MainLayout>
              {children}
            </MainLayout>
          </CartProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}
