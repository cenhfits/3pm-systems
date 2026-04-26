import React from 'react';
import Marquee from 'react-fast-marquee';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dumbbell,
  Utensils,
  Moon,
  ChevronRight,
  ChevronLeft,
  Check,
  Flame,
  Target,
  TrendingUp,
  Users,
  Clock,
  Shield,
  Zap,
  RefreshCw,
  Wallet,
  Brain,
  BatteryLow,
  HelpCircle,
  ChevronDown,
  Lock
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import PaymentModal from '../components/PaymentModal';

// Animation variants - Enhanced for smoother mobile experience
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    } 
  }
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

// Urgency Bar Component
const UrgencyBar = () => (
  <div data-testid="urgency-bar-marquee" className="urgency-bar">
    <Marquee speed={50} gradient={false}>
      <span className="marquee-text mx-8 flex items-center gap-2">
        <Flame className="w-4 h-4" /> HARGA EARLY BIRD · SEMAKIN LAMA SEMAKIN NAIK! 
      </span>
      <span className="marquee-text mx-8 flex items-center gap-2">
        <Zap className="w-4 h-4" /> SCROLL SAMPAI BAWAH UNTUK CLAIM SEKARANG JUGA!
      </span>
      <span className="marquee-text mx-8 flex items-center gap-2">
        <Flame className="w-4 h-4" /> HARGA EARLY BIRD · SEMAKIN LAMA SEMAKIN NAIK!
      </span>
      <span className="marquee-text mx-8 flex items-center gap-2">
        <Zap className="w-4 h-4" /> SCROLL SAMPAI BAWAH UNTUK CLAIM SEKARANG JUGA!
      </span>
    </Marquee>
  </div>
);

// Navigation Component
const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    setIsMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }, 320);
  };

  const navLinks = [
    { id: 'pillars', label: 'Program' },
    { id: 'hasil', label: 'Hasil' },
    { id: 'harga', label: 'Harga' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <nav
      data-testid="main-navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0D0D0D]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">

          {/* Logo */}
          <div className="flex items-center">
            <img src="/logo-full.webp" alt="3PM System" className="h-8 sm:h-10 w-auto object-contain" />
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="relative px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors duration-200 group"
                data-testid={`nav-${id}`}
              >
                {label}
                <span className="absolute bottom-1 left-4 right-4 h-px bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
              </button>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="hidden sm:flex items-center gap-1.5 text-neutral-400 hover:text-white text-sm font-medium transition-colors"
            >
              Masuk
            </button>
            <button
              onClick={() => navigate('/register')}
              className="hidden sm:flex items-center gap-1.5 bg-orange-500 hover:bg-orange-400 text-black font-bold text-sm px-5 py-2 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105"
              data-testid="nav-cta-btn"
            >
              <Zap className="w-3.5 h-3.5" />
              Daftar Sekarang
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2 group"
              data-testid="mobile-menu-btn"
              aria-label="Buka menu navigasi"
            >
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={isMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="md:hidden overflow-hidden bg-[#0D0D0D]/95 backdrop-blur-xl border-t border-white/10"
        >
          <div className="py-4 space-y-1">
            {navLinks.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="flex items-center gap-3 w-full text-left px-4 py-3 text-neutral-300 hover:text-orange-500 hover:bg-orange-500/5 rounded-xl transition-all duration-200"
              >
                <ChevronRight className="w-4 h-4 text-orange-500/50" />
                {label}
              </button>
            ))}
            <div className="pt-3 px-4">
              <button
                onClick={() => { setIsMenuOpen(false); navigate('/register'); }}
                className="w-full bg-orange-500 hover:bg-orange-400 text-black font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Daftar Sekarang
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </nav>
  );
};

// Hero Section Component
const HeroSection = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section data-testid="hero-section" className="hero-section relative pt-20 pb-12 sm:pt-24 sm:pb-16 md:pt-32 md:pb-24 min-h-[90vh] sm:min-h-screen flex items-center overflow-hidden">
      {/* Photo — full width */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero.webp"
          alt="Hero"
          className="w-full h-full object-cover"
          style={{ objectPosition: '65% top' }}
          fetchpriority="high"
        />
        {/* Kiri semi-transparan biar foto keliatan, tapi teks masih terbaca */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#111111]/80 via-[#111111]/75 to-transparent" />
        {/* Fade bottom on mobile */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-transparent to-transparent md:hidden" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-xl lg:max-w-2xl"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-block bg-orange-500/20 text-orange-500 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6"
          >
            Khusus Pemula Gym
          </motion.span>

          <motion.h1
            variants={fadeInUp}
            className="font-semibold tracking-tight leading-[1.15] text-white mb-4 sm:mb-6"
            style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1.4rem, 5.5vw, 3.5rem)' }}
          >
            <span className="block whitespace-nowrap">Latihan Gym Aja Gak Bakalan</span>
            <span className="text-orange-500 font-bold uppercase whitespace-nowrap">Bentukin Otot Lo!</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-base sm:text-lg md:text-xl text-neutral-300 mb-6 sm:mb-8 max-w-xl leading-relaxed"
          >
            Percaya atau ngga, gw dulu juga ngalamin hal yang sama. Sampai akhirnya gw buang hampir <strong className="text-white">4 tahun</strong> latihan konsisten dan otot gw gak ada perkembangan yang begitu signifikan.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-2 mb-6">
            {['Tanpa Steroid', 'Tanpa Suntik', 'Full Natural'].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 bg-black/40 border border-orange-500/40 text-orange-400 text-[11px] sm:text-base font-bold uppercase tracking-wider px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full backdrop-blur-sm">
                <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                {item}
              </span>
            ))}
          </motion.div>

          <motion.p variants={fadeInUp} className="text-white font-black text-lg sm:text-2xl uppercase tracking-wide mb-6 leading-snug">
            TANPA SUNTIK, FULL NATURAL -{' '}
            <span className="text-orange-500 text-3x1 ">BISA BAGUS BADANNYA!</span>
          </motion.p>

          <motion.button
            variants={fadeInUp}
            onClick={() => scrollToSection('harga')}
            className="cta-button cta-button-large group"
            data-testid="hero-cta-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Transformasi Sekarang
            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

