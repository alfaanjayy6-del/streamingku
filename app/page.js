"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Konfigurasi Supabase kamu
const SB_URL = "https://wakwbmuanzglmawqzopi.supabase.co"
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indha3dibXVhbnpnbG1hd3F6b3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDc5MjYsImV4cCI6MjA4NTY4MzkyNn0.oVcKaJY9-RNu4QSk32fi3h8Lb-mBm4FXFuEfwKFmLZo"
const supabase = createClient(SB_URL, SB_KEY)

export default function Home() {
  const [videos, setVideos] = useState([])
  const [filteredVideos, setFilteredVideos] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  // 1. Ambil data dari Supabase saat web dibuka
  useEffect(() => {
    const ambilData = async () => {
      const { data } = await supabase
        .from('videos')
        .select('*')
        .order('id', { ascending: false })
      
      if (data) {
        setVideos(data)
        setFilteredVideos(data)
      }
    }
    ambilData()
  }, [])

  // 2. Fungsi Filter untuk Fitur Pencarian
  useEffect(() => {
    const hasil = videos.filter(v => 
      v.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredVideos(hasil)
  }, [searchTerm, videos])

  return (
    <div style={{ backgroundColor: '#141414', color: '#fff', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      
      {/* HEADER / NAVBAR */}
      <nav style={{ 
        padding: '15px 4%', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        background: 'rgba(0,0,0,0.9)', 
        position: 'fixed', 
        width: '100%', 
        zIndex: 100,
        boxSizing: 'border-box'
      }}>
        <h1 style={{ color: '#E50914', margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>STREAMINGKU</h1>
        <input 
          placeholder="Cari film..." 
          onChange={(e) => setSearchTerm(e.target.value)} 
          style={{ 
            background: '#333', 
            color: '#fff', 
            border: '1px solid #555', 
            padding: '8px 15px', 
            borderRadius: '20px',
            outline: 'none',
            width: '150px'
          }} 
        />
      </nav>

      {/* GRID KONTEN VIDEO */}
      <div style={{ paddingTop: '100px', paddingLeft: '4%', paddingRight: '4%', paddingBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>Koleksi Terbaru</h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
          gap: '15px' 
        }}>
          {filteredVideos.map((vid) => (
            <a href={`/watch/${vid.id}`} key={vid.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="video-card">
                <div style={{ 
                  position: 'relative', 
                  paddingTop: '140%', // Perbandingan poster biar tegak ala Netflix
                  borderRadius: '8px', 
                  overflow: 'hidden', 
                  background: '#222',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
                }}>
                  <img 
                    // PAKAI KOLOM: thumbnail (Tanpa S)
                    src={vid.thumbnail || "https://via.placeholder.com/300x450?text=No+Image"} 
                    alt={vid.title}
                    style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }} 
                  />
                </div>
                <h4 style={{ 
                  fontSize: '0.85rem', 
                  marginTop: '8px', 
                  textAlign: 'center', 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis',
                  fontWeight: 'normal'
                }}>
                  {vid.title}
                </h4>
              </div>
            </a>
          ))}
        </div>

        {/* Jika hasil pencarian kosong */}
        {filteredVideos.length === 0 && (
          <p style={{ textAlign: 'center', color: '#888', marginTop: '50px' }}>Film tidak ditemukan...</p>
        )}
      </div>

      {/* CSS EFEK HOVER */}
      <style jsx>{`
        .video-card {
          transition: transform 0.3s ease;
        }
        .video-card:hover {
          transform: scale(1.08);
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
