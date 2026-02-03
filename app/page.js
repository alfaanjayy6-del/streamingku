"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const SB_URL = "https://wakwbmuanzglmawqzopi.supabase.co"
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indha3dibXVhbnpnbG1hd3F6b3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDc5MjYsImV4cCI6MjA4NTY4MzkyNn0.oVcKaJY9-RNu4QSk32fi3h8Lb-mBm4FXFuEfwKFmLZo"
const supabase = createClient(SB_URL, SB_KEY)

export default function Home() {
  const [videos, setVideos] = useState([])
  const [filteredVideos, setFilteredVideos] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const ambilData = async () => {
      const { data } = await supabase.from('videos').select('*').order('id', { ascending: false })
      if (data) { setVideos(data); setFilteredVideos(data); }
    }
    ambilData()
  }, [])

  useEffect(() => {
    const hasil = videos.filter(v => v.title.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredVideos(hasil)
  }, [searchTerm, videos])

  // Fungsi ambil Thumbnail YouTube Otomatis
  const getThumb = (url) => {
    const id = url.split('embed/')[1] || url.split('v=')[1]?.split('&')[0];
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : 'https://via.placeholder.com/400x225/111/fff?text=Video';
  }

  return (
    <div style={{ backgroundColor: '#141414', color: '#fff', minHeight: '100vh', fontFamily: 'Arial' }}>
      <nav style={{ padding: '15px 4%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000', position: 'fixed', width: '100%', zIndex: 100 }}>
        <h1 style={{ color: '#E50914', margin: 0 }}>STREAMINGKU</h1>
        <input placeholder="Cari..." onChange={(e) => setSearchTerm(e.target.value)} style={{ background: '#333', color: '#fff', border: 'none', padding: '8px', borderRadius: '4px' }} />
      </nav>

      <div style={{ paddingTop: '100px', paddingLeft: '4%', paddingRight: '4%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {filteredVideos.map((vid) => (
            <a href={`/watch/${vid.id}`} key={vid.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ background: '#181818', borderRadius: '8px', overflow: 'hidden' }}>
                <img src={getThumb(vid.url)} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />
                <div style={{ padding: '10px' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem' }}>{vid.title}</h4>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
