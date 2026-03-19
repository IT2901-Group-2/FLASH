import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/providers/ThemeProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { JoinedEventsProvider } from "@/providers/JoinedEventsProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FLASH - Lets Anyone Self Host",
  description: "Self-hosted Photo Event Management System",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    shortcut: ["/favicon.ico"],
    other: [{ rel: "shortcut icon", url: "/favicon.ico", type: "image/x-icon" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NextIntlClientProvider>
          <ReactQueryProvider>
            <JoinedEventsProvider>
              <ThemeProvider defaultTheme="system">{children}</ThemeProvider>
            </JoinedEventsProvider>
          </ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
