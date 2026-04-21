"use client"

import { useState } from "react"

// TypeScript için Props tanımı
interface UrunAramaProps {
  initialData: any[];
  kategoriler: any[];
}

export default function UrunArama({ initialData, kategoriler }: UrunAramaProps) {
  const [seciliKategori, setSeciliKategori] = useState("all")
  const [aramaMetni, setAramaMetni] = useState("")

  // Filtreleme: Hem kategoriye hem de isme göre
  const filtreliUrunler = initialData?.filter((urun: any) => {
    const kategoriMatch = seciliKategori === "all" || urun.kategori_id === seciliKategori
    const isimMatch = urun.ad.toLowerCase().includes(aramaMetni.toLowerCase())
    return kategoriMatch && isimMatch
  }) || []

  return (
    <div className="space-y-6">
      {/* 🔍 ARAMA ÇUBUĞU */}
      <div className="relative max-w-2xl mx-auto mb-10 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-pink-400 group-focus-within:text-pink-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
  id="arama-input"
  type="text"
  placeholder="Model, renk veya stil ara..."
  value={aramaMetni}
  onChange={(e) => setAramaMetni(e.target.value)}
  className="block w-full pl-11 pr-4 py-4 bg-white border border-pink-100 rounded-2xl leading-5 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 shadow-sm transition-all text-sm md:text-base 
  text-zinc-800 placeholder:text-zinc-400" 
/>
      </div>

      {/* 📱 KATEGORİ NAVİGASYONU */}
      <div className="sticky top-[64px] z-40 bg-white/80 backdrop-blur-md py-4 -mx-4 px-4 border-b border-pink-50">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar md:justify-center">
          <button
            onClick={() => setSeciliKategori("all")}
            className={`whitespace-nowrap px-6 py-2 rounded-full text-xs font-bold transition-all border ${
              seciliKategori === "all"
                ? "bg-pink-600 text-white border-pink-600 shadow-lg shadow-pink-100"
                : "bg-white text-zinc-500 border-zinc-200"
            }`}
          >
            HEPSİ
          </button>
          {kategoriler.map((kat: any) => (
            <button
              key={kat.id}
              onClick={() => setSeciliKategori(kat.id)}
              className={`whitespace-nowrap px-6 py-2 rounded-full text-xs font-bold transition-all border ${
                seciliKategori === kat.id
                  ? "bg-pink-600 text-white border-pink-600 shadow-lg shadow-pink-100"
                  : "bg-white text-zinc-500 border-zinc-200"
              }`}
            >
              {kat.ad.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* 🛍️ ÜRÜN LİSTESİ */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8">
        {filtreliUrunler.length > 0 ? (
          filtreliUrunler.map((urun: any) => (
            <div key={urun.id} className="group bg-white rounded-2xl overflow-hidden border border-pink-50 hover:shadow-2xl transition-all duration-500">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img src={urun.gorsel} alt={urun.ad} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-2 left-2">
                   <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[9px] font-black text-pink-600 uppercase">
                    {urun.kategoriler?.ad || "Koleksiyon"}
                  </span>
                </div>
              </div>
              <div className="p-3 md:p-5">
                <h3 className="text-xs md:text-base font-bold text-zinc-900 line-clamp-1">{urun.ad}</h3>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm md:text-lg font-black text-zinc-900">
                    {Number(urun.fiyat).toLocaleString('tr-TR')} ₺
                  </span>
                  <a 
                    href={`https://wa.me/905422301299?text=Merhaba, "${urun.ad}" ürününüz hakkında bilgi alabilir miyim?`}
                    target="_blank"
                    className="bg-green-500 text-white p-2 rounded-lg hover:scale-110 transition-transform shadow-md"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.747-2.874-2.512-2.96-2.626-.087-.115-.708-.941-.708-1.793 0-.852.449-1.271.609-1.444.16-.173.348-.217.464-.217.115 0 .231 0 .333.005.109.004.258-.041.404.311.144.352.493 1.203.536 1.29.043.086.072.187.015.302-.057.115-.086.187-.173.288-.087.101-.183.225-.261.303-.098.098-.196.204-.084.397.112.193.498.821 1.074 1.334.741.661 1.365.867 1.557.962.193.096.307.08.423-.053.115-.133.492-.573.623-.77.131-.197.261-.165.441-.1.18.065 1.141.538 1.338.636.197.098.328.147.376.229.048.082.048.473-.096.878z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-zinc-400 font-medium">
            Aradığınız kriterlere uygun model bulunamadı.
          </div>
        )}
      </div>
    </div>
  )
}