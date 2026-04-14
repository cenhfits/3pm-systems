import re

# ─── 1. LandingPage - Marquee testimonials ─────────────────────────────────────
with open('frontend/src/pages/LandingPage.jsx', 'r', encoding='utf-8') as f:
    landing = f.read()

old_testi = landing[landing.find("// Testimonials Section"):landing.find("\n// Final CTA Section")]

new_testi = r"""// Testimonials Section
const PhotoCarousel = ({ photos, name }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % photos.length), 3000);
    return () => clearInterval(t);
  }, [photos.length]);

  return (
    <div>
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-neutral-900">
        <AnimatePresence mode="wait">
          <motion.img key={current} src={photos[current]} alt={`${name} foto ${current + 1}`}
            className="absolute inset-0 w-full h-full object-cover object-top"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }} />
        </AnimatePresence>
        <button onClick={() => setCurrent(p => (p - 1 + photos.length) % photos.length)}
          className="absolute left-0 top-0 h-full w-1/3 z-10" aria-label="prev" />
        <button onClick={() => setCurrent(p => (p + 1) % photos.length)}
          className="absolute right-0 top-0 h-full w-1/3 z-10" aria-label="next" />
        <div className="absolute bottom-2 right-3 text-[10px] text-white/60 font-semibold z-20">
          {current + 1} / {photos.length}
        </div>
      </div>
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {photos.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`transition-all duration-200 rounded-full ${i === current ? 'w-5 h-1.5 bg-orange-500' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'}`} />
        ))}
      </div>
    </div>
  );
};

const TESTIMONIALS = [
  {
    name: "Andrybern Arvind",
    instagram: "@andrybern.arvind",
    photos: ['/testi1-1.jpeg', '/testi1-2.jpeg', '/testi1-3.jpeg'],
    beforeKg: null, afterKg: null,
    quote: "4 tahun gym, tapi sempet stuck karena ngerasa udah ngerti semuanya. Ternyata gua masih belum terlalu ngerti. Setelah konsultasi sama Vincent, gua jadi sadar kalau masih banyak blind spot dari nutrisi, training, sampai recovery. Dari sana progress gua mulai naik dan jujur aja gw happy sih Tapi gila sih, dari harga coursenya Vincent itu udah murah banget dari value yang dia punya, I would say ini bakalan jadi the best Investment buat pemula yang baru mau mulai journey nya sih.",
  },
  {
    name: "Seprianto",
    instagram: "@achensep",
    photos: ['/testi2-1.jpeg', '/testi2-2.jpeg', '/testi2-3.jpeg'],
    beforeKg: 58, afterKg: 65,
    quote: "Gila sih pas gw sebelum sama bro Vincent & sesudah, hasilnya bener bener keliatan, orangnya enak kalau diajak ngobrol kalau ada masalah, orangnya gercep dan langsung bisa jawab buat bantu nyelesaiin struggle nya gw, isi materinya semuanya ga banyak teori dan bisa langsung eksekusi, well gw ga bakalan nyesel kalau sama bro Vincent ini 100% worth it kalau masih pemula.",
  },
  {
    name: "— Nama Member",
    instagram: "@instagram",
    photos: ['/testi3-1.jpeg', '/testi3-2.jpeg', '/testi3-3.jpeg'],
    beforeKg: null, afterKg: null,
    quote: "",
  },
];

const TestimonialsSection = () => (
  <section data-testid="testimonials-section" className="py-16 sm:py-20 md:py-28 bg-[#111111] overflow-hidden">
    <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}>

        <motion.div variants={fadeInUp} className="text-center mb-10 sm:mb-14">
          <span className="inline-block text-orange-500 font-bold uppercase tracking-[0.2em] text-xs sm:text-sm mb-3">
            Real Results
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            Kata Mereka yang Sudah <span className="text-orange-500">Membuktikan</span>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto">
            Bukan janji — ini hasil nyata dari member yang udah jalanin metode 3PM System.
          </p>
        </motion.div>

      </motion.div>
    </div>

    {/* Full-width marquee */}
    <Marquee pauseOnHover speed={45} gradient gradientColor="#111111" gradientWidth={60}>
      {TESTIMONIALS.map((t, i) => (
        <div key={i} className="mx-3 w-72 sm:w-80 shrink-0 bg-[#1A1A1A] border border-white/10 hover:border-orange-500/30 rounded-2xl overflow-hidden flex flex-col transition-colors duration-200">
          <div className="p-4 pb-2">
            <PhotoCarousel photos={t.photos} name={t.name} />
          </div>
          {t.beforeKg && (
            <div className="flex items-center gap-2 px-4 pt-1 pb-0">
              <span className="text-[11px] font-semibold text-neutral-500">Sebelum <span className="text-white">{t.beforeKg} kg</span></span>
              <span className="text-orange-500 font-bold text-xs">\u2192</span>
              <span className="text-[11px] font-semibold text-orange-400">Sesudah {t.afterKg} kg</span>
            </div>
          )}
          <div className="p-4 pt-3 flex flex-col flex-1">
            {t.quote ? (
              <p className="text-neutral-300 text-sm leading-relaxed flex-1 mb-4 line-clamp-5">
                &ldquo;{t.quote}&rdquo;
              </p>
            ) : (
              <p className="text-neutral-600 italic text-sm flex-1 mb-4">[ Testimoni segera hadir ]</p>
            )}
            <div className="flex items-center gap-3 pt-3 border-t border-white/10">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-black text-sm flex-shrink-0">
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="text-white font-bold text-sm">{t.name}</p>
                <p className="text-orange-400 text-xs">{t.instagram}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </Marquee>
  </section>
);
"""

