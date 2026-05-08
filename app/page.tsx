export const dynamic = "force-dynamic"

import { supabase } from "@/lib/supabase"
import UrunArama from "@/components/UrunArama"

type Urun = {
  id: string
  ad: string
  fiyat: number
  gorsel: string
  gorseller?: string[]
  kategori_id: string
  aciklama?: string
}

async function verileriGetir() {
  const [urunlerRes, kategorilerRes, kampanyaRes] = await Promise.all([
    supabase
      .from("urunler")
      .select("id, ad, fiyat, gorsel, gorseller, kategori_id, aciklama, kategoriler(ad)")
      .order("created_at", { ascending: false }),

    supabase.from("kategoriler").select("*"),

    supabase
      .from("kampanyalar")
      .select("*")
      .eq("aktif", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
  ])

  return {
    urunler: (urunlerRes.data || []) as unknown as Urun[],
    kategoriler: kategorilerRes.data || [],
    kampanya: kampanyaRes.data || null
  }
}

export default async function Home() {
  const { urunler, kategoriler, kampanya } = await verileriGetir()

  const vitrinUrunleri = urunler.slice(0, 6)

  const heroSliderUrunleri = urunler
    .filter((urun) => urun.gorsel)
    .slice(0, 5)

  return (
    <main className="min-h-screen bg-[#fafafa] text-zinc-900">

     {kampanya?.metin && (
  <div className="kampanya-serit">
    <div className="kampanya-ic">
      <div className="kampanya-grup">
        {Array.from({ length: 6 }).map((_, index) => (
          <span key={`kampanya-1-${index}`} className="kampanya-yazi">
            <span className="kampanya-nokta" />
            {kampanya.metin}
          </span>
        ))}
      </div>

      <div className="kampanya-grup" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, index) => (
          <span key={`kampanya-2-${index}`} className="kampanya-yazi">
            <span className="kampanya-nokta" />
            {kampanya.metin}
          </span>
        ))}
      </div>
    </div>
  </div>
)}

      <header className="bg-white/90 backdrop-blur-xl border-b border-zinc-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center gap-4">
          <a href="/" className="shrink-0">
            <h1 className="font-black text-2xl tracking-tighter text-pink-600">
              NATUREL<span className="text-zinc-400 font-light">PERUK</span>
            </h1>
            <p className="text-[11px] text-zinc-400 tracking-wide">
              Doğal görünüm merkezi
            </p>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-zinc-600">
            <a href="#cesitler" className="hover:text-pink-600 transition">Çeşitler</a>
            <a href="#modeller" className="hover:text-pink-600 transition">Modeller</a>
            <a href="#avantajlar" className="hover:text-pink-600 transition">Avantajlar</a>
            <a href="#guven" className="hover:text-pink-600 transition">Güven</a>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#modeller"
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-500 text-sm hover:bg-zinc-200 transition"
            >
              Ürün ara
            </a>

            <a
              href="https://wa.me/905422301299"
              className="text-xs md:text-sm font-bold bg-pink-600 text-white px-5 py-3 rounded-full shadow-lg shadow-pink-200 hover:bg-zinc-950 transition"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#fce7f3,_transparent_35%),radial-gradient(circle_at_bottom_right,_#dbeafe,_transparent_35%)]" />

        <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-pink-50 text-pink-700 border border-pink-100 px-4 py-2 rounded-full text-xs font-bold mb-6">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
              Yeni sezon doğal peruk modelleri
            </div>

            <h2 className="text-4xl md:text-7xl font-black leading-tight tracking-tight text-zinc-950 mb-6">
              Doğal görünen,
              <br />
              <span className="bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent">
                güven veren peruklar
              </span>
            </h2>

            <p className="text-zinc-600 text-base md:text-xl leading-relaxed mb-8 max-w-xl">
              Gerçek saç dokusuna yakın görünüm, hafif kullanım ve yüzünüze uygun model seçenekleriyle kendinizi daha rahat hissedin.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#modeller"
                className="bg-zinc-950 text-white px-8 py-4 rounded-2xl font-bold text-center shadow-xl hover:bg-pink-600 transition"
              >
                Modelleri İncele
              </a>

              <a
                href="https://wa.me/905422301299"
                className="bg-white text-zinc-900 border border-zinc-200 px-8 py-4 rounded-2xl font-bold text-center shadow-sm hover:border-pink-300 transition"
              >
                WhatsApp’tan Sor
              </a>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-10 max-w-lg">
              <div className="bg-white border border-zinc-100 rounded-2xl p-4 shadow-sm">
                <p className="text-xl font-black text-zinc-950">100%</p>
                <p className="text-xs text-zinc-500 mt-1">Doğal görünüm</p>
              </div>

              <div className="bg-white border border-zinc-100 rounded-2xl p-4 shadow-sm">
                <p className="text-xl font-black text-zinc-950">Hafif</p>
                <p className="text-xs text-zinc-500 mt-1">Rahat kullanım</p>
              </div>

              <div className="bg-white border border-zinc-100 rounded-2xl p-4 shadow-sm">
                <p className="text-xl font-black text-zinc-950">Destek</p>
                <p className="text-xs text-zinc-500 mt-1">Model danışma</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-pink-200 to-blue-200 rounded-[3rem] blur-3xl opacity-60" />

            <div className="relative bg-white rounded-[2rem] border border-zinc-100 shadow-2xl overflow-hidden p-4">
              <div className="relative aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-zinc-100">
                {heroSliderUrunleri.length > 0 ? (
                  heroSliderUrunleri.map((urun, index) => (
                    <div
                      key={urun.id}
                      className="absolute inset-0 hero-slide"
                      style={
                        {
                          "--slide-index": index,
                          "--slide-count": heroSliderUrunleri.length,
                        } as React.CSSProperties
                      }
                    >
                      <img
                        src={urun.gorsel}
                        alt={urun.ad}
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                      <div className="absolute left-5 right-5 bottom-5">
                        <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-2">
                          Bugünün vitrini
                        </p>

                        <h3 className="text-white text-2xl md:text-4xl font-black leading-tight">
                          {urun.ad}
                        </h3>

                        {urun.fiyat && (
                          <p className="text-pink-200 font-black text-xl mt-2">
                            {Number(urun.fiyat).toLocaleString("tr-TR")} ₺
                          </p>
                        )}

                        <a
                          href="#modeller"
                          className="inline-block mt-4 bg-white text-zinc-950 px-5 py-2.5 rounded-full text-xs font-black hover:bg-pink-600 hover:text-white transition"
                        >
                          Ürünü İncele
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-pink-100 via-white to-blue-100 flex items-center justify-center text-center p-8">
                    <div>
                      <p className="text-sm font-bold text-pink-600 mb-3">
                        NATUREL PERUK
                      </p>
                      <h3 className="text-3xl md:text-5xl font-black text-zinc-950 leading-tight">
                        Kendin gibi hissettiren modeller
                      </h3>
                    </div>
                  </div>
                )}
              </div>

              {heroSliderUrunleri.length > 1 && (
                <div className="grid grid-cols-5 gap-2 mt-3">
                  {heroSliderUrunleri.map((urun, index) => (
                    <div
                      key={urun.id}
                      className="aspect-square rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-100"
                    >
                      <img
                        src={urun.gorsel}
                        alt={`Peruk modeli ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="absolute -bottom-6 left-6 right-6 bg-white/90 backdrop-blur border border-zinc-100 shadow-xl rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-zinc-950">
                  En Çok Tercih Edilenler Vitrini
                </p>
                <p className="text-xs text-zinc-500">
                  Ürünler Özel Kargo İle Gönderilir
                </p>
              </div>

              <a href="#modeller" className="text-sm font-bold text-pink-600">
                Bak →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-y border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="rounded-2xl bg-zinc-50 p-4">
            <p className="font-black text-zinc-950">Hızlı Destek</p>
            <p className="text-xs text-zinc-500 mt-1">WhatsApp üzerinden</p>
          </div>
          <div className="rounded-2xl bg-zinc-50 p-4">
            <p className="font-black text-zinc-950">Model Danışma</p>
            <p className="text-xs text-zinc-500 mt-1">Size uygun seçim</p>
          </div>
          <div className="rounded-2xl bg-zinc-50 p-4">
            <p className="font-black text-zinc-950">Yeni Ürünler</p>
            <p className="text-xs text-zinc-500 mt-1">Güncel koleksiyon</p>
          </div>
          <div className="rounded-2xl bg-zinc-50 p-4">
            <p className="font-black text-zinc-950">Doğal Duruş</p>
            <p className="text-xs text-zinc-500 mt-1">Günlük kullanım</p>
          </div>
        </div>
      </section>

      {vitrinUrunleri.length > 0 && (
        <section id="cesitler" className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <span className="text-pink-600 text-sm font-black uppercase tracking-widest">
                Peruk Çeşitleri
              </span>
              <h3 className="text-3xl md:text-5xl font-black text-zinc-950 mt-2">
                Popüler Seçimler
              </h3>
              <p className="text-zinc-500 mt-3 max-w-xl">
                Admin panelinden eklediğiniz ürün görselleri bu alanda otomatik vitrine çıkar.
              </p>
            </div>

            <a
              href="#modeller"
              className="hidden md:inline-block bg-zinc-950 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-pink-600 transition"
            >
              Tümünü Gör
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {vitrinUrunleri.map((urun) => (
              <a
                key={urun.id}
                href="#modeller"
                className="group bg-white rounded-3xl border border-zinc-100 shadow-sm hover:shadow-xl transition overflow-hidden"
              >
                <div className="aspect-[3/4] bg-zinc-100 overflow-hidden">
                  <img
                    src={urun.gorsel}
                    alt={urun.ad}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>

                <div className="p-3">
                  <p className="font-black text-sm text-zinc-900 line-clamp-1">
                    {urun.ad}
                  </p>
                  <p className="text-pink-600 font-black text-sm mt-1">
                    {Number(urun.fiyat).toLocaleString("tr-TR")} ₺
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      <section id="avantajlar" className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-5">
          <div className="bg-white border border-zinc-100 rounded-3xl p-6 shadow-sm">
            <h3 className="font-black text-lg mb-2">Doğal Görünüm</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Günlük kullanımda yapay durmayan, yüz hattınıza uyum sağlayan modeller.
            </p>
          </div>

          <div className="bg-white border border-zinc-100 rounded-3xl p-6 shadow-sm">
            <h3 className="font-black text-lg mb-2">WhatsApp Danışmanlık</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Kararsız kaldığınız model için hızlıca destek alabilirsiniz.
            </p>
          </div>

          <div className="bg-white border border-zinc-100 rounded-3xl p-6 shadow-sm">
            <h3 className="font-black text-lg mb-2">Güvenli Alışveriş</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Ürünleri inceleyin, size uygun modeli seçin ve iletişime geçin.
            </p>
          </div>
        </div>
      </section>

      <section id="modeller" className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="text-pink-600 text-sm font-black uppercase tracking-widest">
              Koleksiyon
            </span>
            <h3 className="text-3xl md:text-5xl font-black text-zinc-950 mt-2">
              Tüm Modeller
            </h3>
            <p className="text-zinc-500 mt-3 max-w-xl">
              Aradığınız modeli kategoriye göre seçin veya ürün ismiyle hızlıca bulun.
            </p>
          </div>

          <a
            href="https://wa.me/905422301299"
            className="bg-white border border-zinc-200 px-6 py-3 rounded-2xl font-bold text-sm hover:border-pink-300 transition w-fit"
          >
            Model danışmanlığı al
          </a>
        </div>

        <UrunArama initialData={urunler} kategoriler={kategoriler} />
      </section>

      <section id="guven" className="bg-zinc-950 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-pink-400 text-sm font-black uppercase tracking-widest">
              Naturel Peruk
            </span>
            <h3 className="text-3xl md:text-5xl font-black mt-3 leading-tight">
              Size yakışan modeli birlikte seçelim.
            </h3>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-6 md:p-8">
            <p className="text-zinc-300 leading-relaxed mb-6">
              Ürün seçerken yüz şekli, kullanım amacı, renk tercihi ve doğal görünüm beklentisi önemlidir. WhatsApp üzerinden destek alarak daha doğru seçim yapabilirsiniz.
            </p>

            <a
              href="https://wa.me/905422301299"
              className="inline-block bg-pink-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-zinc-950 transition"
            >
              WhatsApp’tan Yaz
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-zinc-200 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-4 text-sm text-zinc-500">
          <p>© 2026 Naturel Peruk | En doğal çözümler</p>
          <p>Doğal görünüm • Hafif kullanım • WhatsApp destek</p>
        </div>
      </footer>

      <a
        href="https://wa.me/905422301299"
        className="fixed right-4 bottom-4 z-50 bg-green-500 text-white px-5 py-4 rounded-full font-black shadow-2xl hover:scale-105 transition"
      >
        WhatsApp
      </a>
    </main>
  )
}