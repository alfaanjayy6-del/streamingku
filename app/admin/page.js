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
  const [limit, setLimit] = useState(10)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)

  // State Form Manual
  const [manualTitle, setManualTitle] = useState('')
  const [manualUrl, setManualUrl] = useState('')
  const [manualThumb, setManualThumb] = useState('')

  // State Pengumuman & Edit
  const [announcement, setAnnouncement] = useState('')
  const [editData, setEditData] = useState(null)

  useEffect(() => {
    // Ambil API Key yang tersimpan di browser
    const savedKey = localStorage.getItem('dood_api_key')
    if (savedKey) setApiDood(savedKey)

    if (isLogin) {
      fetchVideos()
      fetchSettings()
    }
  }, [isLogin])

  const fetchVideos = async () => {
    const { data } = await supabase.from('videos').select('*').order('id', { ascending: false })
    setVideos(data || [])
  }

  const fetchSettings = async () => {
    const { data } = await supabase.from('settings').select('announcement').eq('id', 1).single()
    if (data) setAnnouncement(data.announcement)
  }

  const handleLogin = () => {
    if (pass === '130903') setIsLogin(true) 
    else alert('Password Salah!')
  }

  const syncDood = async () => {
    if (!apiDood) return alert('Isi API Key dulu!')
    // Simpan API Key ke browser agar tidak hilang saat refresh
    localStorage.setItem('dood_api_key', apiDood)
    
    setLoading(true)
    try {
      const res = await fetch(`https://doodapi.com/api/file/list?key=${apiDood}`)
      const json = await res.json()
      if (json.result) {
        const limitedFiles = json.result.slice(0, limit)
        const toInsert = limitedFiles.map(f => ({
          title: f.title,
          url: `https://doodstream.com/e/${f.file_code}`,
          thumbnail: `https://thumbcdn.com/snaps/${f.file_code}.jpg`
        }))
        await supabase.from('videos').insert(toInsert)
        alert(`Berhasil narik ${limitedFiles.length} video!`); fetchVideos()
      }
    } catch (e) { alert('Gagal Sync!') }
    setLoading(false)
  }

  const handleManualUpload = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('videos').insert([{ title: manualTitle, url: manualUrl, thumbnail: manualThumb }])
    if (!error) { alert('Upload Manual Berhasil!'); setManualTitle(''); setManualUrl(''); setManualThumb(''); fetchVideos() }
  }

  const handleUpdateAnnouncement = async () => {
    await supabase.from('settings').update({ announcement }).eq('id', 1)
    alert('Pengumuman diupdate!')
  }

  const deleteVideo = async (id) => {
    if (confirm('Hapus video?')) { await supabase.from('videos').delete().eq('id', id); fetchVideos() }
  }

  if (!isLogin) return (
    <div style={{ background: '#000', height: '100vh', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: '#111', padding: '30px', borderRadius: '10px', textAlign: 'center' }}>
        <h3 style={{ color: '#E50914' }}>ADMIN LOGIN</h3>
        <input type="password" onChange={(e) => setPass(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: 'none', marginBottom: '10px', width: '100%' }} />
        <button onClick={handleLogin} style={{ width: '100%', padding: '10px', background: '#E50914', color: '#fff', border: 'none', borderRadius: '5px' }}>MASUK</button>
      </div>
    </div>
  )

  return (
    <div style={{ padding: '20px', background: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      
      {/* 1. PENGUMUMAN */}
      <div style={{ background: '#111', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #E50914' }}>
        <h4 style={{marginTop:0}}>GANTI PENGUMUMAN</h4>
        <input value={announcement} onChange={(e) => setAnnouncement(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '5px', background: '#000', color: '#fff', border: '1px solid #333', marginBottom: '10px', boxSizing: 'border-box' }} />
        <button onClick={handleUpdateAnnouncement} style={{ width: '100%', padding: '10px', background: '#0088cc', color: '#fff', border: 'none', borderRadius: '5px' }}>UPDATE PESAN</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        
        {/* 2. SYNC OTOMATIS */}
        <div style={{ background: '#111', padding: '20px', borderRadius: '10px' }}>
          <h4>SYNC DOODSTREAM</h4>
          <input value={apiDood} onChange={(e) => setApiDood(e.target.value)} placeholder="API Key (Otomatis Tersimpan)" style={{ width: '100%', padding: '10px', borderRadius: '5px', background: '#000', color: '#fff', border: '1px solid #333', marginBottom: '10px', boxSizing: 'border-box' }} />
          <select value={limit} onChange={(e) => setLimit(parseInt(e.target.value))} style={{ width: '100%', padding: '10px', borderRadius: '5px', background: '#000', color: '#fff', border: '1px solid #333', marginBottom: '10px' }}>
            <option value={10}>Tarik 10 Video</option>
            <option value={50}>Tarik 50 Video</option>
            <option value={100}>Tarik 100 Video</option>
          </select>
          <button onClick={syncDood} disabled={loading} style={{ width: '100%', padding: '12px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
            {loading ? 'SINKRONISASI...' : 'JALANKAN SYNC'}
          </button>
        </div>

        {/* 3. UPLOAD MANUAL */}
        <div style={{ background: '#111', padding: '20px', borderRadius: '10px' }}>
          <h4>UPLOAD MANUAL</h4>
          <form onSubmit={handleManualUpload}>
            <input placeholder="Judul" value={manualTitle} onChange={(e)=>setManualTitle(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '5px', background: '#000', color: '#fff', border: '1px solid #333', marginBottom: '8px', boxSizing:'border-box' }} />
            <input placeholder="URL Embed" value={manualUrl} onChange={(e)=>setManualUrl(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '5px', background: '#000', color: '#fff', border: '1px solid #333', marginBottom: '8px', boxSizing:'border-box' }} />
            <input placeholder="URL Thumb" value={manualThumb} onChange={(e)=>setManualThumb(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '5px', background: '#000', color: '#fff', border: '1px solid #333', marginBottom: '8px', boxSizing:'border-box' }} />
            <button type="submit" style={{ width: '100%', padding: '10px', background: '#E50914', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>TAMBAHKAN VIDEO</button>
          </form>
        </div>
      </div>

      {/* 4. DAFTAR VIDEO */}
      <div style={{ background: '#111', padding: '20px', borderRadius: '10px' }}>
        <h4>DAFTAR VIDEO ({videos.length})</h4>
        <div style={{ display: 'grid', gap: '8px' }}>
          {videos.map((v) => (
            <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000', padding: '10px', borderRadius: '5px' }}>
              <span style={{ fontSize: '0.8rem' }}>{v.title}</span>
              <button onClick={() => deleteVideo(v.id)} style={{ background: '#444', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px' }}>Hapus</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
