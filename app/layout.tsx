import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer"; // 1. Import the Footer

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://resume-forger.vercel.app"),
  title: {
    default: "Resume Forger | Free AI Resume Builder & ATS Scanner",
    template: "%s | Resume Forger",
  },
  description:
    "Build ATS-friendly resumes in minutes. Free open-source resume builder with real-time AI scoring, PDF export, and no watermarks.",
  keywords: [
    "Resume Builder",
    "ATS Scanner",
    "Free Resume Template",
    "AI Resume",
    "CV Maker",
    "Next.js Resume",
  ],
  authors: [{ name: "Awais Arif", url: "https://github.com/awaisarif18" }],
  creator: "Awais Arif",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Resume Forger - Build a Winner Resume",
    description:
      "Stop guessing keywords. Real-time ATS scoring and instant PDF export.",
    siteName: "Resume Forger",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Resume Forger Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume Forger | Free AI Resume Builder",
    description: "Build ATS-friendly resumes in minutes. No watermarks.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <main className="flex-grow">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
