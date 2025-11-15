import type React from "react"
import type { Metadata } from "next"
import { Exo } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Web3ModalProvider } from "@/context/Web3Modal"
import { Toaster } from 'sonner'

const exo = Exo({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
})

export const metadata: Metadata = {
  title: "Assets IQ - Tokenized Property Investment",
  description: "Invest in tokenized real estate properties with Web3",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${exo.variable} font-sans antialiased bg-background text-foreground`}>
        <Web3ModalProvider>
        {children}
        <Toaster position="top-right" richColors />
        </Web3ModalProvider>
        <Analytics />
      </body>
    </html>
  )
}
