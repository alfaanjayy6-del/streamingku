"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const SB_URL = "https://wakwbmuanzglmawqzopi.supabase.co"
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indha3dibXVhbnpnbG1hd3F6b3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDc5MjYsImV4cCI6MjA4NTY4MzkyNn0.oVcKaJY9-RNu4QSk32fi3h8Lb-mBm4FXFuEfwKFmLZo"
const PASSWORD_ADMIN = "130903" 
const DOOD_API_KEY = "109446t4h65dr9m44eajs8" // <-- Ganti ini!

const supabase = createClient(SB_URL, SB_KEY)

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [videos, setVideos] = useState([])
  const [judul, setJudul] = useState('')
  const [linkVideo, setLinkVideo] = useState('')
  const [linkPoster, setLinkPoster] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const pass = prompt("Masukkan Password Admin:")
    if (pass === PASSWORD_ADMIN) {
      setIsLoggedIn(true)
      fetchVideos()
    } else {
      alert("Akses Ditolak!");
      window.location.href = "/"
    }
  }, [])

  const fetchVideos = async () => {
    const { data } = await supabase.from('videos').select('*').order('id', { ascending: false })
    if (data) setVideos(data)
  }

  // --- FITUR 1: PROSES MANUAL (MYVIDPLAY/TWITTER/DLL) ---
  const prosesLinkManual = () => {
    const inputLink = linkVideo.trim();
    const bagian = inputLink.split('/');
    const idVideo = bagian[bagian.length - 1];
    if (idVideo) {
      setLinkVideo(`https://myvidplay.com/e/${idVideo}`); 
      setLinkPoster(`https://thumbcdn.com/snaps/${idVideo}.jpg`); 
      alert("Link Manual Berhasil Dirakit!");
    }
  }

  const handleUploadManual = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('videos').insert([{ title: judul, url: linkVideo, thumbnail: linkPoster }]);
    if (error) alert(error.message);
    else { alert("Berhasil Simpan Manual!"); setJudul(''); setLinkVideo(''); setLinkPoster(''); fetchVideos(); }
  };

  // --- FITUR 2: TARIK OTOMATIS DARI DOODSTREAM ---
  const tarikVideoDood = async () => {
    setLoading(true);
    try {
      // Ambil daftar file terbaru dari Doodstream API
      const response = await fetch(`https://doodapi.com/api/file/list?key=${DOOD_API_KEY}`);
      const resData = await response.json();

      if (resData.status === 200) {
        const files = resData.result.files;
        
        // Siapkan data untuk dimasukkan ke Supabase
        const dataToInsert = files.map(file => ({
          title: file.title,
          url: `https://doodstream.com/e/${file.file_code}`,
          thumbnail: `https://thumbcdn.com/snaps/${file.file_code}.jpg`
        }));

        // Simpan masal ke Supabase (Supabase otomatis abaikan yang duplikat jika id unik, 
        // tapi di sini kita simpan saja langsung)
        const { error } = await supabase.from('videos').insert(dataToInsert);

        if (error) throw error;
        alert(`MANTAP! ${files.length} Video terbaru berhasil ditarik.`);
        fetchVideos();
      } else {
        alert("Gagal ambil data: " + resData.msg);
      }
    } catch (err) {
      alert("Error API: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleHapus = async (id) => {
    if (confirm("Hapus video ini?")) {
      await supabase.from('videos').delete().eq('id', id);
      fetchVideos();
    }
  };

  if (!isLoggedIn) return <div style={{background: '#000', minHeight: '100vh'}}></div>

  return (
    <div style={{ padding: '30px', background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#E50914' }}>🛠 Super Admin Panel</h1>
      
      {/* SEKSI OTOMATIS */}
      <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '2px solid #2ecc71' }}>
        <h3 style={{ marginTop: 0 }}>🚀 Jalur Kilat (Doodstream API)</h3>
        <p style={{ fontSize: '0.8rem', color: '#ccc' }}>Klik tombol di bawah untuk menarik semua video terbaru dari akun Doodstream kamu secara otomatis.</p>
        <button 
          onClick={tarikVideoDood} 
          disabled={loading}
          style={{ padding: '12px 20px', background: '#2ecc71', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}
        >
          {loading ? "LAGI NARIK DATA..." : "TARIK SEMUA VIDEO TERBARU"}
        </button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px', color: '#555' }}>--- ATAU ---</div>

      {/* SEKSI MANUAL */}
      <div style={{ background: '#111', padding: '20px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #333' }}>
        <h3 style={{ marginTop: 0 }}>📝 Jalur Manual</h3>
        <input placeholder="Judul Video" value={judul} onChange={(e) => setJudul(e.target.value)} style={{ padding: '10px', width: '100%', marginBottom: '10px' }} />
        <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
          <input placeholder="Link Video (Dood/Videy/Twitter)" value={linkVideo} onChange={(e) => setLinkVideo(e.target.value)} style={{ padding: '10px', flex: 1 }} />
          <button onClick={prosesLinkManual} style={{ padding: '10px', background: '#444', color: '#fff' }}>PROSES</button>
        </div>
        <input placeholder="Link Thumbnail" value={linkPoster} onChange={(e) => setLinkPoster(e.target.value)} style={{ padding: '10px', width: '100%', marginBottom: '15px' }} />
        <button onClick={handleUploadManual} style={{ padding: '12px', background: '#E50914', color: '#fff', border: 'none', borderRadius: '5px', width: '100%', fontWeight: 'bold' }}>SIMPAN MANUAL</button>
      </div>

      {/* LIST VIDEO */}
      <h3>Koleksi di Database ({videos.length}):</h3>
      {videos.map((vid) => (
        <div key={vid.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', padding: '10px', borderRadius: '8px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={vid.thumbnail} style={{ width: '40px', height: '30px', objectFit: 'cover' }} />
            <span style={{ fontSize: '0.9rem' }}>{vid.title}</span>
          </div>
          <button onClick={() => handleHapus(vid.id)} style={{ background: '#ff4444', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '5px' }}>Hapus</button>
        </div>
      ))}
    </div>
  );
}
