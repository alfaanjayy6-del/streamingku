"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// --- ISI MANUAL (Sama seperti sebelumnya) ---
const SB_URL = "https://wakwbmuanzglmawqzopi.supabase.co"
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indha3dibXVhbnpnbG1hd3F6b3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDc5MjYsImV4cCI6MjA4NTY4MzkyNn0.oVcKaJY9-RNu4QSk32fi3h8Lb-mBm4FXFuEfwKFmLZo"
// ------------------------------------------

const supabase = createClient(SB_URL, SB_KEY)

export default function Admin() {
  const [videos, setVideos] = useState([])

  // 1. Fungsi untuk ambil daftar video
  const fetchVideos = async () => {
    const { data } = await supabase.from('videos').select('*').order('id', { ascending: false })
    if (data) setVideos(data)
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  // 2. Fungsi Upload
  const handleUpload = async (e) => {
    e.preventDefault();
    const judul = e.target.judul.value;
    const link = e.target.link.value;
    let finalUrl = link.includes("watch?v=") ? link.replace("watch?v=", "embed/") : link;

    const { error } = await supabase.from('videos').insert([{ title: judul, url: finalUrl }]);

    if (error) {
      alert("GAGAL UPLOAD: " + error.message);
    } else {
      alert("MANTAP! Berhasil nambah video.");
      e.target.reset();
      fetchVideos(); // Refresh daftar video
    }
  };

  // 3. Fungsi Hapus
  const handleHapus = async (id) => {
    if (confirm("Serius mau hapus video ini?")) {
      const { error } = await supabase.from('videos').delete().eq('id', id);
      
      if (error) {
        alert("GAGAL HAPUS: " + error.message);
      } else {
        alert("Terhapus!");
        fetchVideos(); // Refresh daftar video
      }
    }
  };

  return (
    <div style={{ padding: '40px', background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1>🛠 Panel Admin Streaming</h1>
      
      {/* Form Tambah */}
      <form onSubmit={handleUpload} style={{ display: 'flex', gap: '10px', marginBottom: '40px', background: '#111', padding: '20px', borderRadius: '10px' }}>
        <input name="judul" placeholder="Judul Film" style={{ padding: '10px', flex: 1 }} required />
        <input name="link" placeholder="Link Video" style={{ padding: '10px', flex: 1 }} required />
        <button type="submit" style={{ padding: '10px 20px', background: 'blue', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Upload
        </button>
      </form>

      <hr style={{ border: '0.5px solid #222' }} />

      {/* Daftar Video untuk Dihapus */}
      <h2 style={{ marginTop: '20px' }}>Daftar Video Kamu</h2>
      <div style={{ marginTop: '20px' }}>
        {videos.map((vid) => (
          <div key={vid.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', padding: '15px', borderRadius: '8px', marginBottom: '10px', border: '1px solid #333' }}>
            <div>
              <strong style={{ display: 'block' }}>{vid.title}</strong>
              <small style={{ color: '#666' }}>{vid.url}</small>
            </div>
            <button 
              onClick={() => handleHapus(vid.id)} 
              style={{ background: '#ff4444', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}
            >
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
