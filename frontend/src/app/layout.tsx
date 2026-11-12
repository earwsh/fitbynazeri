import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazir",
  display: "swap",
});

export const metadata: Metadata = {
  title: "آکادمی مربیگری و بدنسازی ناظری | دریافت برنامه تمرینی و غذایی آنلاین",
  description: "طراحی علمی برنامه‌های بدنسازی، فیتنس و تغذیه اختصاصی همراه با مربیگری و پشتیبانی هفتگی توسط احسان ناظری",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`scroll-smooth ${vazir.variable}`}>
      <body
        className={`${vazir.className} bg-[#141414] text-[#e5e2e1] antialiased selection:bg-[#ff6600] selection:text-white min-h-screen flex flex-col justify-between`}
      >
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
