import type { Metadata } from "next";
import { Inter, Playfair_Display, Montserrat } from "next/font/google"; // proper standard imports
import "@/styles/globals.css";
import { LocalizationProvider } from "@/context/LocalizationContext";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: 'swap' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: 'swap' });
const montserrat = Montserrat({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-montserrat",
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
      <body className={`${inter.variable} ${playfair.variable} ${montserrat.variable}`} suppressHydrationWarning>
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
