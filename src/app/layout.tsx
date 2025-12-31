import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "로켓콜 | 부동산 분양 확정 고객 연결 서비스",
  description: "부동산 분양 현장에 확정된 고객만 보내드립니다. 약속콜 전문 TM 서비스로 시간 절약, 매출 증대를 경험하세요.",
  keywords: "부동산 분양, 약속콜, TM, 텔레마케팅, 고객 유치, 분양 마케팅",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {/* 카카오톡 채팅 버튼 */}
        <a
          href="http://pf.kakao.com/_zxfugn/chat"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 hover:scale-110 transform"
          aria-label="카카오톡 상담"
        >
          <img
            src="/카톡_원형_로고.png"
            alt="카카오톡 상담"
            className="w-full h-full rounded-full"
          />
        </a>
      </body>
    </html>
  );
}