// Pain Points Section
const PAIN_POINTS = [
  { icon: <Dumbbell className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500" />, text: "Udah konsisten gym berminggu-minggu, tapi badan masih gitu-gitu aja & otot keliatan ngestuck." },
  { icon: <RefreshCw className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500" />, text: "Udah gonta-ganti program latihan, tapi hasilnya sama aja." },
  { icon: <Wallet className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500" />, text: "Takut mulai karena ga ada yang ngarahin & bayar PT harus sampai 1.000.000an." },
  { icon: <Brain className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500" />, text: "Terlalu banyak informasi soal gym yang bikin lo bingung harus mulai darimana." },
  { icon: <BatteryLow className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500" />, text: "Ngerasa latihannya udah keras, tapi badan masih gampang capek dan recovery lama." },
  { icon: <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500" />, text: "Overthinking soal harus makan apa, suplemen apa, latihan berapa set, sampai malah paralyzed dan gak ngapa-ngapain." },
];

const PainPointsSection = () => (
  <section data-testid="hook-pain-points-section" className="py-10 sm:py-14 bg-[#111111]">
    <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="text-center mb-10 sm:mb-12"
      >
        <motion.p variants={fadeInUp} className="text-orange-500 font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-xs sm:text-sm mb-3 sm:mb-4">
          Coba Jujur
        </motion.p>
        <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
          Lo Pernah Ngalamin Ini?
        </motion.h2>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
      >
        {PAIN_POINTS.map((point, i) => (
          <motion.div
            key={i}
            variants={fadeInScale}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="pain-card flex flex-col items-start p-5 sm:p-6"
          >
            <div className="bg-orange-500/10 p-2.5 sm:p-3 rounded-lg mb-3 sm:mb-4">
              {point.icon}
            </div>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">{point.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

// Realita Carousel
const REALITA_CARDS = [
  { id: 1, src: '/realita-1.webp' },
  { id: 2, src: '/realita-2.webp' },
  { id: 3, src: '/realita-3.webp' },
  { id: 4, src: '/realita-4.webp' },
  { id: 5, src: '/realita-5.webp' },
];

const RealitaCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const total = REALITA_CARDS.length;

  const goToNext = useCallback(() => {
    setActiveIndex(prev => (prev + 1) % total);
  }, [total]);

  const resetInterval = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(goToNext, 3000);
  }, [goToNext]);

  useEffect(() => {
    if (!isPaused) resetInterval();
    else clearInterval(intervalRef.current);
    return () => clearInterval(intervalRef.current);
  }, [isPaused, resetInterval]);

  const changeSlide = (i) => {
    setActiveIndex((i + total) % total);
    if (!isPaused) resetInterval();
  };

  const touchStartX = useRef(null);
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) changeSlide(diff > 0 ? activeIndex + 1 : activeIndex - 1);
    touchStartX.current = null;
  };

  return (
    <div
      className="relative flex flex-col rounded-2xl border border-white/10 bg-[#1a1a1a] p-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide strip */}
      <div
        className="overflow-hidden rounded-xl cursor-grab active:cursor-grabbing"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex"
          style={{ transform: `translateX(-${activeIndex * 100}%)`, transition: 'transform 0.45s ease' }}
        >
          {REALITA_CARDS.map((card) => (
            <div key={card.id} className="w-full flex-shrink-0" style={{ aspectRatio: '3/4' }}>
              <img
                src={card.src}
                alt={`Realita ${card.id}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={() => changeSlide(activeIndex - 1)}
          aria-label="Sebelumnya"
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-1.5">
          {REALITA_CARDS.map((_, i) => (
            <button
              key={i}
              onClick={() => changeSlide(i)}
              aria-label={`Foto ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === i ? 'w-5 bg-orange-500' : 'w-1.5 bg-white/20 hover:bg-white/40'}`}
            />
          ))}
        </div>
        <button
          onClick={() => changeSlide(activeIndex + 1)}
          aria-label="Selanjutnya"
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Realita Section
const RealitaSection = () => (
  <section data-testid="realita-section" className="py-10 sm:py-14 bg-[#0D0D0D]">
    <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
      >
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Carousel kiri */}
          <motion.div variants={fadeInUp}>
            <RealitaCarousel />
          </motion.div>

          {/* Teks kanan */}
          <motion.div variants={fadeInUp} className="space-y-4 sm:space-y-6 text-base sm:text-lg text-neutral-400 leading-relaxed">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
              Realitanya...
            </h2>
            <p>
              Gak semua konten dari <strong className="text-white">influencer fitness, program random di internet,</strong> atau <strong className="text-white">video YouTube</strong> itu cocok buat lo yang baru mulai.
            </p>
            <p>
              Bahayanya, bukannya otot makin <strong className="text-white">berkembang</strong>, malah bikin lo <strong className="text-orange-500">makin overwhelmed dan akhirnya nyerah.</strong>
            </p>
            <p>
              Kalau lo udah nyobain berbagai program latihan, ikutin tips makan dari internet, tapi otot masih stagnan...
            </p>
            <p className="text-white font-semibold text-xl">
              Tenang. Dulu gw juga ngalamin hal yang sama, hampir 4 tahun.
            </p>
            <p>
              Sampai akhirnya gw nemuin bahwa yang perlu dibenerin bukan cuma latihannya, tapi ada <strong className="text-orange-500">3 pilar yang harus jalan bersamaan.</strong>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  </section>
);

// Personal Story Section
const STORY_BLOCKS = [
  {
    photos: ['/story-thin-1.webp', '/story-thin-2.webp', '/story-thin-3.webp', '/story-thin-4.webp'],
    label: 'Ini Gw Di Titik Paling Rendah',
    content: [
      'Ini gw. Beberapa tahun yang lalu.',
      'Waktu itu ada orang yang notice badan gw terus bilang terang-terangan di depan gw: <em>"Lo kok kurus banget, cacingan ya?"</em>',
      'Dan yang bikin itu nyakitin bukan karena orang itu jahat. Tapi karena gw tau dia bener.',
      'Gw ga pede sama badan sendiri. Pake baju apapun rasanya gak enak diliat. Dan di dalam kepala gw cuma ada satu pertanyaan yang terus muter: <strong class="text-white">"Gimana caranya gw gedein dan bentukin badan ini?"</strong>',
    ],
  },
  {
    photos: ['/story-gym-1.webp', '/story-gym-2.webp', '/story-gym-3.webp', '/story-gym-4.webp'],
    label: 'Gw Mulai Sendirian, Bingung, dan Bahkan Bokek',
    content: [
      'Akhirnya gw mutusin buat mulai gym.',
      'Tapi jujur? Gw ga tau apa-apa. Ga ada personal trainer. Ga ada temen yang bisa ajarin. Ga ngerti soal nutrisi. Ga paham cara latihan yang bener.',
      'Gw cuma tau satu hal: gw mau bentukin badan.',
      'Sampai akhirnya gw nemuin satu fakta yang bikin gw down banget waktu itu: <strong class="text-orange-500">"Kalau protein lo ga terpenuhi, otot lo bakal susah kebentuk."</strong>',
      'Dan gw? Waktu itu gw lagi dalam kondisi ekonomi yang cukup buat survive dan bukan buat bentukin otot. Lo pasti pernah ngerasa gitu? Pengen banget progress, tapi keadaan ga mendukung?',
    ],
  },
  {
    photos: ['/story-stuck-1.webp', '/story-stuck-2.webp', '/story-stuck-3.webp', '/story-stuck-4.webp'],
    label: 'Gw Latihan Terus. Tapi Badan Gw Ga Kemana-Mana',
    content: [
      'Gw tetap latihan. Konsisten. Tapi badan gw ga berubah signifikan.',
      'Bukan karena gw males. Bukan karena gw ga serius. Tapi karena gw cuma jalanin 1 dari 3 hal yang seharusnya gw jalanin bareng-bareng.',
      'Waktu itu gw ga sadar — otot itu ga cuma soal latihan. Ada dua hal lain yang sama pentingnya yang gw <strong class="text-white">abaikan total selama 4 tahun itu.</strong>',
    ],
  },
  {
    photos: ['/story-after-1.webp', '/story-after-2.webp', '/story-after-3.webp', '/story-after-4.webp'],
    label: 'Begitu 3 Hal Ini Gw Jalanin Bareng Semuanya Berubah',
    content: [
      'Sampai akhirnya hidup gw mulai berubah. Gw punya income sendiri. Gw mulai bisa jaga makan. Gw mulai benerin cara latihan — hypertrophy training, progressive overload — dan hal yang paling gw underestimate selama ini: <strong class="text-white">gw belajar cara tidur yang bener.</strong>',
      'Begitu ketiga hal itu gw jalanin bareng, badan gw mulai berubah. Lo bisa cek dokumentasinya langsung di Instagram <strong class="text-orange-500">@cenhfits</strong>.',
      'Dan apa yang gw capai itu <strong class="text-white">100% naturally achieveable.</strong> Tanpa obat. Tanpa suntik. Tanpa apapun.',
    ],
  },
  {
    photos: ['/story-bintik-1.webp', '/story-bintik-2.webp', '/story-bintik-3.webp'],
    label: 'Buat Lo Yang Masih Ragu Gw Natural Apa Ngga',
    content: [
      'Gw tau ada yang bakal nanya soal bintik di dada gw. Itu bukan tanda steroid — itu genetik dari orang tua gw, bahkan beberapa temen gw ngalamin hal yang sama.',
      '<strong class="text-white">Kalau gw emang pakai steroid, kenapa foto before gw udah ada bintik yang sama?</strong>',
      'Sesimple itu buat ngebedainnya. Lo bisa percaya gw natural atau ngga — itu hak lo. Yang pasti, semua yang gw ajarkan di sini bisa lo capai dengan cara yang sama.',
      'Gw ga cuma bantu lo seorang. Gw bantu banyak orang yang ada di posisi yang sama persis kayak gw dulu. Tapi kalau dari awal lo ga bisa serius dan ga mau aksi — jujur aja, course ini bisa lo skip. Karena yang gw cari adalah orang yang <strong class="text-orange-500">beneran mau berubah.</strong>',
    ],
  },
];

const StoryPhotoSlider = ({ photos }) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showHint, setShowHint] = useState(true);
  const touchStartX = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (photos.length <= 1) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrent(c => (c + 1) % photos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [photos.length]);

  const prev = () => { setDirection(-1); setCurrent(c => (c - 1 + photos.length) % photos.length); };
  const next = () => { setDirection(1); setCurrent(c => (c + 1) % photos.length); };

  const onTouchStart = e => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = e => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 30) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <div className="relative select-none bg-[#0D0D0D] h-full flex flex-col" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

      {/* Counter badge */}
      {photos.length > 1 && (
        <div className="absolute top-2 right-2 z-20 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          {current + 1}/{photos.length}
        </div>
      )}

      {/* Swipe hint */}
      <AnimatePresence>
        {showHint && photos.length > 1 && (
          <motion.div
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: [0, 6, 0] }}
            exit={{ opacity: 0 }}
            transition={{ repeat: 2, duration: 0.6 }}
            className="absolute bottom-10 left-0 right-0 z-20 flex justify-center pointer-events-none"
          >
            <span className="text-[10px] text-white/50 font-medium tracking-wide flex items-center gap-1">
              <ChevronDown className="w-3 h-3 -rotate-90" /> geser
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo */}
      <div className="relative overflow-hidden" style={{ height: '380px' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.img
            key={current}
            src={photos[current]}
            alt={`foto ${current + 1}`}
            custom={direction}
            initial={{ opacity: 0, x: direction * 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -30 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0 w-full h-full object-contain"
            onError={e => { e.currentTarget.style.display = 'none'; }}
          />
        </AnimatePresence>

        {/* Arrow buttons — always visible */}
        {photos.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-transform active:scale-90"
              aria-label="Foto sebelumnya"
            >
              <ChevronDown className="w-3.5 h-3.5 text-white rotate-90" />
            </button>
            <button
              onClick={next}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-transform active:scale-90"
              aria-label="Foto selanjutnya"
            >
              <ChevronDown className="w-3.5 h-3.5 text-white -rotate-90" />
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {photos.length > 1 && (
        <div className="flex justify-center gap-1.5 py-2.5">
          {photos.map((_, di) => (
            <button
              key={di}
              onClick={() => { setDirection(di > current ? 1 : -1); setCurrent(di); }}
              className="rounded-full transition-all duration-300"
              style={{
                width: di === current ? '18px' : '6px',
                height: '6px',
                background: di === current ? '#F97316' : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const JourneyArrow = ({ label }) => (
  <div className="flex flex-col items-center py-1 relative z-10">
    <div className="w-px h-6 bg-gradient-to-b from-orange-500/50 to-orange-500" />
    <motion.div
      animate={{ y: [0, 5, 0] }}
      transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
      className="flex flex-col items-center"
    >
      <div className="w-9 h-9 rounded-full bg-orange-500 shadow-[0_0_16px_rgba(249,115,22,0.5)] flex items-center justify-center">
        <ChevronDown className="w-5 h-5 text-black stroke-[3]" />
      </div>
    </motion.div>
    <div className="w-px h-6 bg-gradient-to-b from-orange-500 to-orange-500/20" />
    {label && (
      <span className="text-[10px] uppercase tracking-[0.2em] text-orange-500/60 font-bold mt-1">{label}</span>
    )}
  </div>
);

const JOURNEY_TRANSITIONS = [
  'Lalu...',
  'Tapi...',
  'Sampai akhirnya...',
  'Dan sekarang...',
];

const PersonalStorySection = () => (
  <section className="py-12 sm:py-16 bg-[#080808] relative overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

    <div className="relative max-w-4xl mx-auto px-5 sm:px-10">

      {/* Header */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="mb-10 text-center"
      >
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-orange-500" />
          <span className="text-orange-500 font-bold uppercase tracking-[0.25em] text-[11px]">Perjalanan Gw</span>
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-orange-500" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
          Dari Nol.<br />Sampai Sekarang.
        </h2>
        <p className="mt-3 text-neutral-500 text-sm max-w-xs mx-auto">Cerita jujur yang ga pernah gw filter.</p>
      </motion.div>

      {/* Story Blocks */}
      <div className="flex flex-col">
        {STORY_BLOCKS.map((block, i) => {
          const photoLeft = i % 2 === 1; // even: text left photo right, odd: photo left text right
          return (
            <React.Fragment key={i}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeInUp}
              >
                {/* Card — gradient border wrap */}
                <div className="rounded-2xl p-px shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(249,115,22,0.06)]"
                  style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.4) 0%, rgba(255,255,255,0.05) 40%, rgba(249,115,22,0.15) 100%)' }}
                >
                  <div className="rounded-2xl overflow-hidden bg-[#111111]">

                    {/* Label row */}
                    <div className="flex items-center justify-between px-4 pt-3 pb-3"
                      style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.12) 0%, transparent 100%)' }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)] flex items-center justify-center flex-shrink-0">
                          <span className="text-black font-black text-[11px]">{i + 1}</span>
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-[0.15em] text-orange-400 leading-tight">
                          {block.label}
                        </span>
                      </div>
                      <Flame className="w-3.5 h-3.5 text-orange-500/40" />
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-orange-500/40 via-white/5 to-transparent" />

                    {/* Body: side by side */}
                    <div className={`flex flex-col min-h-[280px] ${photoLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>

                      {/* Photo side */}
                      <div className="w-full sm:w-[48%] flex-shrink-0 p-2 flex flex-col">
                        <div className="rounded-xl overflow-hidden flex-1 shadow-[0_0_20px_rgba(0,0,0,0.4)]">
                          <StoryPhotoSlider photos={block.photos} />
                        </div>
                      </div>

                      {/* Divider vertical */}
                      <div className="w-px bg-gradient-to-b from-transparent via-white/6 to-transparent flex-shrink-0" />

                      {/* Text side */}
                      <div className="flex-1 px-4 py-4 flex flex-col justify-start space-y-3 overflow-y-auto">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-[2px] rounded-full bg-orange-500" />
                          <div className="w-2 h-[2px] rounded-full bg-orange-500/40" />
                        </div>
                        {block.content.map((para, j) => (
                          <p
                            key={j}
                            className="text-neutral-400 text-sm sm:text-[15px] leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: para }}
                          />
                        ))}
                      </div>

                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Journey arrow connector */}
              {i < STORY_BLOCKS.length - 1 && (
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                >
                  <JourneyArrow label={JOURNEY_TRANSITIONS[i]} />
                </motion.div>
              )}
            </React.Fragment>
          );
        })}
      </div>

    </div>
  </section>
);

// Natural Claim Banner
const NaturalClaimBanner = () => (
  <section className="py-10 sm:py-12 bg-[#0D0D0D] relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-orange-500/10 to-orange-500/5 pointer-events-none" />
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
      className="max-w-4xl mx-auto px-5 text-center"
    >
      <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/30 px-4 py-1.5 rounded-full mb-5">
        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
        <span className="text-orange-500 font-bold text-[11px] uppercase tracking-widest">100% Naturally Achieveable</span>
      </div>

      <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
        TANPA SUNTIK, FULL NATURAL
      </h2>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight mt-1">
        BISA <span className="text-orange-500">BAGUS BADANNYA!</span>
      </h2>

      <div className="flex items-center justify-center gap-6 mt-8">
        {['Tanpa Steroid', 'Tanpa Obat', 'Tanpa Suntik'].map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-neutral-400 text-sm">
            <Check className="w-4 h-4 text-orange-500 flex-shrink-0" />
            {item}
          </div>
        ))}
      </div>
    </motion.div>
  </section>
);

// Storytelling Section
const StorytellingSection = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section data-testid="storytelling-section" className="section-padding bg-[#111111]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.span 
            variants={fadeInUp}
            className="inline-block text-orange-500 font-bold uppercase tracking-[0.2em] text-sm mb-4"
          >
            Kenalan Dulu
          </motion.span>
          
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8"
          >
            Hi, gw <span className="text-orange-500">Vincent Hong</span>.
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeInUp} className="space-y-6 text-neutral-400">
              <p>
                Gw bukan atlet profesional. Gw bukan personal trainer bersertifikat dengan klien ratusan orang. Gw cuma seseorang yang pernah ada di posisi yang sama persis dengan lo sekarang.
              </p>
              <p>
                Hampir <strong className="text-white">4 tahun</strong> gw latihan konsisten , tapi otot gw susah banget keliatan. Badan tetap kurus. Gw pikir masalahnya di program latihan, jadi ganti-ganti terus.
              </p>
              <p className="text-white font-semibold">
                Ternyata salah besar.
              </p>
              <p>
                Pola makan gw <strong className="text-orange-500">berantakan</strong>. Tidur gw <strong className="text-orange-500">ngaco</strong>. Gw fokus 100% ke latihan, tapi nggak sadar bahwa otot tumbuh justru di luar gym , saat lo makan dan tidur yang bener.
              </p>
              <p>
                Setelah gw akhirnya paham dan nerapin <strong className="text-white">3 pilar ini secara bersamaan</strong>, badan gw baru beneran berubah dalam waktu yang sama yang gw janjiin ke lo , <strong className="text-orange-500">3 bulan.</strong>
              </p>
              <p className="text-white font-semibold text-xl">
                Dan gw bikin course ini supaya lo gak perlu buang 4 tahun kayak gw dulu.
              </p>
              
              <button 
                onClick={() => scrollToSection('harga')}
                className="cta-button group mt-4"
                data-testid="story-cta-btn"
              >
                Gw Mau Mulai Lebih Cepat
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="relative">
              <div className="before-after-container">
                <div className="before-after-card">
                  <img
                    src="/before.webp"
                    alt="Before transformation"
                    className="grayscale"
                    loading="lazy"
                  />
                  <div className="before-after-label text-neutral-400">
                    Nov 2025
                  </div>
                  <div className="text-center mt-1 text-sm font-bold text-neutral-400">58 kg</div>
                </div>
                <div className="before-after-card">
                  <img
                    src="/after.webp"
                    alt="After transformation"
                    loading="lazy"
                  />
                  <div className="before-after-label text-orange-500">
                    Feb 2026
                  </div>
                  <div className="text-center mt-1 text-sm font-bold text-orange-400">65 kg</div>
                </div>
              </div>
              <p className="text-center text-sm text-neutral-500 mt-4">
                Periode: ±3–4 Bulan (sama persis dengan yang gw janjiin ke lo)
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Empathy Section
const EmpathySection = () => {
  const empathyPoints = [
    "Ngerasa udah kerja keras di gym tapi hasilnya nggak sebanding , dan itu nyebelin banget.",
    "Bingung harus percaya konten siapa, karena semua orang ngomong hal yang berbeda-beda.",
    "Ngerasa otot susah tumbuh dan mulai mikir mungkin emang badan gw begini adanya.",
    "Pengen banget ada yang guide step by step, tapi personal trainer terlalu mahal."
  ];

  return (
    <section className="py-10 sm:py-14 bg-[#0D0D0D]">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8"
          >
            Gw Paham Banget <span className="text-orange-500">Apa yang Lo Rasain</span>
          </motion.h2>
          
          <motion.ul variants={fadeInUp} className="space-y-4 mb-8">
            {empathyPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-3 text-neutral-400">
                <div className="bg-orange-500/20 p-1 rounded mt-1">
                  <Check className="w-4 h-4 text-orange-500" />
                </div>
                <span>{point}</span>
              </li>
            ))}
          </motion.ul>
          
          <motion.div 
            variants={fadeInUp}
            className="bg-[#1A1A1A] border-l-4 border-orange-500 p-6 rounded-r-lg"
          >
            <p className="text-white text-lg">
              Semua itu bukan salah lo. Masalahnya adalah <strong className="text-orange-500">nggak ada yang ngajarin fondasinya dengan bener</strong> , sampai sekarang.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Three Pillars Section
const ThreePillarsSection = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const pillars = [
    {
      icon: <Moon className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />,
      title: "Recovery Engine System",
      emoji: "1",
      description: "Otot tumbuh saat lo tidur, bukan saat latihan. Gw kasih tau cara tidur yang beneran bantu recovery dan pertumbuhan otot.",
      image: "/Pilar1.webp"
    },
    {
      icon: <Utensils className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />,
      title: "Anabolic Fuel System",
      emoji: "2",
      description: "Makanan buat pembentukan dan recovery otot yang realistis , termasuk rekomendasi suplemen buat yang budgetnya cukup.",
      image: "/Pilar2.webp"
    },
    {
      icon: <Dumbbell className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />,
      title: "Primal Training System",
      emoji: "3",
      description: "Bukan soal berapa banyak set atau rep. Tapi cara latihan yang efektif buat sinyal otot tumbuh , termasuk cara home workout saat gak bisa ke gym.",
      image: "/Pilar3.webp"
    },
  ];

  return (
    <section id="pillars" data-testid="three-pillars-section" className="py-10 sm:py-14 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="text-center mb-10 sm:mb-12"
        >
          <motion.span 
            variants={fadeInUp}
            className="inline-block text-orange-500 font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-xs sm:text-sm mb-3 sm:mb-4"
          >
            The Framework
          </motion.span>
          <motion.h2 
            variants={fadeInUp}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4"
          >
            Kenalan dengan <span className="text-orange-500">3 Pillar Train. Eat. Sleep.</span>
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            className="text-neutral-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Aesthetic Transformation in 90 Days , framework sederhana yang gw buktiin sendiri selama 4 tahun trial and error.
          </motion.p>
        </motion.div>

        {/* Video */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mb-10 sm:mb-12"
        >
          <div className="rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(249,115,22,0.15)] border border-white/8" style={{ aspectRatio: '16/9' }}>
            <iframe
              src="https://www.youtube.com/embed/g3RXHnX56nI"
              title="3PM System"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12"
        >
          {pillars.map((pillar, index) => (
            <motion.div 
              key={index}
              variants={fadeInScale}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="pillar-card"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={pillar.image} 
                  alt={pillar.title}
                  loading="lazy" className="w-full aspect-video object-cover"
                />
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-orange-500 text-black font-black text-lg sm:text-xl w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center">
                  {pillar.emoji}
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  {pillar.icon}
                  <h3 className="text-lg sm:text-xl font-bold text-white">{pillar.title}</h3>
                </div>
                <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">{pillar.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          className="bg-gradient-to-r from-orange-500/20 to-orange-500/5 border border-orange-500/30 rounded-xl p-5 sm:p-8 text-center"
        >
          <p className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-2">
            Dalam 3 Bulan, Otot Lo Udah Mulai Kelihatan Terbentuk.
          </p>
          <p className="text-neutral-400 text-sm sm:text-base">
            (Selama 3 pilar ini dijalanin bareng-bareng.)
          </p>
          <motion.button 
            onClick={() => scrollToSection('harga')}
            className="cta-button mt-5 sm:mt-6 group"
            data-testid="pillars-cta-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Gw Mau Coba
            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

// Gym Proof Section
const GYM_VIDEOS = [
  { src: '/gym-proof-v1.mp4', orientation: 'vertical' },
  { src: '/gym-proof-h1.mp4', orientation: 'horizontal' },
  { src: '/gym-proof-h2.mp4', orientation: 'horizontal' },
  { src: '/gym-proof-v2.mp4', orientation: 'vertical' },
  { src: '/gym-proof-h3.mp4', orientation: 'horizontal' },
  { src: '/gym-proof-v3.mp4', orientation: 'vertical' },
  { src: '/gym-proof-h4.mp4', orientation: 'horizontal' },
  { src: '/gym-proof-v4.mp4', orientation: 'vertical' },
  { src: '/gym-proof-h5.mp4', orientation: 'horizontal' },
  { src: '/gym-proof-h6.mp4', orientation: 'horizontal' },
];

const GymProofSection = () => {
  const videoRefs = useRef([]);

  useEffect(() => {
    const observers = [];
    videoRefs.current.filter(Boolean).forEach((video, i) => {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              if (!video.src) {
                video.src = GYM_VIDEOS[i].src;
                video.load();
              }
              video.play().catch(() => {});
              obs.disconnect();
            }
          });
        },
        { rootMargin: '150px', threshold: 0 }
      );
      obs.observe(video);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
  <section className="py-12 sm:py-16 bg-[#080808] relative overflow-hidden">
    {/* Ambient glow */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

    <div className="relative max-w-5xl mx-auto px-4 sm:px-6">

      {/* Header */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="text-center mb-12"
      >
        <span className="inline-flex items-center gap-2 text-orange-500 font-bold uppercase tracking-[0.25em] text-[11px] mb-5">
          <span className="w-8 h-px bg-gradient-to-r from-transparent to-orange-500" />
          Bukti Nyata
          <span className="w-8 h-px bg-gradient-to-l from-transparent to-orange-500" />
        </span>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-2">
          INI BUKTI NYATA
        </h2>
        <p className="text-base sm:text-lg text-neutral-400 max-w-xl mx-auto leading-relaxed">
          kalau gw beneran komit dan latihan dengan{' '}
          <strong className="text-orange-500">SERIUS</strong> buat bentukin OTOT —{' '}
          <strong className="text-white">GA SEKEDAR OMONG KOSONG!</strong>
        </p>

        {/* Decorative line */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-orange-500/60" />
          <div className="w-2 h-2 rounded-full bg-orange-500" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-orange-500/60" />
        </div>
      </motion.div>

      {/* Video masonry grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="columns-2 sm:columns-3 gap-3 sm:gap-4 space-y-3 sm:space-y-4"
      >
        {GYM_VIDEOS.map((video, i) => (
          <motion.div
            key={i}
            variants={fadeInUp}
            className="break-inside-avoid rounded-2xl overflow-hidden relative group"
            style={{
              background: 'linear-gradient(135deg, rgba(249,115,22,0.2) 0%, rgba(255,255,255,0.03) 100%)',
              padding: '1px',
            }}
          >
            <div className="rounded-2xl overflow-hidden bg-[#111111] relative">
              <video
                ref={el => videoRefs.current[i] = el}
                loop
                muted
                playsInline
                preload="none"
                className="w-full object-cover"
                style={{ aspectRatio: video.orientation === 'vertical' ? '9/16' : '16/9', background: '#1a1a1a' }}
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>
        ))}
      </motion.div>

    </div>
  </section>
  );
};

// Social Proof Section
const SocialProofSection = () => (
  <section id="hasil" data-testid="social-proof-section" className="py-10 sm:py-14 bg-[#0D0D0D]">
    <div className="max-w-lg mx-auto px-5 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="text-center mb-8 sm:mb-10">
          <span className="inline-block text-orange-500 font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-xs sm:text-sm mb-3 sm:mb-4">
            Hasil Nyata
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
            Ini Bukan Janji. <span className="text-orange-500">Ini Bukti.</span>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base">
            58kg → 65kg dalam 3–4 bulan.
          </p>
        </motion.div>

        <motion.div variants={fadeInUp} className="flex flex-col gap-3">
          {/* BEFORE */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10">
            <img
              src="/before.webp"
              alt="Before transformation - November 58kg"
              loading="lazy" className="w-full object-cover grayscale"
              style={{ aspectRatio: '4/5' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <span className="inline-block bg-white/10 backdrop-blur-sm text-neutral-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                Sebelum · Nov 2025 · 58 kg
              </span>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center gap-3 py-1">
            <div className="flex-1 h-px bg-white/10" />
            <div className="flex flex-col items-center gap-0.5">
              <ChevronDown className="w-5 h-5 text-orange-500" />
              <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">3–4 Bulan</span>
              <ChevronDown className="w-5 h-5 text-orange-500" />
            </div>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* AFTER */}
          <div className="relative rounded-2xl overflow-hidden border border-orange-500/30">
            <img
              src="/after.webp"
              alt="After transformation - February 65kg"
              className="w-full object-cover"
              style={{ aspectRatio: '4/5' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <span className="inline-block bg-orange-500/20 backdrop-blur-sm text-orange-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-orange-500/30">
                Sesudah · Feb 2026 · 65 kg
              </span>
            </div>
          </div>

          {/* Caption */}
          <motion.div variants={fadeInUp} className="mt-4 bg-[#1A1A1A] border border-white/10 rounded-xl p-5">
            <p className="text-neutral-400 text-sm">
              Hampir 4 tahun gw latihan tapi otot gw gak kemana-mana. Begitu 3 pilar gw jalanin bareng, hasilnya keliatan dalam <strong className="text-orange-500">kurang dari 3 bulan.</strong>
            </p>
            <p className="text-white font-semibold text-sm mt-3">
              Ini yang mau gw share ke lo.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// Value Stack Section
const ValueStackSection = () => {
  const valueItems = [
    { item: "3 Pillar Train. Eat. Sleep. Course", value: "Rp1.000.000" },
    { item: "Cenfits VIP Community", value: "Rp999.999" },
    { item: "3–5x Per Week WO Program", value: "Rp750.000" },
    { item: "Spotify Playlist Testo Booster", value: "Rp599.999" },
    { item: "VIP Group Coaching", value: "Rp1.500.000" }
  ];

  return (
    <section data-testid="value-stack-section" className="py-10 sm:py-14 bg-[#111111]">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-10 sm:mb-12">
            <span className="inline-block text-orange-500 font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-xs sm:text-sm mb-3 sm:mb-4">
              Bonus Eksklusif
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
              Yang Akan Lo Dapatkan Ketika Bergabung
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base">
              Gak hanya course , ada bonus eksklusif yang ikut masuk.
            </p>
          </motion.div>
          
          <motion.div 
            variants={fadeInUp}
            className="bg-[#1A1A1A] border border-white/10 rounded-xl overflow-hidden"
          >
            <table className="value-table">
              <thead>
                <tr className="border-b border-white/10">
                  <th>Item</th>
                  <th className="text-right">Nilai</th>
                </tr>
              </thead>
              <tbody>
                {valueItems.map((row, index) => (
                  <tr key={index}>
                    <td className="text-white flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                      <span>{row.item}</span>
                    </td>
                    <td className="text-right text-neutral-400 text-sm sm:text-base whitespace-nowrap">{row.value}</td>
                  </tr>
                ))}
                <tr className="bg-orange-500/10">
                  <td className="text-white font-bold text-sm sm:text-base">Total Value</td>
                  <td className="text-right text-orange-500 font-bold text-lg sm:text-xl">Rp4.849.998</td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Countdown hook — deadline resets every 48h stored in localStorage
const useCountdown = () => {
  const getDeadline = () => {
    const stored = localStorage.getItem('_3pm_dl_24');
    if (stored) {
      const t = parseInt(stored);
      if (t > Date.now()) return t;
    }
    const deadline = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem('_3pm_dl_24', String(deadline));
    return deadline;
  };

  const [deadline] = React.useState(getDeadline);
  const [timeLeft, setTimeLeft] = React.useState({ h: '00', m: '00', s: '00' });

  React.useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, deadline - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({
        h: String(h).padStart(2, '0'),
        m: String(m).padStart(2, '0'),
        s: String(s).padStart(2, '0'),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  return timeLeft;
};

// Live viewer count — random between 14-27, drifts slowly
const useLiveCount = () => {
  const [count, setCount] = React.useState(() => Math.floor(Math.random() * 14) + 14);
  React.useEffect(() => {
    const id = setInterval(() => {
      setCount(c => {
        const delta = Math.random() < 0.5 ? 1 : -1;
        return Math.min(27, Math.max(14, c + delta));
      });
    }, 4500);
    return () => clearInterval(id);
  }, []);
  return count;
};

// Pricing Section
const PricingSection = () => {
  const [paymentOpen, setPaymentOpen] = React.useState(false);
  const { h, m, s } = useCountdown();
  const liveCount = useLiveCount();

  return (
    <section id="harga" data-testid="pricing-cta-section" className="py-10 sm:py-14 bg-[#0D0D0D]">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} id="early-bird" className="text-center mb-6 sm:mb-8">
            <p className="text-neutral-400 text-base sm:text-lg mb-2">
              Gw gak minta lo bayar hampir <strong className="text-white">Rp5 juta</strong>.
            </p>
            <p className="text-neutral-400 text-base sm:text-lg">
              Bahkan gak setengahnya.
            </p>
            <p className="text-white text-lg sm:text-xl mt-3 sm:mt-4">
              Khusus buat lo yang daftar sekarang di harga early bird:
            </p>
          </motion.div>

          {/* FOMO bar */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
              <span className="text-red-400 text-xs font-bold">{liveCount} orang lagi lihat halaman ini sekarang</span>
            </div>
            <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-2">
              <Zap className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
              <span className="text-orange-400 text-xs font-bold">Harga naik setelah slot ini penuh</span>
            </div>
          </motion.div>

          <motion.div
            variants={fadeInScale}
            className="pricing-card animate-pulse-glow"
          >
            <div className="text-center">
              <span className="inline-flex items-center bg-orange-500 text-black font-bold text-[10px] sm:text-xs uppercase tracking-wider px-3 py-1.5 rounded-full mb-4 sm:mb-5">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                HARGA EARLY BIRD · TERBATAS!
              </span>

              {/* Countdown */}
              <div className="mb-4 sm:mb-5">
                <p className="text-neutral-500 text-xs uppercase tracking-widest mb-2">Harga ini berakhir dalam</p>
                <div className="flex items-center justify-center gap-2">
                  {[{ v: h, label: 'Jam' }, { v: m, label: 'Menit' }, { v: s, label: 'Detik' }].map(({ v, label }, i) => (
                    <React.Fragment key={label}>
                      <div className="flex flex-col items-center">
                        <div className="bg-[#111] border border-orange-500/30 rounded-xl w-14 sm:w-16 py-2 sm:py-3">
                          <span className="text-orange-500 font-black text-2xl sm:text-3xl tabular-nums">{v}</span>
                        </div>
                        <span className="text-neutral-600 text-[10px] mt-1 uppercase tracking-widest">{label}</span>
                      </div>
                      {i < 2 && <span className="text-orange-500 font-black text-2xl mb-4">:</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="mb-5 sm:mb-6">
                <div className="flex items-center gap-3 mb-1 sm:mb-2 align-center justify-center">
                  <p className="text-neutral-500 text-lg sm:text-xl line-through">Rp4.849.998</p>
                  <span className="bg-orange-500 text-black text-xs font-black px-2 py-0.5 rounded-full">94% OFF</span>
                </div>
                <p className="text-4xl sm:text-5xl md:text-6xl font-black text-white">
                  Rp<span className="text-orange-500">279.000</span>
                </p>
              </div>

              <motion.button
                onClick={() => setPaymentOpen(true)}
                className="cta-button cta-button-large w-full mb-4 sm:mb-5 group"
                data-testid="pricing-cta-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Daftar Sekarang · Rp279.000
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              {/* Urgency note */}
              <div className="bg-[#111111] rounded-lg p-3 sm:p-4 mb-5 sm:mb-6 border border-orange-500/10">
                <p className="text-orange-500 font-semibold flex items-center justify-center gap-2 text-sm sm:text-base">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span>Harga ini akan naik seiring bertambahnya member dan update konten.</span>
                </p>
                <p className="text-neutral-400 text-xs sm:text-sm mt-2 leading-relaxed">
                  Ke depannya, 3PM System beralih ke <strong className="text-white">sistem membership</strong> — 3 bulan, 6 bulan, atau 1 tahun. Lifetime access akan tembus jutaan.{' '}
                  <br></br>
                  <br></br>
                  <strong className="text-orange-400">Tapi lo yang join sekarang? Cukup Rp279.000. Satu kali bayar untuk life-time akses. </strong>{' '}
                  
                  <br></br>
                  Plus VIP Group Coaching, akses tanya private, dan semua update konten — tetap di harga hari ini. 
                  <br></br>
                  <br></br>{' '}
                  <strong className="text-white">Pintu ini tidak akan selamanya terbuka di harga ini.</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-2 text-neutral-400">
                  <Shield className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span>Lifetime access</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-400">
                  <TrendingUp className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span>Konten terus diupdate</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-400">
                  <Users className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span>VIP Community</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-400">
                  <Zap className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span>Harga naik setelah ini</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <PaymentModal isOpen={paymentOpen} onClose={() => setPaymentOpen(false)} />
    </section>
  );
};

// FAQ Section
const FAQSection = () => {
  const faqs = [
    {
      question: "Cocok buat siapa course ini?",
      answer: "Course ini dirancang khusus untuk pemula gym yang masih struggle dan bingung mau mulai dari mana. Selama lo serius mau bentukin otot dan konsisten jalanin 3 pilar ini, lo cocok."
    },
    {
      question: "Kenapa harganya bisa semurah ini?",
      answer: "Ini adalah harga early bird. Semakin banyak member masuk dan konten diupdate, harga akan naik secara bertahap. Lo yang daftar sekarang dapat harga paling bawah dengan akses paling lengkap."
    },
    {
      question: "Dalam berapa lama hasilnya mulai keliatan?",
      answer: "Target utamanya adalah 3 bulan otot sudah mulai terbentuk secara visible, selama 3 pilar dijalanin dengan konsisten. Beberapa orang bisa lebih cepat tergantung kondisi awal."
    },
    {
      question: "Gimana kalau gw stuck atau ada pertanyaan?",
      answer: "Lo bisa langsung tanya di Cenfits VIP Community dan VIP Group Coaching. Pertanyaan seputar pembentukan otot akan dijawab secara personal."
    },
    {
      question: "Apakah perlu suplemen mahal?",
      answer: "Tidak wajib. Course ini mengajarkan cara bentukin otot dengan makanan sehari-hari dulu. Suplemen hanya disarankan sebagai tambahan buat yang budgetnya memang ada."
    },
    {
      question: "Gimana akses course-nya?",
      answer: "Setelah daftar, lo langsung dapat akses ke seluruh materi. Aksesnya lifetime , termasuk semua update konten dan design ke depannya."
    }
  ];

  return (
    <section id="faq" data-testid="faq-accordion-section" className="py-10 sm:py-14 bg-[#111111]">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-10 sm:mb-12">
            <span className="inline-block text-orange-500 font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-xs sm:text-sm mb-3 sm:mb-4">
              FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              Frequently Asked Questions
            </h2>
          </motion.div>
          
          <motion.div variants={fadeInUp}>
            <Accordion type="single" collapsible className="space-y-2 sm:space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="faq-item border-0 data-[state=open]:border-l-3 data-[state=open]:border-l-orange-500"
                  data-testid={`faq-item-${index}`}
                >
                  <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-4 text-left text-white font-semibold hover:no-underline hover:text-orange-500 transition-colors text-sm sm:text-base">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 sm:px-6 pb-3 sm:pb-4 text-neutral-400 text-sm sm:text-base leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Penting Carousel
const PENTING_PHOTOS = [
  '/penting-1.webp',
  '/penting-2.webp',
  '/penting-3.webp',
  '/penting-4.webp',
];

const PentingCarousel = () => {
  const [activeItem, setActiveItem] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const wrapperRef = useRef(null);
  const timeoutRef = useRef(null);
  const touchStartX = useRef(null);
  const total = PENTING_PHOTOS.length;

  // Desktop accordion transition
  useEffect(() => {
    if (!wrapperRef.current) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    wrapperRef.current.style.setProperty('--transition', '600ms cubic-bezier(0.22, 0.61, 0.36, 1)');
    timeoutRef.current = setTimeout(() => {
      wrapperRef.current?.style.removeProperty('--transition');
    }, 900);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [activeItem]);

  const changeMobile = (i) => setMobileIndex((i + total) % total);
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) changeMobile(diff > 0 ? mobileIndex + 1 : mobileIndex - 1);
    touchStartX.current = null;
  };

  return (
    <div className="w-full mt-10">
      {/* Mobile: slide carousel */}
      <div className="md:hidden">
        <div
          className="overflow-hidden rounded-2xl"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="flex"
            style={{ transform: `translateX(-${mobileIndex * 100}%)`, transition: 'transform 0.45s ease' }}
          >
            {PENTING_PHOTOS.map((src, i) => (
              <div key={i} className="w-full flex-shrink-0" style={{ aspectRatio: '3/4' }}>
                <img src={src} alt={`Vincent foto ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 mt-4">
          <button onClick={() => changeMobile(mobileIndex - 1)} aria-label="Sebelumnya"
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-1.5">
            {PENTING_PHOTOS.map((_, i) => (
              <button key={i} onClick={() => changeMobile(i)} aria-label={`Foto ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${mobileIndex === i ? 'w-5 bg-orange-500' : 'w-1.5 bg-white/20 hover:bg-white/40'}`} />
            ))}
          </div>
          <button onClick={() => changeMobile(mobileIndex + 1)} aria-label="Selanjutnya"
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Desktop: accordion expand */}
      <ul ref={wrapperRef} className="hidden md:flex w-full h-[480px] gap-[1.5%]">
        {PENTING_PHOTOS.map((src, index) => (
          <li
            key={index}
            onClick={() => setActiveItem(index)}
            aria-current={activeItem === index}
            className={['relative cursor-pointer rounded-2xl overflow-hidden', activeItem === index ? '!w-[73%]' : 'w-[8%]'].join(' ')}
            style={{ transition: 'width var(--transition, 300ms ease-in)' }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[#1a1a1a] shadow-2xl">
              <img
                src={src}
                alt={`Vincent foto ${index + 1}`}
                className={['absolute left-1/2 top-1/2 h-full w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-cover transition-all duration-500 ease-in-out', activeItem === index ? 'scale-105 grayscale-0' : 'scale-100 grayscale'].join(' ')}
                loading="lazy"
                onError={e => { e.target.style.display = 'none'; }}
              />
              <div className={['absolute inset-0 transition-opacity duration-500 bg-gradient-to-t from-black/60 via-transparent to-transparent', activeItem === index ? 'opacity-100' : 'opacity-0'].join(' ')} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Penting Section
const PentingSection = () => (
  <section data-testid="penting-section" className="py-10 sm:py-14 bg-[#0D0D0D]">
    <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
      >
        <motion.div
          variants={fadeInUp}
          className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 px-4 py-2 rounded-full mb-6"
        >
          <span className="text-orange-500 font-black text-sm sm:text-base tracking-widest uppercase">PENTING!</span>
        </motion.div>

        <motion.h2
          variants={fadeInUp}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6"
        >
          Program 3PM System Ini <span className="text-orange-500">Gak Main-Main.</span>
        </motion.h2>

        <motion.div variants={fadeInUp} className="space-y-4 text-base sm:text-lg text-neutral-400 leading-relaxed mb-8">
          <p>
            Lo udah buang berapa lama coba-coba metode yang katanya works, tapi otot lo jalan di tempat?{' '}
            <strong className="text-white">Sebulan? Enam bulan? Lebih?</strong>
          </p>
          <p>
            Well... <strong className="text-white">Ini bukan salah lo.</strong> Lo cuma belum punya sistem yang beneran sesuai sama cara kerja tubuh lo sendiri.
          </p>
          <p>
            3PM System dibikin dari <strong className="text-orange-500">3 prinsip sederhana</strong>: latihan, makan, dan tidur yang selaras sama fisiologi tubuh lo, bukan yang di-hype sama influencer.
          </p>
          <p>
            Semua materi dibangun dari <strong className="text-white">experience gw selama 4 tahun</strong>, trial-error yang udah gw lakuin duluan, supaya lo gak perlu ngerasain yang sama &amp; hemat waktu.
          </p>
        </motion.div>

        <motion.div variants={fadeInUp} className="bg-[#1A1A1A] border border-white/10 rounded-xl p-6 sm:p-8">
          <p className="text-white font-semibold text-base sm:text-lg mb-5">Begitu lo jalanin 3 pilar ini secara bersamaan, yang bakal berubah:</p>
          <ul className="space-y-3">
            {[
              "Lo akhirnya tau cara latihan yang bener kayak gimana.",
              "Lo gak bakal overthinking soal makan lagi karena lo udah tau pola yang simpel tapi efektif buat support muscle growth.",
              "Lo bisa optimize kualitas tidur lo buat recovery otot.",
              "Lo ga buang waktu lagi cuman buat scroll konten gym yang cuman bikin lo makin bingung.",
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-neutral-300 text-sm sm:text-base">
                <div className="bg-orange-500/20 p-1 rounded mt-0.5 flex-shrink-0">
                  <Check className="w-4 h-4 text-orange-500" />
                </div>
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-white font-semibold text-base sm:text-lg">
            3 bulan dari sekarang, lo ngaca dan ngeliat perubahan yang selama ini lo kejar.
          </p>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <PentingCarousel />
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// Curriculum Section
const CURRICULUM = [
  {
    number: null,
    label: 'INTRO',
    title: 'Introduction',
    desc: 'Sebelum lo mulai ke chapter-chapter lain, lo wajib nonton ini dulu, biar lo paham tujuan course ini untuk apa.',
    photo: '/intro-philip.webp',
    fullWidth: true,
  },
  {
    number: 1,
    title: 'Have This MINDSET',
    desc: 'Lo bakal belajar kenapa mayoritas pemula gagal bukan karena kurang latihan, tapi karena punya mindset yang salah dari awal. Di sini lo bakal di-reset cara lo mikir soal proses, konsistensi, dan ekspektasi hasil supaya progress gym lo lebih maksimal.',
    photo: '/ch1-philip.webp',
  },
  {
    number: 2,
    title: 'Nutrition For Muscle & Testosterone',
    desc: 'Lo bakal tau makanan apa yang beneran support pertumbuhan otot lo, bukan sekadar "makan banyak protein". Di materi ini gw bakalan breakdown supaya simpel dan bisa langsung lo aplikasiin hari ini.',
    photo: '/ch2-philip.webp',
  },
  {
    number: 3,
    title: 'Simple Cooking 140–145gr Protein',
    desc: 'Gak perlu pusing ngitung kalori tiap hari. Lo bakalan liat cara gw masak makanan high protein & low budget.',
    photo: '/ch3-philip.webp',
  },
  {
    number: 4,
    title: 'How To Build Your Muscle',
    desc: 'Ini inti dari semuanya. Lo bakal belajar cara latihan yang beneran ngasih sinyal ke otot lo untuk tumbuh bukan cuma capek-capekkan. Dari teknik, volume, sampai progressive overload yang bisa lo jalanin sendiri tanpa personal trainer.',
    photo: '/ch4-philip.webp',
  },
  {
    number: 5,
    title: 'Split Gym 3–5x/Week Program',
    desc: 'Lo langsung dapet program latihan yang udah gw rancang dan tinggal ikutin. Gak perlu bingung hari ini latihan apa, otot mana yang harus diistirahatkan, atau urutan latihannya gimana.',
    photo: '/ch5-program.webp',
  },
  {
    number: 6,
    title: 'FINAL – Your Next Step',
    desc: 'Setelah lo selesai semua materi, lo bakal tau langkah selanjutnya yang harus lo ambil supaya progres lo gak berhenti di sini. Karena tujuannya bukan cuma selesaiin course, tapi lo beneran berubah.',
    photo: '/ch6-philip.webp',
  },
];

const CurriculumSection = () => (
  <section className="py-10 sm:py-14 bg-[#080808]">
    <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center mb-10">
          <span className="inline-flex items-center gap-2 text-orange-500 font-bold uppercase tracking-[0.25em] text-[11px] mb-4">
            <span className="w-6 h-px bg-orange-500/60" />
            Isi Course
            <span className="w-6 h-px bg-orange-500/60" />
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
            Yang Lo Pelajari <span className="text-orange-500">Di Dalam</span>
          </h2>
          <p className="text-neutral-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Semua bisa lo pahami bahkan gak perlu 2 jam — kalau lo 100% fokus. Pure dari experience gw yang <strong className="text-orange-500">valuenya ratusan juta</strong>.
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {CURRICULUM.map((item) => (
            <motion.div
              key={item.number ?? item.label}
              variants={fadeInUp}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className={`group rounded-2xl p-px shadow-[0_16px_48px_rgba(0,0,0,0.5)] transition-shadow duration-300 hover:shadow-[0_16px_48px_rgba(249,115,22,0.12)] ${item.fullWidth ? 'sm:col-span-2' : ''}`}
              style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.3) 0%, rgba(255,255,255,0.04) 50%, rgba(249,115,22,0.08) 100%)' }}
            >
              <div className={`rounded-2xl overflow-hidden bg-[#111111] h-full ${item.fullWidth ? 'flex flex-col sm:flex-row' : 'flex flex-col'}`}>

                {/* Photo */}
                <div className={`relative overflow-hidden ${item.fullWidth ? 'sm:w-2/5 flex-shrink-0' : ''}`}>
                  {/* Watermark chapter number */}
                  <span
                    className="absolute top-0 right-2 font-black leading-none select-none pointer-events-none z-10 opacity-10"
                    style={{ fontSize: '88px', color: '#F97316', fontFamily: 'Montserrat, sans-serif', lineHeight: 1 }}
                  >
                    {item.number !== null ? String(item.number).padStart(2, '0') : ''}
                  </span>

                  <img
                    src={item.photo}
                    alt={item.title}
                    loading="lazy"
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ aspectRatio: item.fullWidth ? '4/3' : '16/9', height: item.fullWidth ? '100%' : undefined }}
                  />
                  {/* Dark overlay + blur for lock effect */}
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-black/20 to-transparent" />

                  {/* Lock icon center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                        <Lock className="w-5 h-5 text-white/80" />
                      </div>
                      <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Locked</span>
                    </div>
                  </div>

                  {/* Chapter tag bottom-left */}
                  <div className="absolute bottom-3 left-3">
                    <span className="inline-flex items-center gap-1.5 bg-orange-500 text-black text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg">
                      <Flame className="w-2.5 h-2.5" />
                      {item.number !== null ? `Chapter ${item.number}` : (item.label || 'Intro')}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className={`flex-1 px-5 pt-4 pb-5 ${item.fullWidth ? 'flex flex-col justify-center sm:py-8 sm:px-8' : ''}`}>
                  {/* Orange gradient divider */}
                  <div className="h-px w-full bg-gradient-to-r from-orange-500/60 via-orange-500/20 to-transparent mb-4" />
                  <h3 className={`text-white font-black mb-2.5 leading-snug ${item.fullWidth ? 'text-xl sm:text-2xl' : 'text-base sm:text-[17px]'}`}>{item.title}</h3>
                  <p className={`text-neutral-500 leading-relaxed ${item.fullWidth ? 'text-base' : 'text-sm'}`}>{item.desc}</p>
                </div>

              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// Testimonials Section
const TestimonialPhotoSlider = ({ photos, name }) => {
  const [current, setCurrent] = useState(0);
  const dragStartX = useRef(null);

  useEffect(() => {
    if (photos.length <= 1) return;
    const t = setInterval(() => setCurrent(p => (p + 1) % photos.length), 3000);
    return () => clearInterval(t);
  }, [photos.length]);

  const next = () => setCurrent(p => (p + 1) % photos.length);
  const prev = () => setCurrent(p => (p - 1 + photos.length) % photos.length);

  const onTouchStart = (e) => { dragStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (dragStartX.current === null) return;
    const diff = dragStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 30) diff > 0 ? next() : prev();
    dragStartX.current = null;
  };

  return (
    <div className="w-36 sm:w-44 shrink-0">
      <div
        className="relative overflow-hidden rounded-lg bg-neutral-900 cursor-grab active:cursor-grabbing"
        style={{ aspectRatio: '3/4' }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={photos[current]}
            alt={`${name} foto ${current + 1}`}
            className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          />
        </AnimatePresence>
        <button onClick={prev} className="absolute left-0 top-0 h-full w-1/2 z-10" aria-label="prev" />
        <button onClick={next} className="absolute right-0 top-0 h-full w-1/2 z-10" aria-label="next" />
      </div>
      <div className="flex items-center justify-center gap-1 mt-1.5">
        {photos.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            aria-label={`Foto ${i + 1}`}
            className={`rounded-full transition-all duration-200 ${i === current ? 'w-4 h-1 bg-orange-500' : 'w-1 h-1 bg-white/20'}`} />
        ))}
      </div>
    </div>
  );
};

const TESTIMONIALS = [
  {
    name: "Andrybern Arvind",
    instagram: "@andrybern.arvind",
    photos: ['/testi1-1.webp', '/testi1-2.webp', '/testi1-3.webp'],
    badge: "Best Investment",
    quote: "4 tahun gym, tapi sempet stuck karena ngerasa udah ngerti semuanya. Ternyata gua masih belum terlalu ngerti. Setelah konsultasi sama Vincent, gua jadi sadar kalau masih banyak blind spot dari nutrisi, training, sampai recovery. Dari sana progress gua mulai naik dan jujur aja gw happy sih Tapi gila sih, dari harga coursenya Vincent itu udah murah banget dari value yang dia punya, I would say ini bakalan jadi the best Investment buat pemula yang baru mau mulai journey nya sih.",
  },
  {
    name: "Seprianto",
    instagram: "@achensep",
    photos: ['/testi2-1.webp', '/testi2-2.webp', '/testi2-3.webp'],
    badge: "100% Worth It",
    quote: "Gila sih pas gw sebelum sama bro Vincent & sesudah, hasilnya bener bener keliatan, orangnya enak kalau diajak ngobrol kalau ada masalah, orangnya gercep dan langsung bisa jawab buat bantu nyelesaiin struggle nya gw, isi materinya semuanya ga banyak teori dan bisa langsung eksekusi, well gw ga bakalan nyesel kalau sama bro Vincent ini 100% worth it kalau masih pemula.",
  },
  {
    name: "Hendra Putra",
    instagram: "@hendptr_",
    photos: ['/testi3-1.webp', '/testi3-2.webp', '/testi3-3.webp'],
    badge: "120kg → 70kg",
    quote: "Gw ex 120kg dan gym bareng Vincent, gw masih inget dulu sering dipaksa sama Vincent buat ngegym, tapi yang gw ga expect adalah gw bisa nurunin BB sampai 70ankg semenjak dilatih sama Vincent, gw abis purchase coursenya, ini bisa dibilang course paling worth it buat pemula, kalau bingung harus mulai darimana, bisa langsung tanya bro Vincent ini, gila sih...",
  },
  {
    name: "Ryanso",
    instagram: "@ryansozzz",
    photos: ['/testi4-1.webp', '/testi4-2.webp', '/testi4-3.webp'],
    badge: "Terstruktur",
    quote: "Honestly, blueprintnya berguna banget dan sangat gampang di ikuti sih. Overall gw suka, terutama cara breakdown dari materinya yang dimana sangat rapi, jelas, to the point, dan tidak memberikan tips yang abal-abal. Dengan ini, perjalanan muscle buildingku menjadi lebih terstruktur dan tidak membingungkan. Gaya bahasanya juga keren gess 💪",
  },
  {
    name: "Joss feliciano",
    instagram: "@jossf._",
    photos: ['/testi5-1.webp', '/testi5-2.webp'],
    badge: "Lifetime Access",
    quote: "Tbh, ini bagus banget buat pemula pemula yang bener bener baru mau mulai ngegym, apalagi disana ada VIP community dari course ini lifetime, jadi bisa tanya kapanpun yang gw mau sih, isi materinya semuanya udah jelas juga & apa yang dibutuhkan sama pemula juga udah disiapin sama coach Vincent ini, well, sisanya tergantung orang yang join niat atau engga aja si",
  },
];

const TestimonialsSection = () => (
  <section data-testid="testimonials-section" className="py-10 sm:py-14 bg-[#111111]">
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}>

        <motion.div variants={fadeInUp} className="text-center mb-10 sm:mb-14">
          <span className="inline-block text-orange-500 font-bold uppercase tracking-[0.2em] text-xs sm:text-sm mb-3">
            Real Results
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
            Kata Mereka yang Sudah <span className="text-orange-500">Membuktikan</span>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto">
            Bukan janji — ini hasil nyata dari member yang udah jalanin metode 3PM System.
          </p>
        </motion.div>

        <div className="flex flex-col gap-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 flex gap-4"
            >
              {/* Foto slider di kiri */}
              <TestimonialPhotoSlider photos={t.photos} name={t.name} />

              {/* Teks di kanan */}
              <div className="flex flex-col justify-between flex-1 min-w-0">
                <div>
                  <p className="text-white font-bold text-sm mb-0.5">{t.name}</p>
                  <p className="text-orange-400 text-xs mb-2">{t.instagram}</p>
                  {t.quote ? (
                    <p className="text-neutral-400 text-base leading-relaxed line-clamp-6">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  ) : (
                    <p className="text-neutral-600 italic text-xs">[ Testimoni segera hadir ]</p>
                  )}
                </div>
                {t.badge && (
                  <span className="mt-3 inline-block self-start bg-orange-500 text-black text-[10px] font-black uppercase tracking-wide px-3 py-1 rounded-full">
                    {t.badge}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </motion.div>
    </div>
  </section>
);

// Final CTA Section
const FinalCTASection = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-t from-orange-500/10 to-[#0D0D0D]">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-4"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Jangan Buang 4 Tahun <span className="text-orange-500">Kayak Gw Dulu.</span>
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            className="text-base sm:text-lg text-neutral-400 mb-6"
          >
            Mulai bentukin otot dengan fondasi yang bener , sekarang.
          </motion.p>
          <motion.button 
            variants={fadeInUp}
            onClick={() => scrollToSection('harga')}
            className="cta-button group"
            data-testid="final-cta-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Daftar Sekarang · Rp279.000
            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

// About Us Section
const AboutSection = () => (
  <section className="py-12 sm:py-16 bg-[#0D0D0D]">
    <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        {/* Label */}
        <motion.div variants={fadeInUp} className="mb-10">
          <span className="inline-flex items-center gap-2 text-orange-500 font-bold uppercase tracking-[0.25em] text-[11px] mb-5">
            <span className="w-6 h-px bg-orange-500/60" />
            About Us
            <span className="w-6 h-px bg-orange-500/60" />
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">
            Apa Itu <span className="text-orange-500">3PM System?</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Left — main description */}
          <motion.div variants={fadeInUp} className="space-y-4 text-neutral-400 text-sm sm:text-base leading-relaxed">
            <p>
              <strong className="text-white">3PM (Pillar Muscle) System</strong> adalah program berbasis 3 pilar utama yang dirancang khusus buat lo yang masih pemula dan bingung harus mulai dari mana untuk bentukin otot.
            </p>
            <p>
              Ini bukan sekedar kumpulan tips dari internet doang. Bukan program copy-paste dari influencer gym. Ini sistem yang dibangun dari <strong className="text-orange-500">4 tahun pengalaman</strong> — dikemas simpel, terstruktur, dan langsung bisa lo jalanin.
            </p>

            {/* Train Eat Sleep badge */}
            <div className="flex items-center gap-3 py-4 px-5 rounded-2xl bg-[#111111] border border-white/6 my-2">
              {['Train', 'Eat', 'Sleep'].map((word, i) => (
                <React.Fragment key={i}>
                  <span className="text-white font-black text-base sm:text-lg">{word}</span>
                  {i < 2 && <span className="text-orange-500 font-black">·</span>}
                </React.Fragment>
              ))}
            </div>

            <p>
              Tiga hal yang kedengarannya basic, tapi kalau lo jalanin dengan cara yang beneran sesuai sama fisiologi tubuh lo, hasilnya beda jauh. 3PM System ngajarin lo gimana ketiga pilar ini bekerja secara bersamaan supaya otot lo punya kondisi terbaik untuk tumbuh.
            </p>
          </motion.div>

          {/* Right — Buat siapa */}
          <motion.div variants={fadeInUp}>
            <div className="rounded-2xl overflow-hidden h-full"
              style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(255,255,255,0.02) 100%)', padding: '1px' }}
            >
              <div className="rounded-2xl bg-[#111111] p-5 sm:p-6 h-full">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <Target className="w-3.5 h-3.5 text-black" />
                  </div>
                  <h3 className="text-white font-black text-base">Buat Siapa Ini?</h3>
                </div>
                <ul className="space-y-3.5">
                  {[
                    'Lo yang udah coba berbagai cara tapi otot lo jalan di tempat.',
                    'Lo yang overwhelmed sama terlalu banyak informasi dan gak tau mana yang beneran works.',
                    'Lo yang mau hasil nyata tapi gak punya budget buat hire personal trainer.',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-neutral-400 text-sm leading-relaxed">
                      <div className="w-5 h-5 rounded-full bg-orange-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-orange-500" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  </section>
);

// Footer
const Footer = () => {
  const [aboutOpen, setAboutOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0A0A0A] relative overflow-hidden">
      {/* About Us Modal */}
      <AnimatePresence>
        {aboutOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={() => setAboutOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setAboutOpen(false)}
            >
              <div className="w-full max-w-lg rounded-2xl overflow-hidden bg-[#111111] border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/8">
                  <div>
                    <span className="text-orange-500 text-[10px] font-bold uppercase tracking-widest">Tentang</span>
                    <h3 className="text-white font-black text-lg">Apa Itu 3PM System?</h3>
                  </div>
                  <button onClick={() => setAboutOpen(false)} className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center hover:bg-white/15 transition-colors">
                    <span className="text-white text-sm font-bold">✕</span>
                  </button>
                </div>
                <div className="px-6 py-5 space-y-4 text-neutral-400 text-sm leading-relaxed overflow-y-auto" style={{ maxHeight: 'calc(80vh - 80px)' }}>
                  <p><strong className="text-white">3PM (Pillar Muscle) System</strong> adalah program berbasis 3 pilar utama yang dirancang khusus buat lo yang masih pemula dan bingung harus mulai dari mana untuk bentukin otot.</p>
                  <p>Ini bukan sekedar kumpulan tips dari internet doang. Bukan program copy-paste dari influencer gym. Ini sistem yang dibangun dari <strong className="text-orange-500">4 tahun pengalaman</strong> — dikemas simpel, terstruktur, dan langsung bisa lo jalanin.</p>
                  <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                    {['Train', 'Eat', 'Sleep'].map((w, i) => (
                      <React.Fragment key={i}><span className="text-white font-black">{w}</span>{i < 2 && <span className="text-orange-500">·</span>}</React.Fragment>
                    ))}
                  </div>
                  <p>Tiga hal yang kedengarannya basic, tapi kalau lo jalanin dengan cara yang beneran sesuai sama fisiologi tubuh lo, hasilnya beda jauh.</p>
                  <div>
                    <p className="text-white font-semibold mb-2">Buat siapa ini?</p>
                    <ul className="space-y-2">
                      {['Lo yang udah coba berbagai cara tapi otot lo jalan di tempat.', 'Lo yang overwhelmed sama terlalu banyak informasi.', 'Lo yang mau hasil nyata tapi gak punya budget buat hire personal trainer.'].map((item, i) => (
                        <li key={i} className="flex items-start gap-2"><span className="text-orange-500 flex-shrink-0">—</span><span>{item}</span></li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Top gradient border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

      {/* Subtle background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-orange-500/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 pt-14 pb-8">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="bg-orange-500 p-1.5 rounded-lg">
                <Dumbbell className="w-4 h-4 text-black" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-white font-black text-lg tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>3PM System</span>
                <span className="text-orange-500 text-[9px] font-semibold tracking-widest uppercase">Train. Eat. Sleep.</span>
              </div>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-xs mb-6">
              Framework 3 pilar hadir untuk bantu pemula gym bentukin otot secara efektif, tanpa harus trial-and-error bertahun-tahun.
            </p>
            <button
              onClick={() => scrollToSection('harga')}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-black font-bold text-sm px-5 py-2.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/30"
            >
              <Zap className="w-3.5 h-3.5" />
              Mulai Sekarang
            </button>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Menu</h4>
            <ul className="space-y-3">
              {[
                { id: 'pillars', label: 'Program 3PM System' },
                { id: 'hasil', label: 'Hasil Nyata' },
                { id: 'harga', label: 'Harga' },
                { id: 'faq', label: 'FAQ' },
              ].map(({ id, label }) => (
                <li key={id}>
                  <button
                    onClick={() => scrollToSection(id)}
                    className="text-neutral-400 hover:text-orange-500 text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-orange-500/0 group-hover:text-orange-500 transition-colors -ml-1" />
                    {label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => setAboutOpen(true)}
                  className="text-neutral-400 hover:text-orange-500 text-sm transition-colors duration-200 flex items-center gap-2 group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-orange-500/0 group-hover:text-orange-500 transition-colors -ml-1" />
                  About Us
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Kontak</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:cenhfits@gmail.com"
                  className="text-neutral-400 hover:text-orange-500 text-sm transition-colors duration-200 flex items-center gap-2"
                >
                  <span className="text-orange-500">✉</span>
                  cenhfits@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/6282213939288"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-orange-500 text-sm transition-colors duration-200 flex items-center gap-2"
                >
                  <span className="text-orange-500">💬</span>
                  082213939288 (WA)
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/cenhfits"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-orange-500 text-sm transition-colors duration-200 flex items-center gap-2"
                >
                  <span className="text-orange-500">📸</span>
                  @cenhfits (Instagram)
                </a>
              </li>
              <li>
                <a
                  href="https://tiktok.com/@cenhfits"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-orange-500 text-sm transition-colors duration-200 flex items-center gap-2"
                >
                  <span className="text-orange-500">🎵</span>
                  @cenhfits (TikTok)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-neutral-600 text-xs">
            © 2026 3 Pillar Train. Eat. Sleep.. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="/terms" className="text-neutral-500 hover:text-orange-400 text-xs transition-colors">Syarat &amp; Ketentuan</a>
            <a href="/privacy" className="text-neutral-500 hover:text-blue-400 text-xs transition-colors">Kebijakan Privasi</a>
            <a href="/refund" className="text-neutral-500 hover:text-green-400 text-xs transition-colors">Kebijakan Refund</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main Landing Page Component
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#111111]" data-testid="landing-page">
      <Navigation />
      <HeroSection />
      <SocialProofSection />
      <TestimonialsSection />
      <PainPointsSection />
      <RealitaSection />
      <PersonalStorySection />
      <NaturalClaimBanner />
      <StorytellingSection />
      <ThreePillarsSection />
      <GymProofSection />
      <PentingSection />
      <CurriculumSection />
      <ValueStackSection />
      <PricingSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
