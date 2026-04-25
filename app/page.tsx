export const dynamic = "force-dynamic"

import { supabase } from "@/lib/supabase"
import UrunArama from "@/components/UrunArama"

async function verileriGetir() {
  const [urunlerRes, kategorilerRes] = await Promise.all([
    supabase
      .from("urunler")
      .select("*, kategoriler(ad)")
      .order("created_at", { ascending: false }),
    supabase.from("kategoriler").select("*")
  ])

  return { 
    urunler: urunlerRes.data || [], 
    kategoriler: kategorilerRes.data || [] 
  }
}

export default async function Home() {
  const { urunler, kategoriler } = await verileriGetir()

  return (
    <main className="min-h-screen bg-white">
      {/* 🔴 HEADER */}
      <header className="bg-white/95 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center gap-4">
          <h1 className="font-black text-xl tracking-tighter text-pink-600 shrink-0">
            NATUREL<span className="text-zinc-400 font-light">PERUK</span>
          </h1>

          <div className="flex-1 max-w-sm hidden sm:block">
            <a href="#modeller" className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-50 border border-zinc-100 text-zinc-400 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              Ürün ara...
            </a>
          </div>
          
          <div className="flex items-center gap-2">
            <a href="#modeller" className="sm:hidden p-2 text-zinc-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </a>
            <a href="https://wa.me/905422301299" className="text-xs md:text-sm font-bold bg-zinc-900 text-white px-5 py-2.5 rounded-full transition hover:bg-pink-600">
              İletişim
            </a>
          </div>
        </div>
      </header>

      {/* 🔴 HERO */}
      <section className="pt-16 pb-12 px-4 text-center bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-pink-50 via-white to-blue-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-7xl font-black leading-tight tracking-tight text-zinc-900 mb-6">
            Doğal Görünüm <br /> 
            <span className="bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent italic">
              Sizin Elinizde
            </span>
          </h2>
          <p className="text-zinc-600 text-base md:text-xl mb-10 leading-relaxed">
            Hafif tasarımı ve gerçek saç dokusuyla hayalinizdeki görünüme kavuşun.
          </p>
          <a href="#modeller" className="bg-pink-600 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-pink-100 hover:scale-105 transition-transform inline-block">
            Modelleri Keşfet
          </a>
        </div>
      </section>

      {/* 🔵 MODELLER */}
      <section id="modeller" className="max-w-7xl mx-auto px-4 py-20">
        <div className="mb-12">
          <h3 className="text-2xl md:text-4xl font-black text-zinc-900">
            Koleksiyonlarımız
          </h3>
          <p className="text-zinc-500 mt-2">
            Aradığınız modeli kategorilerden seçin veya ismini yazın.
          </p>
        </div>
        
        <UrunArama 
          initialData={urunler} 
          kategoriler={kategoriler} 
        />
      </section>

      {/* ⚪️ FOOTER */}
      <footer className="bg-zinc-950 text-zinc-500 py-12 px-4 text-center text-sm">
        <p>© 2026 Naturel Peruk | En Doğal Çözümler</p>
      </footer>
    </main>
  )
}