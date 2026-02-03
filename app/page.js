export default async function Home() {
  return (
    <main className="p-8 bg-black min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8 text-center">Nonton Stream</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Nanti di sini daftar videonya muncul otomatis */}
        <p className="text-gray-400">Belum ada video. Tambahkan lewat Panel Admin!</p>
      </div>
    </main>
  );
}
