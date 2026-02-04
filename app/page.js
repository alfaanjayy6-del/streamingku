"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Konfigurasi Supabase
const SB_URL = "https://wakwbmuanzglmawqzopi.supabase.co"
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indha3dibXVhbnpnbG1hd3F6b3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDc5MjYsImV4cCI6MjA4NTY4MzkyNn0.oVcKaJY9-RNu4QSk32fi3h8Lb-mBm4FXFuEfwKFmLZo"
const supabase = createClient(SB_URL, SB_KEY)

export default function Home() {
  const [videos, setVideos] = useState([])
  const [filteredVideos, setFilteredVideos] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchVideos = async () => {
      const { data } = await supabase.from('videos').select('*').order('id', { ascending: false })
      if (data) {
        setVideos(data)
        setFilteredVideos(data)
      }
    }
    fetchVideos()
  }, [])

  useEffect(() => {
    const results = videos.filter(v => v.title.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredVideos(results)
  }, [searchTerm, videos])

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* HEADER */}
      <nav style={{ padding: '15px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000', position: 'fixed', width: '100%', zIndex: 10, boxSizing: 'border-box' }}>
        <h1 style={{ color: '#E50914', margin: 0, fontSize: '1.4rem' }}>STREAMINGKU</h1>
        <input 
          placeholder="Cari..." 
          onChange={(e) => setSearchTerm(e.target.value)} 
          style={{ background: '#222', color: '#fff', border: '1px solid #444', padding: '8px 15px', borderRadius: '20px', width: '150px' }} 
        />
      </nav>

      {/* GRID KONTEN */}
      <div style={{ paddingTop: '80px', paddingLeft: '5%', paddingRight: '5%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px' }}>
          
          {filteredVideos.map((vid) => {
            // JURUS ANTI-BLANK: Kita bersihkan link dan bungkus dengan Proxy wsrv.nl
            const cleanUrl = vid.thumbnail ? vid.thumbnail.replace('https://', '').replace('http://', '') : '';
            const proxyUrl = `https://wsrv.nl/?url=${cleanUrl}&w=300&output=webp`;

            return (
              <a href={`/watch/${vid.id}`} key={vid.id} style={{ textDecoration: 'none', color: '#fff' }}>
                <div style={{ position: 'relative', paddingTop: '150%', borderRadius: '8px', overflow: 'hidden', background: '#111' }}>
                  <img 
                    src={vid.thumbnail ? proxyUrl : "https://via.placeholder.com/300x450?text=No+Image"} 
                    alt={vid.title}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/300x450?text=Error+Load" }}
                  />
                </div>
                <p style={{ fontSize: '0.8rem', marginTop: '8px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {vid.title}
                </p>
              </a>
            )
          })}
          
        </div>
      </div>
    </div>
  )
}
