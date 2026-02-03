"use client"
export default function Admin() {
  const simpanVideo = async (e) => {
    e.preventDefault();
    const judul = e.target.judul.value;
    const link = e.target.link.value;
    
    // Logika mengubah link biasa ke format embed
    let embedLink = link;
    if(link.includes("youtube.com/watch?v=")) {
        embedLink = link.replace("watch?v=", "embed/");
    }

    alert("Berhasil! Video " + judul + " siap tayang.");
    // Nanti kita hubungkan ke Supabase di sini
  };

  return (
    <div className="p-10 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-5">Panel Admin - Tambah Video</h1>
      <form onSubmit={simpanVideo} className="space-y-4 max-w-lg">
        <input name="judul" placeholder="Judul Film" className="w-full p-2 rounded bg-gray-800 border border-gray-700" required />
        <input name="link" placeholder="Paste Link Video di sini" className="w-full p-2 rounded bg-gray-800 border border-gray-700" required />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded">Upload Sekarang</button>
      </form>
    </div>
  );
}
