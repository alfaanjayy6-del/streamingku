"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useParams } from 'next/navigation'

const SB_URL = "https://wakwbmuanzglmawqzopi.supabase.co"
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indha3dibXVhbnpnbG1hd3F6b3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDc5MjYsImV4cCI6MjA4NTY4MzkyNn0.oVcKaJY9-RNu4QSk32fi3h8Lb-mBm4FXFuEfwKFmLZo"
const supabase = createClient(SB_URL, SB_KEY)

export default function WatchPage() {
  const { id } = useParams()
  const [video, setVideo] = useState(null)
  const [related, setRelated] = useState([])

  useEffect(() => {
    if (id) {
      fetchVideoDetail()
      fetchRelated()
    }
  }, [id])

  const fetchVideoDetail = async () => {
    const { data } = await supabase.from('videos').select('*').eq('id', id).single()
    if (data) setVideo(data)
  }

  const fetchRelated = async () => {
    const { data } = await supabase.from('videos').select('*').limit(6).order('id', { ascending: false })
    if (data) setRelated(data.filter(v => v.id != id))
  }

  if (!video) return <div style={{ background: '#000', height: '100vh', color: '#fff', textAlign: 'center', paddingTop: '100px' }}>Loading Video...</div>

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* NAVBAR SIMPLE */}
      <nav style={{ padding: '15px 5%', background: '#000', borderBottom: '1px solid #222' }}>
        <a href="/" style={{ color: '#E50914', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>← KEMBALI</a>
      </nav>

      <div style={{ padding: '20px 5%', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* PLAYER */}
        <div style={{ position: 'relative', paddingTop: '56.25%', background: '#111', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
          <iframe 
            src={video.url} 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} 
            allowFullScreen 
          />
        </div>

        {/* INFO VIDEO */}
        <h1 style={{ fontSize: '1.4rem', marginTop: '20px', marginBottom: '10px' }}>{video.title}</h1>
        <div style={{ height: '1px', background: '#222', marginBottom: '20px' }}></div>

        {/* SLOT IKLAN ADSTERRA (BANNER) */}
        <div style={{ background: '#111', padding: '10px', textAlign: 'center', borderRadius: '8px', marginBottom: '30px' }}>
            <p style={{ fontSize: '0.6rem', color: '#555', margin: '0 0 5px 0' }}>ADVERTISEMENT</p>
            {/* Ganti ID di bawah ini dengan script banner Adsterra kamu */}
            <div id="adsterra-banner">
                <p style={{ color: '#3498db', fontSize: '0.8rem' }}>Iklan akan muncul di sini</p>
            </div>
        </div>

        {/* REKOMENDASI LAINNYA */}
        <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', color: '#E50914' }}>Nonton Lainnya</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px' }}>
          {related.map((v) => (
            <a href={`/watch/${v.id}`} key={v.id} style={{ textDecoration: 'none', color: '#fff' }}>
              <div style={{ position: 'relative', paddingTop: '140%', background: '#222', borderRadius: '5px', overflow: 'hidden' }}>
                <img 
                   src={`https://images.weserv.nl/?url=${encodeURIComponent(v.thumbnail)}`} 
                   referrerPolicy="no-referrer"
                   style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <p style={{ fontSize: '0.7rem', marginTop: '5px', height: '2.4em', overflow: 'hidden' }}>{v.title}</p>
            </a>
          ))}
        </div>

      </div>
    </div>
  )
}
