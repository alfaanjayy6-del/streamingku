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

  // State Edit Video
  const [editData, setEditData] = useState(null)

  useEffect(() => {
    // Ambil API Key yang tersimpan di browser
    const savedKey = localStorage.getItem('dood_api_key')
    if (savedKey) setApiDood(savedKey)

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

  const syncDood = async () => {
    if (!apiDood) return alert('Isi API Key dulu!')
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

  const deleteVideo = async (id) => {
    if (confirm('Hapus video?')) { await supabase.from('videos').delete().eq('id', id); fetchVideos() }
  }

  const handleUpdateVideo = async () => {
    await supabase.from('videos').update({ title: editData.title, thumbnail: editData.thumbnail, url: editData.url }).eq('id', editData.id)
    setEditData(null); fetchVideos()
  }

  if (!isLogin) return (
    <div style={{ background: '#000', height: '100vh', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: '#111', padding: '30px', borderRadius: '10px', textAlign: 'center', width: '300px' }}>
        <h3 style={{ color: '#E50914', marginBottom: '20px' }}>ADMIN LOGIN</h3>
        <input type="password" placeholder="Password" onChange={(e) => setPass(e.target.value)} style={{ padding: '12px', borderRadius: '5px', border: 'none', marginBottom: '10px', width: '100%', boxSizing: 'border-box' }} />
        <button onClick={handleLogin} style={{ width: '100%', padding: '12px', background: '#E50914', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>MASUK</button>
      </div>
    </div>
  )

  return (
    <div style={{ padding: '20px', background: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#E50914', textAlign: 'center', marginBottom: '30px' }}>ADMIN PANEL</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        
        {/* SYNC DOODSTREAM */}
        <div style={{ background: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #222' }}>
          <h4 style={{ marginTop: 0 }}>SYNC DOODSTREAM</h4>
          <input value={apiDood} onChange={(e) => setApiDood(e.target.value)} placeholder="API Key Doodstream" style={{ width: '100%', padding: '10px', borderRadius: '5px', background: '#000', color: '#fff', border: '1px solid #333', marginBottom: '10px', boxSizing: 'border-box' }} />
          <div style={{ marginBottom: '10px' }}>
            <label style={{ fontSize: '0.8rem', color: '#888' }}>Mau narik berapa video?</label>
            <select value={limit} onChange={(e) => setLimit(parseInt(e.target.value))} style={{ width: '100%', padding: '10px', borderRadius: '5px', background: '#000', color: '#fff', border: '1px solid #333', marginTop: '5px' }}>
                <option value={10}>10 Video Terbaru</option>
                <option value={20}>20 Video Terbaru</option>
                <option value={50}>50 Video Terbaru</option>
                <option value={100}>100 Video Terbaru</option>
            </select>
          </div>
          <button onClick={syncDood} disabled={loading} style={{ width: '100%', padding: '12px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
            {loading ? 'MEMPROSES...' : 'JALANKAN SYNC'}
          </button>
        </div>

        {/* UPLOAD MANUAL */}
        <div style={{ background: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #222' }}>
          <h4 style={{ marginTop: 0 }}>UPLOAD MANUAL</h4>
          <form onSubmit={handleManualUpload}>
            <input placeholder="Judul Film" value={manualTitle} onChange={(e)=>setManualTitle(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '5px', background: '#000', color: '#fff', border: '1px solid #333', marginBottom: '10px', boxSizing: 'border-box' }} />
            <input placeholder="URL Embed Video" value={manualUrl} onChange={(e)=>setManualUrl(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '5px', background: '#000', color: '#fff', border: '1px solid #333', marginBottom: '10px', boxSizing: 'border-box' }} />
            <input placeholder="URL Thumbnail" value={manualThumb} onChange={(e)=>setManualThumb(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '5px', background: '#000', color: '#fff', border: '1px solid #333', marginBottom: '10px', boxSizing: 'border-box' }} />
            <button type="submit" style={{ width: '100%', padding: '12px', background: '#E50914', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>TAMBAHKAN</button>
          </form>
        </div>
      </div>

      {/* DAFTAR VIDEO */}
      <div style={{ background: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #222' }}>
        <h4 style={{ marginTop: 0 }}>DAFTAR VIDEO ({videos.length})</h4>
        <div style={{ display: 'grid', gap: '10px' }}>
          {videos.map((v) => (
            <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000', padding: '12px', borderRadius: '8px', border: '1px solid #222' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={v.thumbnail} style={{ width: '50px', height: '35px', objectFit: 'cover', borderRadius: '4px' }} onError={(e)=>e.target.src="https://via.placeholder.com/50x35"} />
                <span style={{ fontSize: '0.85rem', color: '#ddd' }}>{v.title}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setEditData(v)} style={{ background: '#0088cc', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => deleteVideo(v.id)} style={{ background: '#333', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>Hapus</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL EDIT */}
      {editData && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#111', padding: '25px', borderRadius: '12px', width: '100%', maxWidth: '400px', border: '1px solid #333' }}>
            <h4 style={{ marginTop: 0, color: '#E50914' }}>EDIT VIDEO</h4>
            <input value={editData.title} onChange={(e) => setEditData({...editData, title: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#000', color: '#fff', border: '1px solid #333', borderRadius: '5px' }} />
            <input value={editData.thumbnail} onChange={(e) => setEditData({...editData, thumbnail: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#000', color: '#fff', border: '1px solid #333', borderRadius: '5px' }} />
            <input value={editData.url} onChange={(e) => setEditData({...editData, url: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '20px', background: '#000', color: '#fff', border: '1px solid #333', borderRadius: '5px' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleUpdateVideo} style={{ flex: 1, padding: '12px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>SIMPAN</button>
              <button onClick={() => setEditData(null)} style={{ flex: 1, padding: '12px', background: '#444', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>BATAL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
