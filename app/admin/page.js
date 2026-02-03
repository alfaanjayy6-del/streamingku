"use client"
import { createClient } from '@supabase/supabase-js'

// --- ISI MANUAL DI SINI ---
const SB_URL = "https://wakwbmuanzglmawqzopi.supabase.co"
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indha3dibXVhbnpnbG1hd3F6b3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDc5MjYsImV4cCI6MjA4NTY4MzkyNn0.oVcKaJY9-RNu4QSk32fi3h8Lb-mBm4FXFuEfwKFmLZo"
// --------------------------

const supabase = createClient(SB_URL, SB_KEY)

export default function Admin() {
  const handleUpload = async (e) => {
    e.preventDefault();
    const judul = e.target.judul.value;
    const link = e.target.link.value;

    // Fungsi otomatis ubah link YouTube ke Embed
    let finalUrl = link;
    if (link.includes("youtube.com/watch?v=")) {
      finalUrl = link.replace("watch?v=", "embed/");
    }

    // Pakai 'public.videos' biar makin pasti
    const { error } = await supabase
      .from('videos') 
      .insert([{ title: judul, url: finalUrl }]);

    if (error) {
      console.error(error);
      alert("GAGAL: " + error.message);
    } else {
      alert("MANTAP! Video Berhasil Masuk Database.");
      e.target.reset();
    }
  };

  return (
    <div style={{ padding: '40px', background: '#000', color: '#fff', minHeight: '100vh' }}>
      <h1>Panel Admin</h1>
      <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <input name="judul" placeholder="Judul Film" style={{ padding: '10px', color: '#000' }} required />
        <input name="link" placeholder="Link Video/YouTube" style={{ padding: '10px', color: '#000' }} required />
        <button type="submit" style={{ padding: '10px', background: 'blue', color: 'white' }}>Upload Sekarang</button>
      </form>
    </div>
  );
}
