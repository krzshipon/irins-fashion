import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google"; // proper standard imports
import "@/styles/globals.css";
import { LocalizationProvider } from "@/context/LocalizationContext";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: 'swap' });
const lato = Lato({
  weight: ['300', '400', '700'],
  subsets: ["latin"],
  variable: "--font-lato",
  display: 'swap'
});

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
      <body className={`${playfair.variable} ${lato.variable}`} suppressHydrationWarning>
        <LocalizationProvider>
          <CartProvider>
            <AuthProvider>
              <MainLayout>
                {children}
              </MainLayout>
            </AuthProvider>
          </CartProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}
