"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// 1. KONFIGURASI (Pastikan URL & KEY Benar)
const SB_URL = "https://wakwbmuanzglmawqzopi.supabase.co"
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indha3dibXVhbnpnbG1hd3F6b3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDc5MjYsImV4cCI6MjA4NTY4MzkyNn0.oVcKaJY9-RNu4QSk32fi3h8Lb-mBm4FXFuEfwKFmLZo"
const PASSWORD_ADMIN = "130903" 

const supabase = createClient(SB_URL, SB_KEY)

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [videos, setVideos] = useState([])
  const [judul, setJudul] = useState('')
  const [linkVideo, setLinkVideo] = useState('')
  const [linkPoster, setLinkPoster] = useState('')
  const [loading, setLoading] = useState(false)
  const [useProxy, setUseProxy] = useState(true) // Default true biar aman

  useEffect(() => {
    const pass = prompt("Masukkan Password Admin:");
    if (pass === PASSWORD_ADMIN) { setIsLoggedIn(true); fetchVideos(); } 
    else { alert("Akses Ditolak!"); window.location.href = "/" }
  }, [])

  const fetchVideos = async () => {
    const { data } = await supabase.from('videos').select('*').order('id', { ascending: false })
    if (data) setVideos(data)
  }

  // JURUS ANTI-BLANK: Fungsi untuk bungkus link dengan proxy
  const wrapProxy = (url) => {
    if (!url) return "";
    const cleanUrl = url.replace('https://', '').replace('http://', '');
    return `https://wsrv.nl/?url=${cleanUrl}`;
  }

  // --- FITUR 1: SYNC OTOMATIS (API) ---
  const syncDoodstream = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dood');
      const resData = await res.json();

      if (resData.status === 200) {
        const { data: existing } = await supabase.from('videos').select('url');
        const existingUrls = existing.map(v => v.url);
        
        const newFiles = resData.result.files.filter(f => 
          !existingUrls.includes(`https://doodstream.com/e/${f.file_code}`)
        );

        if (newFiles.length === 0) return alert("Semua video sudah ada di database!");

        const toInsert = newFiles.map(f => ({
          title: f.title,
          url: `https://doodstream.com/e/${f.file_code}`,
          thumbnail: wrapProxy(`https://thumbcdn.com/snaps/${f.file_code}.jpg`)
        }));

        const { error } = await supabase.from('videos').insert(toInsert);
        if (error) throw error;
        alert(`MANTAP! Berhasil sinkron ${newFiles.length} video baru.`);
        fetchVideos();
      } else {
        alert("Gagal API: " + resData.msg);
      }
    } catch (err) {
      alert("Error Sync: Pastikan file /api/dood/route.js sudah dibuat!");
    } finally { setLoading(false); }
  }

  // --- FITUR 2: SIMPAN MANUAL ---
  const handleUploadManual = async (e) => {
    e.preventDefault();
    const finalThumb = useProxy ? wrapProxy(linkPoster) : linkPoster;
    
    const { error } = await supabase.from('videos').insert([
      { title: judul, url: linkVideo, thumbnail: finalThumb }
    ]);
    
    if (error) alert("Gagal Simpan: " + error.message);
    else { alert("Berhasil Simpan!"); setJudul(''); setLinkVideo(''); setLinkPoster(''); fetchVideos(); }
  };

  const handleHapus = async (id) => {
    if (confirm("Hapus video ini?")) { await supabase.from('videos').delete().eq('id', id); fetchVideos(); }
  };

  if (!isLoggedIn) return null;

  return (
    <div style={{ padding: '20px', background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#E50914' }}>🛠 Super Admin v3.0</h1>
      
      {/* SEKSI SYNC API */}
      <div style={{ background: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #3498db', marginBottom: '20px' }}>
        <h3 style={{ marginTop: 0 }}>🚀 Jalur Kilat (API Doodstream)</h3>
        <button onClick={syncDoodstream} disabled={loading} style={{ width: '100%', padding: '15px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
          {loading ? "SEDANG MENYINKRONKAN..." : "SYNC VIDEO TERBARU (AUTO-PROXY)"}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* FORM MANUAL */}
        <div style={{ flex: '1', minWidth: '300px', background: '#111', padding: '20px', borderRadius: '10px' }}>
          <h3>📝 Tambah Manual</h3>
          <input placeholder="Judul Video" value={judul} onChange={e => setJudul(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '5px', border: 'none', boxSizing: 'border-box' }} />
          <input placeholder="Link Embed Video" value={linkVideo} onChange={e => setLinkVideo(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '5px', border: 'none', boxSizing: 'border-box' }} />
          <input placeholder="Link Direct Thumbnail" value={linkPoster} onChange={e => setLinkPoster(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '5px', border: 'none', boxSizing: 'border-box' }} />
          
          <div style={{ marginBottom: '15px' }}>
            <input type="checkbox" id="proxy" checked={useProxy} onChange={e => setUseProxy(e.target.checked)} />
            <label htmlFor="proxy" style={{ marginLeft: '10px', fontSize: '0.8rem', color: '#aaa' }}>Gunakan Image Proxy (Rekomendasi)</label>
          </div>

          <button onClick={handleUploadManual} style={{ width: '100%', padding: '15px', background: '#E50914', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>SIMPAN MANUAL</button>
        </div>

        {/* PREVIEW */}
        <div style={{ flex: '0.5', minWidth: '250px', background: '#111', padding: '20px', borderRadius: '10px', border: '1px dashed #444', textAlign: 'center' }}>
          <h4 style={{ marginTop: 0 }}>LIVE PREVIEW</h4>
          <div style={{ width: '160px', height: '230px', background: '#222', margin: '0 auto', borderRadius: '8px', overflow: 'hidden' }}>
            {linkPoster ? (
              <img 
                src={useProxy ? wrapProxy(linkPoster) : linkPoster} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.src = "https://via.placeholder.com/160x230?text=BLANK" }}
              />
            ) : <div style={{ paddingTop: '100px', fontSize: '0.8rem', color: '#555' }}>No Image</div>}
          </div>
        </div>
      </div>

      <h3 style={{ marginTop: '30px' }}>Koleksi Database ({videos.length}):</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
        {videos.map(v => (
          <div key={v.id} style={{ background: '#111', padding: '10px', borderRadius: '8px' }}>
            <img src={v.thumbnail} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '5px' }} />
            <p style={{ fontSize: '0.7rem', height: '2.5em', overflow: 'hidden', margin: '8px 0' }}>{v.title}</p>
            <button onClick={() => handleHapus(v.id)} style={{ width: '100%', background: '#ff4444', border: 'none', color: '#fff', padding: '5px', borderRadius: '4px', cursor: 'pointer' }}>Hapus</button>
          </div>
        ))}
      </div>
    </div>
  )
}
