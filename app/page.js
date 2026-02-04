"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// KONFIGURASI SUPABASE
const SB_URL = "https://wakwbmuanzglmawqzopi.supabase.co"
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indha3dibXVhbnpnbG1hd3F6b3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDc5MjYsImV4cCI6MjA4NTY4MzkyNn0.oVcKaJY9-RNu4QSk32fi3h8Lb-mBm4FXFuEfwKFmLZo"
const supabase = createClient(SB_URL, SB_KEY)

export default function Home() {
  const [videos, setVideos] = useState([])
  const [filteredVideos, setFilteredVideos] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    const { data } = await supabase.from('videos').select('*').order('id', { ascending: false })
    if (data) {
      setVideos(data)
      setFilteredVideos(data)
    }
  }

  useEffect(() => {
    const hasil = videos.filter(v => 
      v.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredVideos(hasil)
  }, [searchTerm, videos])

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* NAVBAR MODERN DENGAN LOGO PREMIUM */}
      <nav style={{ 
        padding: '12px 5%', 
        background: 'rgba(0,0,0,0.7)', 
        position: 'fixed', 
        width: '100%', 
        zIndex: 100, 
        borderBottom: '1px solid rgba(255,255,255,0.1)', 
        boxSizing: 'border-box',
        backdropFilter: 'blur(15px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        
        {/* LOGO AREA */}
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            backgroundColor: '#E50914',
            color: '#fff',
            padding: '2px 9px',
            borderRadius: '5px',
            fontWeight: '900',
            fontSize: '1.3rem',
            fontStyle: 'italic',
            boxShadow: '0 0 15px rgba(229, 9, 20, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>S</div>
          <h1 style={{ 
            margin: 0, 
            fontSize: '1.3rem', 
            fontWeight: '900', 
            letterSpacing: '0.5px',
            background: 'linear-gradient(180deg, #ffffff 40%, #a1a1a1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            TREAMING<span style={{ color: '#E50914', WebkitTextFillColor: '#E50914' }}>KU</span>
          </h1>
        </a>

        {/* SEARCH BOX ANIMASI */}
        <div style={{ position: 'relative' }}>
          <input 
            placeholder="Cari film..." 
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              background: 'rgba(255,255,255,0.1)', 
              color: '#fff', 
              border: '1px solid rgba(255,255,255,0.2)', 
              padding: '8px 15px', 
              borderRadius: '25px', 
              width: '120px', 
              outline: 'none',
              fontSize: '0.85rem',
              transition: 'all 0.4s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.width = '200px';
              e.target.style.background = 'rgba(255,255,255,0.15)';
              e.target.style.borderColor = '#E50914';
            }}
            onBlur={(e) => {
              e.target.style.width = '120px';
              e.target.style.background = 'rgba(255,255,255,0.1)';
              e.target.style.borderColor = 'rgba(255,255,255,0.2)';
            }}
          />
        </div>
      </nav>

      {/* GRID KONTEN */}
      <div style={{ paddingTop: '100px', paddingLeft: '4%', paddingRight: '4%', paddingBottom: '40px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
          gap: '15px' 
        }}>
          {filteredVideos.map((vid) => (
            <a href={`/watch/${vid.id}`} key={vid.id} style={{ textDecoration: 'none', color: 'inherit', group: 'true' }}>
              <div style={{ 
                position: 'relative', 
                paddingTop: '150%', 
                borderRadius: '10px', 
                overflow: 'hidden', 
                background: '#111',
                boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <img 
                  src={`https://images.weserv.nl/?url=${encodeURIComponent(vid.thumbnail)}&w=300`} 
                  referrerPolicy="no-referrer"
                  alt={vid.title}
                  style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                  }} 
                  onError={(e) => { e.target.src = "https://via.placeholder.com/300x450?text=Error+Poster" }}
                />
                {/* Overlay Hitam Tipis biar judul kebaca kalau ada yang nempel */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                  height: '40%',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                  pointerEvents: 'none'
                }}></div>
              </div>
              <h4 style={{ 
                fontSize: '0.8rem', 
                marginTop: '10px', 
                textAlign: 'left', 
                fontWeight: '500', 
                lineHeight: '1.2',
                height: '2.4em', 
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                color: '#ddd'
              }}>
                {vid.title}
              </h4>
            </a>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '100px', color: '#555' }}>
            <p>Video tidak ditemukan...</p>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ padding: '30px', textAlign: 'center', borderTop: '1px solid #111', color: '#333', fontSize: '0.8rem' }}>
        © 2026 STREAMINGKU - All Rights Reserved
      </footer>
    </div>
  )
}
