import './globals.css'
import Script from 'next/script'

export const metadata = {
  title: 'StreamingKu',
  description: 'Nonton gratis tanpa ribet',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        {/* JURUS BIAR GAMBAR DOODSTREAM TIDAK BLANK */}
        <meta name="referrer" content="no-referrer" />
        
        {/* Iklan Adsterra kamu */}
        <Script 
          src="https://pl27333728.effectivegatecpm.com/e4/6a/bf/e46abf385099c2b5d894dbb1c522e30c.js" 
          strategy="afterInteractive" 
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
