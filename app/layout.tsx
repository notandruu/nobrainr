import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import PageTransition from "@/components/page-transition"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "nobrainr.app - Find the Best Gaming Products Instantly",
  description:
    "AI-powered product recommendations from Reddit's gaming community. Find the best gaming gear trusted by real gamers.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
        <meta name="theme-color" content="#131730" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Disable pull-to-refresh
              let startY = 0;
              let isScrolling = false;
              
              document.addEventListener('touchstart', function(e) {
                startY = e.touches[0].pageY;
                isScrolling = false;
              }, { passive: false });
              
              document.addEventListener('touchmove', function(e) {
                const currentY = e.touches[0].pageY;
                const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                
                // If we're at the top and trying to scroll up, prevent it
                if (scrollTop === 0 && currentY > startY) {
                  e.preventDefault();
                  return false;
                }
                
                isScrolling = true;
              }, { passive: false });
              
              // Prevent overscroll on desktop
              document.addEventListener('wheel', function(e) {
                const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                if (scrollTop === 0 && e.deltaY < 0) {
                  e.preventDefault();
                  return false;
                }
              }, { passive: false });
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  )
}
