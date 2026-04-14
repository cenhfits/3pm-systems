with open('frontend/src/pages/LandingPage.jsx', 'r', encoding='utf-8') as f:
    src = f.read()

# Add useEffect to import
old_import = "import { useState } from 'react';"
new_import = "import { useState, useEffect } from 'react';"
if old_import in src:
    src = src.replace(old_import, new_import)
    print("useEffect imported")
else:
    print("import not found, checking...")
    if "useEffect" in src:
        print("useEffect already imported")

# Replace entire testimonials block
old_block = src[src.find("// Testimonials Section"):src.find("\n// Final CTA Section")]

new_block = r"""// Testimonials Section
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
          <motion.img
            key={current}
            src={photos[current]}
            alt={`${name} foto ${current + 1}`}
            className="absolute inset-0 w-full h-full object-cover object-top"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
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
    quote: "4 tahun gym, tapi sempet stuck karena ngerasa udah ngerti semuanya. Ternyata gua masih belum terlalu ngerti. Setelah konsultasi sama Vincent, gua jadi sadar kalau masih banyak blind spot dari nutrisi, training, sampai recovery. Dari sana progress gua mulai naik dan jujur aja gw happy sih Tapi gila sih, dari harga coursenya Vincent itu udah murah banget dari value yang dia punya, I would say ini bakalan jadi the best Investment buat pemula yang baru mau mulai journey nya sih.",
  },
  {
    name: "Seprianto",
    instagram: "@achensep",
    photos: ['/testi2-1.jpeg', '/testi2-2.jpeg', '/testi2-3.jpeg'],
    quote: "Gila sih pas gw sebelum sama bro Vincent & sesudah, hasilnya bener bener keliatan, orangnya enak kalau diajak ngobrol kalau ada masalah, orangnya gercep dan langsung bisa jawab buat bantu nyelesaiin struggle nya gw, isi materinya semuanya ga banyak teori dan bisa langsung eksekusi, well gw ga bakalan nyesel kalau sama bro Vincent ini 100% worth it kalau masih pemula.",
  },
  {
    name: "— Nama Member",
    instagram: "@instagram",
    photos: ['/testi3-1.jpeg', '/testi3-2.jpeg', '/testi3-3.jpeg'],
    quote: "",
  },
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setDirection(1);
      setCurrent(p => (p + 1) % TESTIMONIALS.length);
    }, 4500);
    return () => clearInterval(t);
  }, [paused]);

  const goTo = (idx) => {
    setDirection(idx >= current ? 1 : -1);
    setCurrent(idx);
    setPaused(true);
    setTimeout(() => setPaused(false), 6000);
  };
  const goNext = () => goTo((current + 1) % TESTIMONIALS.length);
  const goPrev = () => goTo((current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  const t = TESTIMONIALS[current];

  return (
    <section data-testid="testimonials-section" className="py-16 sm:py-20 md:py-28 bg-[#111111]">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}>

          {/* Header */}
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

          {/* Carousel */}
          <motion.div variants={fadeInUp}>
            <div className="relative max-w-md mx-auto"
              onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>

              {/* Card sliding area */}
              <div className="overflow-hidden rounded-2xl">
                <AnimatePresence custom={direction} mode="wait">
                  <motion.div
                    key={current}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.08}
                    onDragEnd={(_, { offset, velocity }) => {
                      if (offset.x < -40 || velocity.x < -400) goNext();
                      else if (offset.x > 40 || velocity.x > 400) goPrev();
                    }}
                    className="bg-[#1A1A1A] border border-white/10 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
                  >
                    <div className="p-4 pb-2">
                      <PhotoCarousel photos={t.photos} name={t.name} />
                    </div>
                    <div className="p-5 pt-3">
                      {t.quote ? (
                        <p className="text-neutral-300 text-sm leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
                      ) : (
                        <p className="text-neutral-600 italic text-sm mb-5">[ Testimoni segera hadir ]</p>
                      )}
                      <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                        <div className="w-9 h-9 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-black text-sm flex-shrink-0">
                          {t.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">{t.name}</p>
                          <p className="text-orange-400 text-xs">{t.instagram}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Arrows */}
              <button onClick={goPrev}
                className="absolute -left-12 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={goNext}
                className="absolute -right-12 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>

            {/* Dots */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => goTo(i)}
                  className={`transition-all duration-300 rounded-full ${i === current ? 'w-6 h-2 bg-orange-500' : 'w-2 h-2 bg-white/20 hover:bg-white/40'}`} />
              ))}
            </div>

            {/* Counter */}
            <p className="text-center text-neutral-600 text-xs mt-3">{current + 1} / {TESTIMONIALS.length}</p>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};
"""

marker_end = "\n// Final CTA Section"
start_idx = src.find("// Testimonials Section")
end_idx = src.find(marker_end)

src = src[:start_idx] + new_block + src[end_idx:]
print("TestimonialsSection replaced")

with open('frontend/src/pages/LandingPage.jsx', 'w', encoding='utf-8') as f:
    f.write(src)
print("Done")
