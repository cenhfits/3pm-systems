with open('frontend/src/pages/Dashboard.jsx', 'r', encoding='utf-8') as f:
    src = f.read()

# ─── 1. Add Gift to lucide imports ────────────────────────────────────────────
old_import = "  ChevronRight, ChevronLeft, Lock, Play, FileText, CheckCircle, Menu, LogOut,\n  ShoppingCart, LayoutDashboard, Star, Send"
new_import = "  ChevronRight, ChevronLeft, Lock, Play, FileText, CheckCircle, Menu, LogOut,\n  ShoppingCart, LayoutDashboard, Star, Send, Gift, ExternalLink, Download"
if old_import in src:
    src = src.replace(old_import, new_import)
    print("Import updated")
else:
    print("Import not found!")

# ─── 2. Insert BonusView component before Dashboard component ─────────────────
bonus_component = r"""// ── Bonus View ───────────────────────────────────────────────────────────────
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
);

"""

# Insert before Dashboard component
dashboard_marker = "// ── Dashboard ───────────────────────────────────────────────────────────────"
if dashboard_marker in src:
    src = src.replace(dashboard_marker, bonus_component + dashboard_marker)
    print("BonusView inserted")
else:
    # Try alternative
    dashboard_marker2 = "const Dashboard = () => {"
    if dashboard_marker2 in src:
        src = src.replace(dashboard_marker2, bonus_component + dashboard_marker2)
        print("BonusView inserted (alt)")
    else:
        print("Dashboard marker not found!")

# ─── 3. Add activePage state ──────────────────────────────────────────────────
old_state = "  const [feedbackChapterId, setFeedbackChapterId] = useState(null);"
new_state = "  const [feedbackChapterId, setFeedbackChapterId] = useState(null);\n  const [activePage, setActivePage] = useState(null); // null | 'bonus'"
if old_state in src:
    src = src.replace(old_state, new_state)
    print("activePage state added")
else:
    print("State marker not found!")

# ─── 4. When chapter is clicked, clear activePage ─────────────────────────────
old_chapter_click = "onClick={() => { if (!ch.locked && hasAccess) { setActiveChapter(ch); setSidebarOpen(false); } }}"
new_chapter_click = "onClick={() => { if (!ch.locked && hasAccess) { setActiveChapter(ch); setActivePage(null); setSidebarOpen(false); } }}"
if old_chapter_click in src:
    src = src.replace(old_chapter_click, new_chapter_click)
    print("Chapter click updated")
else:
    print("Chapter click not found!")

# ─── 5. Add Bonus button in sidebar nav (after chapters list, before </nav>) ──
old_nav_end = "        </nav>\n\n        {/* Bottom */"
new_nav_end = """        </nav>

        {/* Bonus Menu */}
        <div className="px-3 pb-2">
          <div className="border-t border-white/5 pt-3 mb-1">
            <p className="text-neutral-600 text-xs font-semibold uppercase tracking-widest px-3 mb-2">Bonus</p>
          </div>
          <button onClick={() => { setActivePage('bonus'); setActiveChapter(null); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 ${activePage === 'bonus' ? 'bg-orange-500/15 border border-orange-500/30' : 'hover:bg-white/5 border border-transparent'}`}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-yellow-500/20 to-yellow-500/5">
              <Gift className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-bold uppercase tracking-wider truncate ${activePage === 'bonus' ? 'text-orange-400' : 'text-neutral-300'}`}>Claim Your Bonus</p>
            </div>
            {activePage === 'bonus' && <div className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />}
          </button>
        </div>

        {/* Bottom */}"""

if old_nav_end in src:
    src = src.replace(old_nav_end, new_nav_end)
    print("Bonus sidebar button added")
else:
    print("Nav end not found!")

# ─── 6. Update header title to show bonus page ────────────────────────────────
old_header = "              {activeChapter ? activeChapter.title : '12 Week Journey'}"
new_header = "              {activePage === 'bonus' ? 'Claim Your Bonus' : activeChapter ? activeChapter.title : '12 Week Journey'}"
if old_header in src:
    src = src.replace(old_header, new_header)
    print("Header title updated")
else:
    print("Header title not found!")

# ─── 7. Add BonusView to main content AnimatePresence ─────────────────────────
old_main = "            <AnimatePresence mode=\"wait\">\n              {activeChapter ? (\n                <ChapterView"
new_main = "            <AnimatePresence mode=\"wait\">\n              {activePage === 'bonus' ? (\n                <BonusView key=\"bonus\" />\n              ) : activeChapter ? (\n                <ChapterView"
if old_main in src:
    src = src.replace(old_main, new_main)
    print("Main content updated")
else:
    print("Main content not found!")

with open('frontend/src/pages/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(src)
print("Done")
