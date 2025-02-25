import type { Metadata } from "next";
import { Mali } from 'next/font/google'
import "./globals.css";
const mali = Mali({
  subsets: ["thai", "latin"], 
  weight: ["400", "700"], 
  display: "swap",
});


export const metadata: Metadata = {
  title: "MoodengPop",
  description: "Product Presented in LI101002",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-theme="valentine">
      <body
        className={`${mali.className}`}
      >
        {children}
      </body>
    </html>
  );
}