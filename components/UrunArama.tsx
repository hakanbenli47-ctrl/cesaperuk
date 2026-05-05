"use client"

import { useState } from "react"

interface UrunAramaProps {
  initialData: any[];
  kategoriler: any[];
}

export default function UrunArama({ initialData, kategoriler }: UrunAramaProps) {
  const [seciliKategori, setSeciliKategori] = useState("all")
  const [aramaMetni, setAramaMetni] = useState("")
  const [gorselIndexleri, setGorselIndexleri] = useState<{ [key: string]: number }>({})

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

  const filtreliUrunler = initialData?.filter((urun: any) => {
    const kategoriMatch = seciliKategori === "all" || urun.kategori_id === seciliKategori
    const isimMatch = urun.ad.toLowerCase().includes(aramaMetni.toLowerCase())
    return kategoriMatch && isimMatch
  }) || []

  return (
    <div className="space-y-6">

      {/* 🔍 ARAMA */}
     <div className="relative max-w-2xl mx-auto mb-10 group">
  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
    <svg className="h-5 w-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  </div>
  <input
    type="text"
    placeholder="Model, renk veya stil ara..."
    value={aramaMetni}
    onChange={(e) => setAramaMetni(e.target.value)}
    className="block w-full pl-11 pr-4 py-4 bg-white border border-pink-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm md:text-base placeholder:text-gray-500"
  />
</div>

      {/* 📱 KATEGORİ */}
      <div className="sticky top-[64px] z-40 bg-white/80 backdrop-blur-md py-4 -mx-4 px-4 border-b border-pink-50">
        <div className="flex gap-2 overflow-x-auto pb-2 md:justify-center">
          <button
            onClick={() => setSeciliKategori("all")}
            className={`px-6 py-2 rounded-full text-xs font-bold ${
              seciliKategori === "all"
                ? "bg-pink-600 text-white"
                : "bg-white text-zinc-500 border"
            }`}
          >
            HEPSİ
          </button>

          {kategoriler.map((kat: any) => (
            <button
              key={kat.id}
              onClick={() => setSeciliKategori(kat.id)}
              className={`px-6 py-2 rounded-full text-xs font-bold ${
                seciliKategori === kat.id
                  ? "bg-pink-600 text-white"
                  : "bg-white text-zinc-500 border"
              }`}
            >
              {kat.ad}
            </button>
          ))}
        </div>
      </div>

      {/* 🛍️ ÜRÜNLER */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8">
        {filtreliUrunler.length > 0 ? (
          filtreliUrunler.map((urun: any) => {
            const gorselListesi =
              urun.gorseller && urun.gorseller.length > 0
                ? urun.gorseller
                : [urun.gorsel]

            const aktifIndex = gorselIndexleri[urun.id] || 0
            const aktifGorsel = gorselListesi[aktifIndex] || urun.gorsel

            return (
              <div
                key={urun.id}
                className="bg-white rounded-2xl overflow-hidden border hover:shadow-xl transition flex flex-col"
              >

                {/* GÖRSEL */}
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img
                    src={aktifGorsel}
                    alt={urun.ad}
                    className="w-full h-full object-cover"
                  />

                  {gorselListesi.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => oncekiGorsel(urun.id, gorselListesi.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/45 text-white text-xl flex items-center justify-center"
                      >
                        ‹
                      </button>

                      <button
                        type="button"
                        onClick={() => sonrakiGorsel(urun.id, gorselListesi.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/45 text-white text-xl flex items-center justify-center"
                      >
                        ›
                      </button>

                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full">
                        {aktifIndex + 1}/{gorselListesi.length}
                      </div>
                    </>
                  )}
                </div>

                {/* İÇERİK */}
                <div className="p-3 md:p-5 flex flex-col">

                  {/* ÜRÜN ADI */}
                  <h3 className="text-xs md:text-base font-bold text-zinc-900 break-words">
                    {urun.ad}
                  </h3>

                  {/* ✅ AÇIKLAMA (SERBEST) */}
                  <p className="text-[11px] md:text-sm text-zinc-500 mt-1 leading-relaxed break-words">
                    {urun.aciklama || ""}
                  </p>

                  {/* FİYAT + BUTON */}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm md:text-lg font-black text-zinc-900">
                      {Number(urun.fiyat).toLocaleString("tr-TR")} ₺
                    </span>

                    <a
                      href={`https://wa.me/905422301299?text=Merhaba, "${urun.ad}" ürününüz hakkında bilgi alabilir miyim?`}
                      target="_blank"
                      className="bg-green-500 text-white p-2 rounded-lg"
                    >
                      WhatsApp
                    </a>
                  </div>

                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-full text-center py-20 text-zinc-400">
            Ürün bulunamadı
          </div>
        )}
      </div>

    </div>
  )
}