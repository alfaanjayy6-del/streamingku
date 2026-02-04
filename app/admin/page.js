"use client"
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const SB_URL = "https://wakwbmuanzglmawqzopi.supabase.co"
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indha3dibXVhbnpnbG1hd3F6b3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDc5MjYsImV4cCI6MjA4NTY4MzkyNn0.oVcKaJY9-RNu4QSk32fi3h8Lb-mBm4FXFuEfwKFmLZo"
const supabase = createClient(SB_URL, SB_KEY)

export default function AdminPage() {
  const [isLogin, setIsLogin] = useState(false)
  const [pass, setPass] = useState('')
  const [apiDood, setApiDood] = useState('')
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)

  // State untuk Form Manual
  const [manualTitle, setManualTitle] = useState('')
  const [manualUrl, setManualUrl] = useState('')
  const [manualThumb, setManualThumb] = useState('')

  useEffect(() => {
    if (isLogin) fetchVideos()
  }, [isLogin])

  const fetchVideos = async () => {
    const { data } = await supabase.from('videos').select('*').order('id', { ascending: false })
    setVideos(data || [])
  }

  const handleLogin = () => {
    if (pass === '130903') setIsLogin(true) 
    else alert('Password Salah!')
  }

  // --- FUNGSI SYNC OTOMATIS ---
  const syncDood = async () => {
    if (!apiDood) return alert('Isi API Key Doodstream dulu!')
    setLoading(true)
    try {
      const res = await fetch(`https://doodapi.com/api/file/list?key=${apiDood}`)
      const json = await res.json()
      if (json.result) {
        const toInsert = json.result.map(f => ({
          title: f.title,
          url: `https://doodstream.com/e/${f.file_code}`,
          thumbnail: `https://thumbcdn.com/snaps/${f.file_code}.jpg`
        }))
        await supabase.from('videos').insert(toInsert)
        alert('Sync Berhasil!')
        fetchVideos()
      }
    } catch (e) { alert('Gagal Sync!') }
    setLoading(false)
  }

  // --- FUNGSI UPLOAD MANUAl ---
  const handleManualUpload = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('videos').insert([{
      title: manualTitle,
      url: manualUrl,
      thumbnail: manualThumb
    }])
    if (!error) {
      alert('Video Manual Berhasil Ditambah!')
      setManualTitle(''); setManualUrl(''); setManualThumb('')
      fetchVideos()
    } else {
      alert('Gagal Upload Manual!')
    }
  }

  const deleteVideo = async (id) => {
    if (confirm('Yakin mau hapus video ini?')) {
      await supabase.from('videos').delete().eq('id', id)
      fetchVideos()
    }
  }

  const editTitle = async (id, oldTitle) => {
    const newTitle = prompt("Edit Judul Video:", oldTitle)
    if (newTitle) {
      await supabase.from('videos').update({ title: newTitle }).eq('id', id)
      fetchVideos()
    }
  }

  if (!isLogin) return (
    <div style={{ background: '#000', height: '100vh', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: '#111', padding: '30px', borderRadius: '10px', textAlign: 'center' }}>
        <h3>ADMIN LOGIN</h3>
        <input type="password" onChange={(e) => setPass(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: 'none', marginBottom: '10px', width: '100%' }} />
        <button onClick={handleLogin} style={{ width: '100%', padding: '10px', background: '#E50914', color: '#fff', border: 'none', borderRadius: '5px' }}>MASUK</button>
      </div>
    </div>
  )

  return (
    <div style={{ padding: '20px', background: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#E50914', textAlign: 'center', marginBottom: '30px' }}>DASHBOARD ADMIN</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        
        {/* BAGIAN SYNC OTOMATIS */}
        <div style={{ background: '#111', padding: '20px', borderRadius: '10px' }}>
          <h4>SINKRONISASI DOODSTREAM</h4>
          <input value={apiDood} onChange={(e) => setApiDood(e.target.value)} placeholder="API Key Doodstream" style={{ padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #333', background: '#000', color: '#fff', marginBottom: '10px', boxSizing: 'border-box' }} />
          <button onClick={syncDood} disabled={loading} style={{ width: '100%', padding: '10px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
            {loading ? 'MEMPROSES...' : 'SYNC DATA TERBARU'}
          </button>
        </div>

        {/* BAGIAN UPLOAD MANUAL */}
        <div style={{ background: '#111', padding: '20px', borderRadius: '10px' }}>
          <h4>UPLOAD MANUAL</h4>
          <form onSubmit={handleManualUpload}>
            <input placeholder="Judul Video" value={manualTitle} onChange={(e)=>setManualTitle(e.target.value)} required style={{ padding: '8px', width: '100%', borderRadius: '5px', border: '1px solid #333', background: '#000', color: '#fff', marginBottom: '10px', boxSizing: 'border-box' }} />
            <input placeholder="URL Embed (Iframe)" value={manualUrl} onChange={(e)=>setManualUrl(e.target.value)} required style={{ padding: '8px', width: '100%', borderRadius: '5px', border: '1px solid #333', background: '#000', color: '#fff', marginBottom: '10px', boxSizing: 'border-box' }} />
            <input placeholder="URL Thumbnail" value={manualThumb} onChange={(e)=>setManualThumb(e.target.value)} required style={{ padding: '8px', width: '100%', borderRadius: '5px', border: '1px solid #333', background: '#000', color: '#fff', marginBottom: '10px', boxSizing: 'border-box' }} />
            <button type="submit" style={{ width: '100%', padding: '10px', background: '#E50914', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>TAMBAHKAN VIDEO</button>
          </form>
        </div>

      </div>

      <p style={{ textAlign: 'center', color: '#888' }}>Total Video di Database: {videos.length}</p>

      {/* DAFTAR VIDEO */}
      <h4 style={{ borderBottom: '1px solid #222', paddingBottom: '10px' }}>DAFTAR VIDEO</h4>
      <div style={{ display: 'grid', gap: '8px' }}>
        {videos.map((v) => (
          <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', padding: '10px 15px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <img src={v.thumbnail} style={{ width: '50px', height: '30px', objectFit: 'cover', borderRadius: '4px' }} onError={(e)=>e.target.src="https://via.placeholder.com/50"} />
                <span style={{ fontSize: '0.85rem' }}>{v.title}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => editTitle(v.id, v.title)} style={{ background: '#0088cc', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}>Edit</button>
              <button onClick={() => deleteVideo(v.id)} style={{ background: '#444', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}>Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
