"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const SB_URL = "https://wakwbmuanzglmawqzopi.supabase.co"
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indha3dibXVhbnpnbG1hd3F6b3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDc5MjYsImV4cCI6MjA4NTY4MzkyNn0.oVcKaJY9-RNu4QSk32fi3h8Lb-mBm4FXFuEfwKFmLZo"
const supabase = createClient(SB_URL, SB_KEY)

export default function Admin() {
  const [videos, setVideos] = useState([])

  const fetchVideos = async () => {
    console.log("Sedang mencoba mengambil data...");
    const { data, error } = await supabase.from('videos').select('*');
    
    if (error) {
      console.error("Error dari Supabase:", error.message);
      alert("Error Supabase: " + error.message);
    } else {
      console.log("Data diterima:", data);
      setVideos(data || []);
      if (data.length === 0) {
        console.log("Koneksi OK, tapi tabel 'videos' memang kosong.");
      }
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  const handleUpload = async (e) => {
    e.preventDefault();
    const judul = e.target.judul.value;
    const link = e.target.link.value;
    const { error } = await supabase.from('videos').insert([{ title: judul, url: link }]);
    if (error) alert("Gagal: " + error.message);
    else {
      alert("MANTAP! Berhasil.");
      e.target.reset();
      fetchVideos();
    }
  };

  const handleHapus = async (id) => {
    if (confirm("Hapus video ini?")) {
      await supabase.from('videos').delete().eq('id', id);
      fetchVideos();
    }
  };

  return (
    <div style={{ padding: '20px', background: '#000', color: '#fff', minHeight: '100vh' }}>
      <h2>Panel Admin (Total Debug)</h2>
      <form onSubmit={handleUpload} style={{marginBottom: '20px'}}>
        <input name="judul" placeholder="Judul" style={{marginRight: '10px', color: '#000'}} required />
        <input name="link" placeholder="Link" style={{marginRight: '10px', color: '#000'}} required />
        <button type="submit">Upload</button>
      </form>
      
      <div style={{ borderTop: '1px solid #333', paddingTop: '20px' }}>
        <h3>Daftar Video di Database:</h3>
        {videos.length === 0 && <p>Daftar kosong atau koneksi bermasalah...</p>}
        {videos.map((vid) => (
          <div key={vid.id} style={{ display: 'flex', gap: '20px', marginBottom: '10px', background: '#222', padding: '10px' }}>
            <span>{vid.title}</span>
            <button onClick={() => handleHapus(vid.id)} style={{background: 'red', color: 'white'}}>Hapus</button>
          </div>
        ))}
      </div>
    </div>
  )
}
