"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Kategori = {
  id: string
  ad: string
}

type Urun = {
  id: string
  ad: string
  fiyat: number
  gorsel: string
  gorseller?: string[]
  kategori_id: string
  aciklama?: string
}

type Kampanya = {
  id: string
  metin: string
  aktif: boolean
  created_at?: string
}

export default function AdminPage() {
  const [kontrol, setKontrol] = useState(false)
  const router = useRouter()
  const [tab, setTab] = useState<"kategori" | "urun" | "kampanya">("urun")

  const [kategori, setKategori] = useState("")
  const [katLoading, setKatLoading] = useState(false)
  const [kategoriler, setKategoriler] = useState<Kategori[]>([])

  const [urunAdi, setUrunAdi] = useState("")
  const [fiyat, setFiyat] = useState("")
  const [aciklama, setAciklama] = useState("")
  const [kategoriId, setKategoriId] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [urunler, setUrunler] = useState<Urun[]>([])
  const [gorselIndexleri, setGorselIndexleri] = useState<{ [key: string]: number }>({})

  const [kampanyaMetni, setKampanyaMetni] = useState("")
  const [kampanyaLoading, setKampanyaLoading] = useState(false)
  const [kampanyalar, setKampanyalar] = useState<Kampanya[]>([])

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        router.push("/login")
      } else {
        setKontrol(true)
        verileriGetir()
      }
    }

    check()
  }, [router])

  const verileriGetir = async () => {
    const { data: kData } = await supabase.from("kategoriler").select("*")

    const { data: uData } = await supabase
      .from("urunler")
      .select("*")
      .order("created_at", { ascending: false })

    const { data: kampanyaData } = await supabase
      .from("kampanyalar")
      .select("*")
      .order("created_at", { ascending: false })

    setKategoriler(kData || [])
    setUrunler(uData || [])
    setKampanyalar(kampanyaData || [])
  }

  const kategoriEkle = async () => {
    if (!kategori) return alert("Kategori adı boş olamaz")

    setKatLoading(true)

    const { error } = await supabase
      .from("kategoriler")
      .insert([{ ad: kategori }])

    setKatLoading(false)

    if (error) {
      alert(error.message)
    } else {
      setKategori("")
      verileriGetir()
    }
  }

  const gorselYukle = async () => {
    if (files.length === 0) return null

    const yuklenenGorseller: string[] = []

    for (const file of files) {
      const temizIsim = file.name
        .replace(/\s+/g, "-")
        .replace(/[^\w.-]/g, "")

      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}-${temizIsim}`

      const { error } = await supabase.storage
        .from("urun-gorselleri")
        .upload(fileName, file)

      if (error) {
        alert("Görsel yükleme hatası: " + error.message)
        return null
      }

      const { data } = supabase.storage
        .from("urun-gorselleri")
        .getPublicUrl(fileName)

      yuklenenGorseller.push(data.publicUrl)
    }

    return yuklenenGorseller
  }

  const kampanyaKaydet = async () => {
    if (!kampanyaMetni) return alert("Kampanya metni boş olamaz")

    setKampanyaLoading(true)

    await supabase
      .from("kampanyalar")
      .update({ aktif: false })
      .eq("aktif", true)

    const { error } = await supabase.from("kampanyalar").insert([
      {
        metin: kampanyaMetni,
        aktif: true,
      },
    ])

    setKampanyaLoading(false)

    if (error) {
      alert(error.message)
    } else {
      alert("Kampanya yayına alındı")
      setKampanyaMetni("")
      verileriGetir()
    }
  }

  const kampanyaSil = async (id: string) => {
    const onay = confirm("Bu kampanyayı kalıcı olarak silmek istediğinize emin misiniz?")
    if (!onay) return

    const { error } = await supabase
      .from("kampanyalar")
      .delete()
      .eq("id", id)

    if (error) {
      alert(error.message)
    } else {
      setKampanyalar(kampanyalar.filter((k) => k.id !== id))
    }
  }

  const urunEkle = async () => {
    if (!urunAdi || !fiyat || !kategoriId || files.length === 0 || !aciklama) {
      return alert("Eksik alan var")
    }

    setLoading(true)

    const gorselUrlListesi = await gorselYukle()

    if (!gorselUrlListesi) {
      setLoading(false)
      return
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error } = await supabase.from("urunler").insert([
      {
        ad: urunAdi,
        fiyat: Number(fiyat),
        gorsel: gorselUrlListesi[0],
        gorseller: gorselUrlListesi,
        kategori_id: kategoriId,
        user_id: user?.id,
        aciklama: aciklama,
      },
    ])

    setLoading(false)

    if (error) {
      alert(error.message)
    } else {
      alert("Ürün başarıyla eklendi")
      setUrunAdi("")
      setFiyat("")
      setAciklama("")
      setKategoriId("")
      setFiles([])
      verileriGetir()
    }
  }

  const urunSil = async (id: string, gorselUrl: string, gorseller?: string[]) => {
    const onay = confirm("Bu ürünü silmek istediğinize emin misiniz?")
    if (!onay) return

    const silinecekGorseller =
      gorseller && gorseller.length > 0 ? gorseller : [gorselUrl]

    const fileNames = silinecekGorseller
      .map((url) => url.split("/").pop())
      .filter(Boolean) as string[]

    if (fileNames.length > 0) {
      await supabase.storage.from("urun-gorselleri").remove(fileNames)
    }

    const { error } = await supabase.from("urunler").delete().eq("id", id)

    if (error) {
      alert(error.message)
    } else {
      setUrunler(urunler.filter((u) => u.id !== id))
    }
  }

  const oncekiGorsel = (urunId: string, toplam: number) => {
    setGorselIndexleri((prev) => ({
      ...prev,
      [urunId]: ((prev[urunId] || 0) - 1 + toplam) % toplam,
    }))
  }

  const sonrakiGorsel = (urunId: string, toplam: number) => {
    setGorselIndexleri((prev) => ({
      ...prev,
      [urunId]: ((prev[urunId] || 0) + 1) % toplam,
    }))
  }

  if (!kontrol) return null

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-8 md:py-12">
      <div className="max-w-md mx-auto space-y-10">
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 border border-white">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tighter text-zinc-900 uppercase">
              Admin<span className="text-pink-600">Panel</span>
            </h1>
            <p className="text-zinc-400 text-xs font-bold tracking-widest mt-1 uppercase">
              Naturel Peruk Yönetim
            </p>
          </div>

          <div className="flex bg-zinc-100/80 backdrop-blur-md rounded-2xl p-1.5 mb-8 border border-zinc-200/50">
            <button
              onClick={() => setTab("kategori")}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                tab === "kategori"
                  ? "bg-white text-pink-600 shadow-sm ring-1 ring-zinc-200"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              Kategori
            </button>

            <button
              onClick={() => setTab("urun")}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                tab === "urun"
                  ? "bg-white text-blue-600 shadow-sm ring-1 ring-zinc-200"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              Ürün Ekle
            </button>

            <button
              onClick={() => setTab("kampanya")}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                tab === "kampanya"
                  ? "bg-white text-green-600 shadow-sm ring-1 ring-zinc-200"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              Kampanya
            </button>
          </div>

          {tab === "kategori" ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase ml-2 tracking-widest">
                  Kategori İsmi
                </label>

                <input
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  placeholder="Örn: Medikal Peruk"
                  className="w-full px-5 py-4 bg-zinc-50 border-2 border-zinc-100 rounded-2xl outline-none focus:border-pink-500/50 focus:bg-white focus:ring-4 focus:ring-pink-500/5 transition-all text-zinc-800 font-bold placeholder:text-zinc-300"
                />
              </div>

              <button
                onClick={kategoriEkle}
                disabled={katLoading}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-pink-200 transition-all active:scale-95 disabled:opacity-50"
              >
                {katLoading ? "İşleniyor..." : "Sisteme Tanımla"}
              </button>
            </div>
          ) : tab === "kampanya" ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase ml-2 tracking-widest">
                  Kampanya Yazısı
                </label>

                <textarea
                  value={kampanyaMetni}
                  onChange={(e) => setKampanyaMetni(e.target.value)}
                  placeholder="Örn: Yeni sezon ürünlerde ücretsiz danışmanlık fırsatı"
                  className="w-full px-5 py-4 bg-zinc-50 border-2 border-zinc-100 rounded-2xl outline-none focus:border-green-500/50 focus:bg-white focus:ring-4 focus:ring-green-500/5 transition-all text-zinc-800 font-bold resize-none min-h-32"
                />
              </div>

              <button
                onClick={kampanyaKaydet}
                disabled={kampanyaLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-50"
              >
                {kampanyaLoading ? "Yayınlanıyor..." : "Kampanyayı Yayına Al"}
              </button>

              <div className="space-y-3 pt-4 border-t border-zinc-100">
                <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">
                  Kampanyalar ({kampanyalar.length})
                </h3>

                {kampanyalar.length === 0 ? (
                  <div className="bg-zinc-50 border border-dashed border-zinc-200 rounded-2xl p-5 text-center">
                    <p className="text-xs font-bold text-zinc-400">
                      Henüz kampanya bulunmuyor
                    </p>
                  </div>
                ) : (
                  kampanyalar.map((k) => (
                    <div
                      key={k.id}
                      className="bg-white border border-zinc-100 rounded-2xl p-4 shadow-sm flex items-start justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`text-[10px] font-black px-2 py-1 rounded-full ${
                              k.aktif
                                ? "bg-green-100 text-green-700"
                                : "bg-zinc-100 text-zinc-500"
                            }`}
                          >
                            {k.aktif ? "AKTİF" : "PASİF"}
                          </span>
                        </div>

                        <p className="text-sm font-bold text-zinc-800 break-words leading-relaxed">
                          {k.metin}
                        </p>
                      </div>

                      <button
                        onClick={() => kampanyaSil(k.id)}
                        className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-90 shrink-0"
                      >
                        Sil
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-400 uppercase ml-2 tracking-widest">
                  Ürün Bilgileri
                </label>

                <input
                  value={urunAdi}
                  onChange={(e) => setUrunAdi(e.target.value)}
                  placeholder="Model Adı"
                  className="w-full px-5 py-4 bg-zinc-50 border-2 border-zinc-100 rounded-2xl outline-none focus:border-blue-500/50 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-zinc-800 font-bold"
                />

                <textarea
                  value={aciklama}
                  onChange={(e) => setAciklama(e.target.value)}
                  placeholder="Ürün açıklaması"
                  className="w-full px-5 py-4 bg-zinc-50 border-2 border-zinc-100 rounded-2xl outline-none focus:border-blue-500/50 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-zinc-800 font-bold resize-none"
                />
              </div>

              <input
                type="number"
                value={fiyat}
                onChange={(e) => setFiyat(e.target.value)}
                placeholder="Satış Fiyatı (₺)"
                className="w-full px-5 py-4 bg-zinc-50 border-2 border-zinc-100 rounded-2xl outline-none focus:border-blue-500/50 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-zinc-800 font-bold"
              />

              <select
                value={kategoriId}
                onChange={(e) => setKategoriId(e.target.value)}
                className="w-full px-5 py-4 bg-zinc-50 border-2 border-zinc-100 rounded-2xl outline-none focus:border-blue-500/50 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-zinc-800 font-bold appearance-none"
              >
                <option value="">Kategori Seçin</option>
                {kategoriler.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.ad}
                  </option>
                ))}
              </select>

              <label className="group relative flex flex-col items-center justify-center w-full min-h-40 border-2 border-dashed border-zinc-200 rounded-3xl cursor-pointer hover:border-blue-500/50 hover:bg-blue-50/30 transition-all overflow-hidden p-4">
                {files.length > 0 ? (
                  <div className="grid grid-cols-5 gap-2 w-full">
                    {files.map((f, index) => (
                      <div
                        key={index}
                        className="relative h-20 rounded-2xl overflow-hidden bg-zinc-100"
                      >
                        <img
                          src={URL.createObjectURL(f)}
                          className="w-full h-full object-cover"
                          alt={`Yeni ürün görseli ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="bg-blue-100 text-blue-600 p-3 rounded-full mb-2 mx-auto w-fit group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </div>

                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">
                      En fazla 5 fotoğraf yükle
                    </span>
                  </div>
                )}

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const secilenDosyalar = Array.from(e.target.files || []).slice(0, 5)
                    setFiles(secilenDosyalar)
                  }}
                />
              </label>

              <button
                onClick={urunEkle}
                disabled={loading}
                className="w-full bg-zinc-900 hover:bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-zinc-200 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "Yükleniyor..." : "Koleksiyona Ekle"}
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-sm font-black text-zinc-900 uppercase tracking-[0.2em]">
              Katalog ({urunler.length})
            </h2>
            <div className="h-[1px] flex-1 bg-zinc-200 ml-4"></div>
          </div>

          <div className="grid gap-3">
            {urunler.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-zinc-100">
                <p className="text-zinc-300 font-bold text-sm uppercase tracking-tighter">
                  Henüz ürün bulunmuyor
                </p>
              </div>
            ) : (
              urunler.map((u) => {
                const gorselListesi =
                  u.gorseller && u.gorseller.length > 0 ? u.gorseller : [u.gorsel]

                const aktifIndex = gorselIndexleri[u.id] || 0
                const aktifGorsel = gorselListesi[aktifIndex] || u.gorsel

                return (
                  <div
                    key={u.id}
                    className="group bg-white p-3 rounded-[1.5rem] border border-zinc-100 shadow-sm flex gap-4 hover:shadow-md transition-all"
                  >
                    <div className="relative w-16 h-16 shrink-0 rounded-2xl overflow-hidden shadow-inner bg-zinc-50">
                      <img
                        src={aktifGorsel}
                        className="w-full h-full object-cover"
                        alt={u.ad}
                      />

                      {gorselListesi.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={() => oncekiGorsel(u.id, gorselListesi.length)}
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-8 bg-black/45 text-white text-lg leading-none flex items-center justify-center"
                          >
                            ‹
                          </button>

                          <button
                            type="button"
                            onClick={() => sonrakiGorsel(u.id, gorselListesi.length)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-8 bg-black/45 text-white text-lg leading-none flex items-center justify-center"
                          >
                            ›
                          </button>

                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[8px] px-1.5 py-0.5 rounded-full">
                            {aktifIndex + 1}/{gorselListesi.length}
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col">
                      <h4 className="font-black text-zinc-800 text-sm leading-tight uppercase tracking-tight break-words">
                        {u.ad}
                      </h4>

                      <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed break-words">
                        {u.aciklama || ""}
                      </p>

                      <p className="text-blue-600 font-black text-xs mt-auto pt-2">
                        {u.fiyat.toLocaleString("tr-TR")} ₺
                      </p>
                    </div>

                    <button
                      onClick={() => urunSil(u.id, u.gorsel, u.gorseller)}
                      className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-90 shrink-0 self-start"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}