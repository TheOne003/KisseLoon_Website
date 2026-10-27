import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/context/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Kisse Loon — Compare food and grocery prices",
  description:
    "Compare restaurant and grocery prices across delivery platforms, keep a Kisse Loon cart, then continue on the better option.",
  icons: { icon: "/assets/favicon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} app-root`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
