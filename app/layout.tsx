import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Navbar } from "@/components/layout/navbar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Footer } from "@/components/layout/footer"

const _poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "PetHub - Encontre seu Pet",
  description: "Plataforma comunitária para reunir pets perdidos com seus donos",
  generator: "v0.app",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Navbar and MobileNav now handle their own auth state client-side

  return (
    <html lang="pt-BR">
      <body className={`font-sans antialiased ${_poppins.variable}`}>
        <Navbar />

        <main className="md:min-h-screen">{children}</main>

        <Footer />

        {/* <MobileNav /> */}

        <Analytics />
      </body>
    </html>
  )
}
