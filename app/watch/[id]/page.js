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
    // Mengambil 10 video terbaru untuk rekomendasi
    const { data } = await supabase.from('videos').select('*').limit(10).order('id', { ascending: false })
    if (data) setRelated(data.filter(v => v.id != id))
  }

  if (!video) return (
    <div style={{ background: '#000', height: '100vh', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <p>Memuat Video...</p>
    </div>
  )

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* NAVBAR SIMPLE */}
      <nav style={{ 
        padding: '15px 5%', 
        background: '#000', 
        borderBottom: '1px solid #222', 
        display: 'flex', 
        alignItems: 'center' 
      }}>
        <a href="/" style={{ color: '#E50914', textDecoration: 'none', fontWeight: 'bold', fontSize: '1rem' }}>
          ← BERANDA
        </a>
      </nav>

      <div style={{ padding: '20px 5%', maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* PLAYER BOX */}
        <div style={{ 
          position: 'relative', 
          paddingTop: '56.25%', // Rasio 16:9
          background: '#111', 
          borderRadius: '12px', 
          overflow: 'hidden', 
          boxShadow: '0 10px 40px rgba(0,0,0,0.9)' 
        }}>
          <iframe 
            src={video.url} 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} 
            allowFullScreen 
          />
        </div>

        {/* INFO VIDEO */}
        <div style={{ marginTop: '20px', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#fff' }}>{video.title}</h1>
          <div style={{ height: '1px', background: '#222', width: '100%' }}></div>
        </div>

        {/* REKOMENDASI LAINNYA */}
        <div style={{ marginTop: '40px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', color: '#E50914', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Mungkin Kamu Suka
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
            gap: '15px' 
          }}>
            {related.map((v) => (
              <a href={`/watch/${v.id}`} key={v.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ 
                  position: 'relative', 
                  paddingTop: '145%', 
                  background: '#1a1a1a', 
                  borderRadius: '8px', 
                  overflow: 'hidden',
                  transition: 'transform 0.2s'
                }}>
                  <img 
                     src={`https://images.weserv.nl/?url=${encodeURIComponent(v.thumbnail)}&w=300`} 
                     referrerPolicy="no-referrer"
                     alt={v.title}
                     style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                <h4 style={{ 
                  fontSize: '0.75rem', 
                  marginTop: '8px', 
                  fontWeight: 'normal', 
                  height: '2.5em', 
                  overflow: 'hidden',
                  lineHeight: '1.2em'
                }}>
                  {v.title}
                </h4>
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* FOOTER SIMPLE */}
      <footer style={{ padding: '40px 5%', textAlign: 'center', color: '#444', fontSize: '0.8rem' }}>
        © 2026 STREAMINGKU - Nonton Gratis Kualitas Tinggi
      </footer>
    </div>
  )
}
