"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BridgePage() {
  const [countdown, setCountdown] = useState(5); // Waktu tunggu 5 detik
  const router = useRouter();
  
  const WEB_UTAMA = "/"; // Alamat web utama kamu
  const TELEGRAM_LINK = "https://t.me/+d9TcoaiEqwQ3M2U1"; // Ganti link tele kamu

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(WEB_UTAMA); // Lempar ke web utama
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div style={{ 
      backgroundColor: '#050505', 
      color: '#fff', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontFamily: 'sans-serif',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        {/* ANIMASI LOADING SEDERHANA */}
        <div style={{ 
          width: '50px', 
          height: '50px', 
          border: '5px solid #333', 
          borderTop: '5px solid #E50914', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px auto'
        }}></div>

        <h2 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Menyiapkan Server Nonton...</h2>
        <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '30px' }}>
          Kamu akan dialihkan otomatis dalam <span style={{ color: '#E50914', fontWeight: 'bold' }}>{countdown}</span> detik.
        </p>

        {/* TOMBOL MANUAL (Jaga-jaga kalau auto redirect gagal di HP tertentu) */}
        <a href={WEB_UTAMA} style={{ 
          display: 'block', 
          background: '#E50914', 
          color: '#fff', 
          textDecoration: 'none', 
          padding: '15px', 
          borderRadius: '8px', 
          fontWeight: 'bold',
          marginBottom: '15px'
        }}>
          KLIK DISINI JIKA TIDAK PINDAH
        </a>

        <a href={TELEGRAM_LINK} target="_blank" style={{ 
          display: 'block', 
          color: '#0088cc', 
          textDecoration: 'none', 
          fontSize: '0.85rem',
          fontWeight: 'bold'
        }}>
          Join Telegram (Update Film Terbaru)
        </a>

        <div style={{ marginTop: '50px', fontSize: '0.7rem', color: '#222' }}>
          <p>Situs ini menggunakan sistem keamanan cloud demi kenyamanan pengunjung.</p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  )
}