marker_end = "\n// Final CTA Section"
start_idx = landing.find("// Testimonials Section")
end_idx = landing.find(marker_end)
landing = landing[:start_idx] + new_testi + landing[end_idx:]
print("Testimonials marquee replaced")

with open('frontend/src/pages/LandingPage.jsx', 'w', encoding='utf-8') as f:
    f.write(landing)
print("LandingPage saved")

# ─── 2. index.html - SEO + Google Search Console ──────────────────────────────
seo_head = """<!doctype html>
<html lang="id">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#111111" />

        <!-- Google Search Console Verification -->
        <meta name="google-site-verification" content="2ThD2rX8DhISL-KV_2yMoJA8UKOWxsweEcwfuPFeXak" />

        <!-- SEO Primary -->
        <title>3PM System — Bentukin Otot dalam 90 Hari | Program Gym Pemula Indonesia</title>
        <meta name="description" content="3PM System: framework 3 pilar berbasis sains untuk bantu pemula gym bentukin otot dalam 90 hari. Nutrisi, latihan, dan mindset yang terbukti. Program gym terbaik untuk pemula di Indonesia." />
        <meta name="keywords" content="program gym pemula, cara bentukin otot, gym 90 hari, nutrisi gym, latihan beban pemula, muscle building indonesia, cara naikin berat badan, program latihan gym, cara gym yang benar, suplemen gym, progressive overload, hypertrophy, 3PM system, CenhFits, Vincent gym, course gym indonesia, online coaching gym" />
        <meta name="author" content="CenhFits - Vincent" />
        <meta name="robots" content="index, follow" />

        <!-- Open Graph (Social Media) -->
        <meta property="og:type" content="website" />
        <meta property="og:title" content="3PM System — Bentukin Otot dalam 90 Hari" />
        <meta property="og:description" content="Framework 3 pilar berbasis sains: Mindset, Nutrisi & Latihan. Terbukti pada ratusan member pemula gym di Indonesia." />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:locale" content="id_ID" />

        <!-- Twitter Card -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="3PM System — Bentukin Otot dalam 90 Hari" />
        <meta name="twitter:description" content="Program gym pemula terbaik. Nutrisi, latihan & mindset dalam satu framework 90 hari." />
        <meta name="twitter:image" content="/og-image.jpg" />

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@600&display=swap" rel="stylesheet" />
    </head>
    <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root"></div>
    </body>
</html>
"""

with open('frontend/public/index.html', 'w', encoding='utf-8') as f:
    f.write(seo_head)
print("index.html updated with SEO")

# ─── 3. PaymentModal - mobile fix ─────────────────────────────────────────────
with open('frontend/src/components/PaymentModal.jsx', 'r', encoding='utf-8') as f:
    modal = f.read()

# Make modal scrollable and responsive on mobile
modal = modal.replace(
    'className="bg-[#141414] border border-white/10 rounded-2xl w-full max-w-xl pointer-events-auto shadow-2xl shadow-black/60"',
    'className="bg-[#141414] border border-white/10 rounded-2xl w-full max-w-xl pointer-events-auto shadow-2xl shadow-black/60 max-h-[90vh] overflow-y-auto"'
)

# Responsive padding on header
modal = modal.replace(
    'className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-white/5"',
    'className="flex items-center justify-between px-4 sm:px-7 pt-5 sm:pt-6 pb-4 sm:pb-5 border-b border-white/5 sticky top-0 bg-[#141414] z-10"'
)

# Responsive padding on content
modal = modal.replace(
    'className="px-7 py-6 space-y-4"',
    'className="px-4 sm:px-7 py-4 sm:py-6 space-y-4"'
)

# BCA number smaller on mobile
modal = modal.replace(
    'className="text-white font-black text-2xl tracking-widest"',
    'className="text-white font-black text-lg sm:text-2xl tracking-widest"'
)

# Responsive grid for steps
modal = modal.replace(
    'className="grid grid-cols-2 gap-3">',
    'className="grid grid-cols-1 sm:grid-cols-2 gap-3">'
)

# Responsive footer padding
modal = modal.replace(
    'className="px-7 pb-7 space-y-3"',
    'className="px-4 sm:px-7 pb-5 sm:pb-7 space-y-3"'
)

with open('frontend/src/components/PaymentModal.jsx', 'w', encoding='utf-8') as f:
    f.write(modal)
print("PaymentModal mobile fixed")
