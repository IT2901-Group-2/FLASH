import { THEME_RESOLVED_COOKIE_KEY } from "@/config/theme";
import { JoinedEventsProvider } from "@/providers/JoinedEventsProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import ThemeProvider from "@/providers/ThemeProvider";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialResolvedTheme =
    cookieStore.get(THEME_RESOLVED_COOKIE_KEY)?.value ?? "light";

  return (
    <html
      lang="en"
      data-theme={initialResolvedTheme}
      style={{ colorScheme: initialResolvedTheme }}
    >
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NextIntlClientProvider>
          <ReactQueryProvider>
            <JoinedEventsProvider>
              <ThemeProvider defaultTheme={"system"}>{children}</ThemeProvider>
            </JoinedEventsProvider>
          </ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
