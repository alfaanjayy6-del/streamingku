"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// --- KONFIGURASI ---
const SB_URL = "https://wakwbmuanzglmawqzopi.supabase.co"
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indha3dibXVhbnpnbG1hd3F6b3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDc5MjYsImV4cCI6MjA4NTY4MzkyNn0.oVcKaJY9-RNu4QSk32fi3h8Lb-mBm4FXFuEfwKFmLZo"
const supabase = createClient(SB_URL, SB_KEY)

export default function Home() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ambilData = async () => {
      const { data } = await supabase.from('videos').select('*').order('id', { ascending: false })
      if (data) setVideos(data)
      setLoading(false)
    }
    ambilData()
  }, [])

  return (
    <div style={{ backgroundColor: '#141414', color: '#fff', minHeight: '100vh', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      
      {/* Navbar Minimalis */}
      <nav style={{ padding: '20px 4%', display: 'flex', alignItems: 'center', background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)', position: 'fixed', width: '100%', zIndex: 10 }}>
        <h1 style={{ color: '#E50914', fontSize: '1.8rem', fontWeight: 'bold', margin: 0, letterSpacing: '1px' }}>STREAMINGKU</h1>
      </nav>

      {/* Hero Section Sederhana */}
      <div style={{ height: '40vh', display: 'flex', alignItems: 'center', padding: '0 4%', background: 'linear-gradient(to right, #141414, rgba(20,20,20,0))' }}>
        <div>
          <h2 style={{ fontSize: '3rem', marginBottom: '10px' }}>Koleksi Video Terbaru</h2>
          <p style={{ fontSize: '1.2rem', color: '#aaa' }}>Tonton koleksi video pilihan langsung dari database pribadi kamu.</p>
        </div>
      </div>

      {/* Grid Video */}
      <div style={{ padding: '0 4% 50px 4%' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#e5e5e5' }}>Rekomendasi Untukmu</h3>
        
        {loading ? (
          <p>Memuat video...</p>
        ) : videos.length === 0 ? (
          <p style={{color: '#666'}}>Belum ada koleksi video.</p>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '20px' 
          }}>
            {videos.map((vid) => (
              <div key={vid.id} className="video-card" style={{ 
                background: '#181818', 
                borderRadius: '4px', 
                overflow: 'hidden',
                transition: 'transform 0.3s ease',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
              }}>
                {/* Container Iframe */}
                <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                  <iframe 
                    src={vid.url} 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} 
                    allowFullScreen
                  ></iframe>
                </div>
                
                {/* Info Video */}
                <div style={{ padding: '15px' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: '#fff' }}>{vid.title}</h4>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#46d369', fontWeight: 'bold' }}>98% Match</span>
                    <span style={{ fontSize: '0.8rem', color: '#aaa', border: '1px solid #aaa', padding: '0 5px' }}>HD</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CSS untuk efek hover sederhana */}
      <style jsx>{`
        .video-card:hover {
          transform: scale(1.05);
          z-index: 2;
        }
      `}</style>
    </div>
  )
}
