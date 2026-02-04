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
  const [runningText, setRunningText] = useState('') // State untuk pengumuman

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    // Ambil Video
    const { data: vids } = await supabase.from('videos').select('*').order('id', { ascending: false })
    if (vids) {
      setVideos(vids)
      setFilteredVideos(vids)
    }
    // Ambil Pengumuman
    const { data: setts } = await supabase.from('settings').select('announcement').eq('id', 1).single()
    if (setts) setRunningText(setts.announcement)
  }

  useEffect(() => {
    const hasil = videos.filter(v => v.title.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredVideos(hasil)
  }, [searchTerm, videos])

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* NAVBAR */}
      <nav style={{ padding: '12px 5%', background: 'rgba(0,0,0,0.9)', position: 'fixed', width: '100%', zIndex: 100, borderBottom: '1px solid #222', boxSizing: 'border-box', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ backgroundColor: '#E50914', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>S</div>
          <h1 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>TREAMING<span style={{color:'#E50914'}}>KU</span></h1>
        </a>
        <input placeholder="Cari..." onChange={(e) => setSearchTerm(e.target.value)} style={{ background: '#111', color: '#fff', border: '1px solid #333', padding: '5px 12px', borderRadius: '20px', width: '100px' }} />
      </nav>

      {/* TEKS PENGUMUMAN BERJALAN */}
      <div style={{ position: 'fixed', top: '55px', width: '100%', background: '#E50914', color: '#fff', fontSize: '0.8rem', fontWeight: 'bold', padding: '4px 0', zIndex: 99 }}>
        <marquee scrollamount="6">{runningText}</marquee>
      </div>

      {/* DAFTAR FILM */}
      <div style={{ paddingTop: '100px', padding: '100px 5% 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '15px' }}>
          {filteredVideos.map((vid) => (
            <a href={`/watch/${vid.id}`} key={vid.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ position: 'relative', paddingTop: '150%', borderRadius: '8px', overflow: 'hidden', background: '#111' }}>
                <img src={`https://images.weserv.nl/?url=${encodeURIComponent(vid.thumbnail)}&w=300`} style={{ position: 'absolute', top: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <p style={{ fontSize: '0.75rem', marginTop: '8px', textAlign: 'center' }}>{vid.title}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
