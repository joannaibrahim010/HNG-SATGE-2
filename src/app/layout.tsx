import type { Metadata } from "next";
import { Roboto,Road_Rage, Alatsi } from "next/font/google";
import "./globals.css";


const roboto = Roboto({
  weight: ['100','300', '700'],
  variable: "--font-roboto",
  subsets: ["latin"],
});
const road_rage = Road_Rage({
  weight: '400',
  variable: "--font-road_rage",
  subsets: ["latin"],
});
const alatsi = Alatsi({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-alatsi', 
});


export const metadata: Metadata = {
  title: "Techember Ticket Generator",
  description: "Generate your conference tickets here easily",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<html lang="en" className={`${road_rage.variable} ${roboto.variable} ${alatsi.variable}`}>
      <body className="min-h-screen bg-[#02191D] f text-[#FAFAFA] antialiased font-roboto">
        {children}
      </body>
    </html>
  );
}