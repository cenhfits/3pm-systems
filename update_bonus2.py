with open('frontend/src/pages/Dashboard.jsx', 'r', encoding='utf-8') as f:
    src = f.read()

# ─── 1. Fix stray } on line 1229 ─────────────────────────────────────────────
src = src.replace("        {/* Bottom */}}\n        <div", "        {/* Bottom */}\n        <div")
print("Stray } fixed")

# ─── 2. Replace entire BonusView component + BONUSES data ─────────────────────
old_bonus_block = """// ── Bonus View ───────────────────────────────────────────────────────────────
const BONUSES = [
  {
    id: 'tracking',
    emoji: '📋',
    title: 'Self-Tracking System',
    subtitle: 'WO Operating System Template',
    description: 'Template spreadsheet lengkap untuk tracking workout, progress berat badan, dan kalori harian kamu.',
    type: 'download',
    href: '/bonus/tracking-system.pdf',
    cta: 'Download Template',
  },
  {
    id: 'community',
    emoji: '👥',
    title: 'VIP Community',
    subtitle: 'Exclusive Member Group',
    description: 'Join komunitas eksklusif member 3PM System. Tanya jawab langsung, sharing progress, dan support sesama member.',
    type: 'link',
    href: '#',
    cta: 'Join Community',
  },
  {
    id: 'spotify',
    emoji: '🎵',
    title: 'Testo Booster Playlist',
    subtitle: 'Spotify Playlist by CenhFits',
    description: 'Playlist musik pilihan untuk nemenin sesi gym kamu. Didesain buat boost energi dan fokus latihan.',
    type: 'link',
    href: '#',
    cta: 'Buka di Spotify',
  },
];

const BonusView = () => (
  <motion.div key="bonus" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
    <div className="mb-8">
      <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-1">Exclusive Member</p>
      <h2 className="text-2xl font-black text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Claim Your Bonus 🎁</h2>
      <p className="text-neutral-400 text-sm mt-1">3 bonus eksklusif khusus buat kamu sebagai member 3PM System.</p>
    </div>

    <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
      {BONUSES.map((b, i) => (
        <motion.a key={b.id} href={b.href} target="_blank" rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
          whileHover={{ y: -4 }}
          className="group bg-[#1A1A1A] border border-white/10 hover:border-orange-500/30 rounded-2xl p-6 flex flex-col gap-4 transition-colors duration-200 cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-2xl flex-shrink-0">
            {b.emoji}
          </div>
          <div className="flex-1">
            <p className="text-white font-bold text-base leading-snug">{b.title}</p>
            <p className="text-orange-400 text-xs font-semibold mt-0.5">{b.subtitle}</p>
            <p className="text-neutral-400 text-sm mt-3 leading-relaxed">{b.description}</p>
          </div>
          <div className="flex items-center gap-2 text-orange-400 text-sm font-semibold group-hover:gap-3 transition-all">
            {b.type === 'download' ? <Download className="w-4 h-4 flex-shrink-0" /> : <ExternalLink className="w-4 h-4 flex-shrink-0" />}
            {b.cta}
          </div>
        </motion.a>
      ))}
    </div>
  </motion.div>
);"""

