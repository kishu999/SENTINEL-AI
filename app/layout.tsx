import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "SkillConnect | Your Skills. Your Earnings. Your Future.",
  description:
    "Student-focused freelancing and micro-task marketplace connecting college students for project collaboration, design, code, tutoring, and presentation support.",
  keywords: [
    "student freelancing",
    "campus gig economy",
    "student micro-tasks",
    "college tutoring",
    "peer programming assistance",
    "student portfolio building",
  ],
  openGraph: {
    title: "SkillConnect | The Student Freelancing Marketplace",
    description: "Turn your skills into opportunities. Connect with talented students, build real portfolios, and earn while you learn.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased text-foreground">
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
