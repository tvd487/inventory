import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/components/session-provider'
import { ReactQueryProvider } from '@/lib/react-query'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Inventory Management System',
  description: 'A comprehensive inventory management system with authentication and themes',
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body className={inter.className}>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </AuthProvider>
    </ThemeProvider>
    </body>
    </html>
  )
}