new_bonus_block = r"""// ── Bonus View ───────────────────────────────────────────────────────────────
const TRACKING_CONTENT = [
  { type: 'image', src: '/bonus-philip.webp', alt: 'Philip Vasquez' },
  { type: 'callout', icon: '▶', text: 'Pelajari cara ngetrack latihan lo supaya progress lo terukur dan terarah.' },
  { type: 'video_embed', src: 'https://www.youtube.com/embed/E1VhXHmWRhs' },
  { type: 'link_card', href: 'https://www.notion.so/Workout-Tracker-BONUS-86349a76c91182b98b5d81dc031262f5', text: '📋 Akses Workout Tracker — BONUS' },
];

const BONUSES = [
  {
    id: 'tracking',
    gradient: 'from-blue-500/20 to-blue-500/5',
    border: 'border-blue-500/20 hover:border-blue-400/50',
    accent: 'text-blue-400',
    iconBg: 'bg-blue-500/10 border-blue-500/20',
    emoji: '📋',
    label: 'TEMPLATE',
    title: 'Self-Tracking System',
    subtitle: 'WO Operating System',
    description: 'Template lengkap untuk tracking workout, berat badan, dan kalori harian kamu — terstruktur dan mudah dipakai.',
    type: 'lesson',
    cta: 'Lihat Materi',
  },
  {
    id: 'community',
    gradient: 'from-purple-500/20 to-purple-500/5',
    border: 'border-purple-500/20 hover:border-purple-400/50',
    accent: 'text-purple-400',
    iconBg: 'bg-purple-500/10 border-purple-500/20',
    emoji: '👥',
    label: 'COMMUNITY',
    title: 'VIP Community',
    subtitle: 'Telegram Group Eksklusif',
    description: 'Join komunitas eksklusif member 3PM System. Ask langsung ke @cenhfits, sharing progress, dan support sesama member.',
    type: 'link',
    href: 'https://t.me/+_7_wmNdYtQY5NjFl',
    cta: 'Join Telegram',
  },
  {
    id: 'spotify',
    gradient: 'from-green-500/20 to-green-500/5',
    border: 'border-green-500/20 hover:border-green-400/50',
    accent: 'text-green-400',
    iconBg: 'bg-green-500/10 border-green-500/20',
    emoji: '🎵',
    label: 'SPOTIFY',
    title: 'Testo Booster Playlist',
    subtitle: 'Spotify Playlist by CenhFits',
    description: 'Playlist musik pilihan untuk nemenin sesi gym kamu. Didesain buat boost energi dan fokus latihan maksimal.',
    type: 'link',
    href: 'https://open.spotify.com/playlist/3iTAECksATHPwMfYL9Z4UI',
    cta: 'Buka di Spotify',
  },
];

const BonusView = ({ renderBlocks }) => {
  const [activeBonus, setActiveBonus] = useState(null);

  if (activeBonus === 'tracking') {
    return (
      <motion.div key="tracking-lesson" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
        <button onClick={() => setActiveBonus(null)}
          className="flex items-center gap-2 text-neutral-400 hover:text-white text-sm mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Kembali ke Bonus
        </button>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-blue-500/20 text-blue-400">📋 TEMPLATE</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Self-Tracking System (WO Operating System)
        </h2>
        <div className="flex-1">
          {renderBlocks(TRACKING_CONTENT)}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div key="bonus-home" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-orange-500/15 via-yellow-500/5 to-transparent border border-orange-500/20 rounded-2xl p-7 mb-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
        <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-2">Exclusive Member Only</p>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Claim Your Bonus 🎁
        </h2>
        <p className="text-neutral-400 text-sm max-w-lg">
          Sebagai member 3PM System, kamu dapet <strong className="text-white">3 bonus eksklusif</strong> yang dirancang untuk memaksimalkan hasil latihan kamu.
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-5 sm:grid-cols-1 lg:grid-cols-3">
        {BONUSES.map((b, i) => {
          const isLesson = b.type === 'lesson';
          const Tag = isLesson ? 'button' : 'a';
          const extraProps = isLesson
            ? { onClick: () => setActiveBonus(b.id) }
            : { href: b.href, target: '_blank', rel: 'noopener noreferrer' };
          return (
            <motion.div key={b.id}
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }} className="h-full">
              <Tag {...extraProps}
                className={`w-full h-full group bg-gradient-to-br ${b.gradient} border ${b.border} rounded-2xl p-6 flex flex-col gap-5 transition-all duration-200 cursor-pointer text-left`}>
                {/* Icon + label */}
                <div className="flex items-start justify-between">
                  <div className={`w-14 h-14 rounded-2xl ${b.iconBg} border flex items-center justify-center text-3xl`}>
                    {b.emoji}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${b.iconBg} border ${b.accent}`}>{b.label}</span>
                </div>
                {/* Text */}
                <div className="flex-1">
                  <p className="text-white font-bold text-base leading-snug">{b.title}</p>
                  <p className={`text-xs font-semibold mt-0.5 ${b.accent}`}>{b.subtitle}</p>
                  <p className="text-neutral-400 text-sm mt-3 leading-relaxed">{b.description}</p>
                </div>
                {/* CTA */}
                <div className={`flex items-center gap-2 text-sm font-bold ${b.accent} group-hover:gap-3 transition-all`}>
                  {isLesson ? <ChevronRight className="w-4 h-4 flex-shrink-0" /> : <ExternalLink className="w-4 h-4 flex-shrink-0" />}
                  {b.cta}
                </div>
              </Tag>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};"""

if old_bonus_block in src:
    src = src.replace(old_bonus_block, new_bonus_block)
    print("BonusView replaced")
else:
    print("BonusView not found! Checking...")
    idx = src.find("const BonusView")
    print(f"BonusView at index: {idx}")

# ─── 3. Pass renderBlocks prop to BonusView in main ──────────────────────────
# BonusView needs access to the block renderer. We pass it inline.
old_bonus_render = '                <BonusView key="bonus" />'
new_bonus_render = '                <BonusView key="bonus" renderBlocks={(blocks) => blocks.map((block, i) => { const inlineHtml = (t) => (t || \'\').replace(/\\*\\*(.+?)\\*\\*/g, \'<strong>$1</strong>\').replace(/\\*(.+?)\\*/g, \'<em>$1</em>\'); switch (block.type) { case \'image\': return <img key={i} src={block.src} alt={block.alt || \'\'} className="w-full rounded-xl object-cover max-h-72 mb-4" />; case \'callout\': return <div key={i} className="flex gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 my-4"><span className="text-lg flex-shrink-0">{block.icon}</span><span className="text-neutral-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: inlineHtml(block.text) }} /></div>; case \'video_embed\': return <div key={i} className="my-6 rounded-xl overflow-hidden aspect-video bg-black"><iframe src={block.src} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="video" /></div>; case \'link_card\': return <a key={i} href={block.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 my-2 transition-colors group"><span className="text-neutral-200 text-sm flex-1">{block.text}</span><ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors flex-shrink-0" /></a>; default: return null; } })} />'

if old_bonus_render in src:
    src = src.replace(old_bonus_render, new_bonus_render)
    print("renderBlocks prop passed")
else:
    print("BonusView render tag not found!")

with open('frontend/src/pages/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(src)
print("Done")
