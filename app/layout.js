import "./globals.css";
import Script from "next/script";

// 1. KONFIGURASI (Ganti Sesuai Milikmu)
const TELEGRAM_LINK = "https://t.me/UsernameChannelKamu"; 
const ID_HISTATS = "7301723"; // Contoh: "1234567"

export const metadata = {
  title: "STREAMINGKU - Nonton Film Gratis",
  description: "Streaming film terbaru kualitas tinggi tanpa iklan banner",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        {/* Adsterra Pop-under */}
        <Script 
          src="//pl25944186.highperformanceformat.com/8a/83/87/8a83870624029471f83c182582736142.js" 
          strategy="lazyOnload" 
        />

        {/* --- TRACKING HISTATS --- */}
        <Script id="histats-counter" strategy="afterInteractive">
          {`
            var _Hasync= _Hasync|| [];
            _Hasync.push(['Histats.start', '1,${ID_HISTATS},4,0,0,0,00010000']);
            _Hasync.push(['Histats.fasi', '1']);
            _Hasync.push(['Histats.track_hits', '']);
            (function() {
              var hs = document.createElement('script'); hs.type = 'text/javascript'; hs.async = true;
              hs.src = ('//s10.histats.com/js15_as.js');
              (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(hs);
            })();
          `}
        </Script>
      </head>
      
      <body style={{ margin: 0, backgroundColor: '#000', color: '#fff' }}>
        {children}

        {/* Tombol Telegram Melayang */}
        <div style={{ position: 'fixed', bottom: '25px', right: '20px', zIndex: 10000 }}>
          <a href={TELEGRAM_LINK} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '60px', height: '60px', backgroundColor: '#0088cc', borderRadius: '50%', boxShadow: '0 4px 15px rgba(0,0,0,0.5)', textDecoration: 'none', position: 'relative' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            <span style={{ position: 'absolute', top: '2px', right: '2px', width: '15px', height: '15px', backgroundColor: '#ff0000', borderRadius: '50%', border: '2px solid #fff' }}>
              <span style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#ff0000', borderRadius: '50%', animation: 'ping 1.5s infinite', opacity: 0.75 }}></span>
            </span>
          </a>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `@keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }`}} />
        
        {/* Histats No-Script (Backup) */}
        <noscript>
          <a href="/" target="_blank">
            <img src={`//sstatic1.histats.com/0.gif?${ID_HISTATS}&101`} alt="stats" border="0" />
          </a>
        </noscript>
      </body>
    </html>
  );
}
