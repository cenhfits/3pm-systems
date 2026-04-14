with open('frontend/src/pages/Dashboard.jsx', 'r', encoding='utf-8') as f:
    src = f.read()

# 1. Insert AccordionBlock component before LessonView
accordion_component = """// ── Accordion Block ───────────────────────────────────────────────────────────
const AccordionBlock = ({ title, items }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden my-2">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
      >
        <span className="text-neutral-200 font-medium text-sm">{title}</span>
        <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronRight className="w-4 h-4 text-neutral-500" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <ul className="px-4 pb-4 space-y-2">
              {items.map((item, i) => (
                <li key={i} className="text-neutral-400 text-sm flex gap-2 leading-relaxed">
                  <span className="flex-shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-neutral-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

"""

marker = "// \u2500\u2500 Lesson View \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500"
if marker in src:
    src = src.replace(marker, accordion_component + marker)
    print("AccordionBlock inserted")
else:
    print("Marker not found:", repr(marker[:50]))

# 2. Add new block types to the renderer (after 'divider' case)
old_divider = """            case 'divider':
              return <hr key={i} className="border-white/10 my-8" />;
            default:"""

new_divider = """            case 'divider':
              return <hr key={i} className="border-white/10 my-8" />;
            case 'video_embed':
              return (
                <div key={i} className="my-6 rounded-xl overflow-hidden aspect-video bg-black">
                  <iframe src={block.src} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="video" />
                </div>
              );
            case 'accordion':
              return <AccordionBlock key={i} title={block.title} items={block.items} />;
            case 'link_card':
              return (
                <a key={i} href={block.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 my-2 transition-colors group">
                  <span className="text-neutral-200 text-sm flex-1">{block.text}</span>
                  <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors flex-shrink-0" />
                </a>
              );
            default:"""

if old_divider in src:
    src = src.replace(old_divider, new_divider)
    print("New block types added")
else:
    print("Divider case not found")

# 3. Replace chapter 2 lessons
ch2_start = src.find("    id: 2, code: 'NUTRISI'")
ch2_start = src.rfind("\n  {", 0, ch2_start) + 1
ch2_end = src.find("\n  {", ch2_start + 10)
if ch2_end == -1:
    ch2_end = src.find("\n];", ch2_start)

old_ch2 = src[ch2_start:ch2_end]
print("Ch2 snippet:", repr(old_ch2[:80]))

new_ch2 = """  {
    id: 2, code: 'NUTRISI', title: 'Nutrition For Muscle & Testosterone', icon: Utensils,
    color: 'from-green-500/20 to-green-500/5', accent: 'text-green-400',
    border: 'border-green-500/30', badge: 'bg-green-500/20 text-green-400',
    locked: false,
    lessons: [
      { id: '2-1', type: 'text', title: 'Kebutuhan Nutrisi & Vitamin', duration: '15 min baca', content: [
        { type: 'image', src: '/ch2-philip.jpg', alt: 'Philip Vasquez' },
        { type: 'callout', icon: '\U0001F3AF', text: 'GOAL: Lo bisa memahami kebutuhan nutrisi untuk bentukin otot lo' },
        { type: 'callout', icon: '\u26A0\uFE0F', text: '**Important Note** \u26A0\uFE0F\\n\\nGw bukan ahli nutrisi, semua yang gw jelasin di sini *based on experience* yang udah gw jalanin selama beberapa bulan. Kalau kalian ada masalah kesehatan lainnya, please make sure untuk konsul ke dokter atau ke ahli nutrisi dulu untuk kesehatan lo.' },
        { type: 'heading2', text: 'Kebutuhan nutrisi yang lo butuhin' },
        { type: 'video_embed', src: 'https://www.youtube.com/embed/InFRnBXg3SQ' },
        { type: 'heading2', text: 'Resources Vitamin' },
        { type: 'callout', icon: '\U0001F4A1', text: 'Klik tombol "\u25B6" di samping untuk melihat benefit secara penuh.' },
        { type: 'heading2', text: '1. Vitamin C' },
        { type: 'accordion', title: 'Benefit Vitamin C', items: ['Bantu ningkatin imun tubuh', 'Bantu produksi collagen', 'Bantu recovery tubuh & otot', 'Bantu penyerapan zat besi (produksi energi, mendukung sistem kekebalan tubuh, meningkatkan konsentrasi, serta mencegah anemia defisiensi besi)'] },
        { type: 'heading3', text: 'Sumber Vitamin C' },
        { type: 'list', items: ['Jeruk', 'Kiwi', 'Strawberry', 'Paprika merah', 'Brokoli', 'Bayam', 'Jambu biji (**Very High Vit C**)'] },
        { type: 'text', text: 'Kalau lo makan **sayur hijau + buah**, biasanya vitamin C udah aman.' },
        { type: 'heading2', text: '2. Vitamin B Complex' },
        { type: 'accordion', title: 'Benefit Vitamin B Complex', items: ['Vitamin B ini ada banyak: B1, B2, B3, B5, B6, B7, B9, & B12', 'Meningkatkan metabolisme energi', 'Mendukung kesehatan otak', 'Produksi sel darah merah', 'Performa saraf'] },
        { type: 'heading3', text: 'Sumber Vitamin B Complex' },
        { type: 'list', items: ['Daging sapi', 'Ayam', 'Ikan', 'Telur', 'Oatmeal', 'Nasi merah', 'Alpukat', 'Pisang', 'Sayuran hijau'] },
        { type: 'heading2', text: '3. Vitamin D' },
        { type: 'accordion', title: 'Benefit Vitamin D', items: ['Kesehatan tulang', 'Fungsi imun tubuh', 'Produksi hormon', 'Kekuatan otot (*strength*)'] },
        { type: 'heading3', text: 'Sumber Vitamin D' },
        { type: 'list', items: ['Matahari', 'Salmon', 'Sardine', 'Tuna', 'Telur (terutama kuningnya)', 'Jamur tertentu (shitake / maitake)', 'Susu yang difortifikasi vitamin D'] },
        { type: 'text', text: 'Kalau lo rutin makan **ikan + telur**, biasanya kebutuhan vitamin D udah lumayan kebantu.' },
        { type: 'callout', icon: '\u2600\uFE0F', text: '**Recommendations:** Paparin tubuh lo ke sinar matahari langsung di jam 8/9 pagi ATAU jam 4/5 sore selama 10-15 menit.' },
        { type: 'heading2', text: '4. Vitamin K' },
        { type: 'accordion', title: 'Benefit Vitamin K', items: ['Meminimalisir pendarahan berlebih kalau terluka', 'Kesehatan tulang', 'Kesehatan jantung'] },
        { type: 'heading3', text: 'Sumber Vitamin K' },
        { type: 'text', text: '**Vitamin K1 (Nabati):**' },
        { type: 'list', items: ['Bayam', 'Kale', 'Brokoli', 'Sawi hijau'] },
        { type: 'text', text: '**Vitamin K2 (Hewani):**' },
        { type: 'list', items: ['Natto', 'Keju', 'Telur', 'Daging'] },
        { type: 'text', text: 'Kalau lo makan **sayuran hijau + telur / daging**, biasanya vitamin K udah ke-cover.' },
        { type: 'heading2', text: '5. Vitamin E' },
        { type: 'accordion', title: 'Benefit Vitamin E', items: ['Melindungi sel dari kerusakan radikal bebas', 'Kesehatan kulit', 'Kesehatan hormon'] },
        { type: 'heading3', text: 'Sumber Vitamin E' },
        { type: 'list', items: ['Almond', 'Biji bunga matahari', 'Alpukat', 'Bayam', 'Minyak zaitun'] },
        { type: 'text', text: 'Diet yang ada **lemak sehat** biasanya vitamin E udah masuk juga.' },
        { type: 'divider' },
        { type: 'heading2', text: 'Haruskah makan satu per satu biar bisa memenuhi kebutuhan Vitamin?' },
        { type: 'text', text: 'Jawabannya tidak. Karena sebenarnya lo bisa combine beberapa makanan untuk memenuhi kebutuhan vitamin lo.' },
        { type: 'text', text: 'Ada 4 kombinasi makanan yang bisa kamu coba untuk memenuhi vitamin + nutrisi lainnya:' },
        { type: 'heading3', text: 'Kombinasi 1 \u2014 Salmon + Bayam + Alpukat' },
        { type: 'list', items: ['Vitamin D \u2192 salmon', 'Vitamin B complex \u2192 salmon', 'Vitamin K \u2192 bayam', 'Vitamin C \u2192 bayam', 'Vitamin E \u2192 alpukat', 'Lemak sehat \u2192 salmon & alpukat'] },
        { type: 'heading3', text: 'Kombinasi 2 \u2014 Telur + Brokoli + Nasi Merah' },
        { type: 'list', items: ['Vitamin D \u2192 telur', 'Vitamin B complex \u2192 telur & nasi merah', 'Vitamin C \u2192 brokoli', 'Vitamin K \u2192 brokoli'] },
        { type: 'heading3', text: 'Kombinasi 3 \u2014 Ayam + Paprika Merah + Alpukat' },
        { type: 'list', items: ['Vitamin B complex \u2192 ayam', 'Vitamin C \u2192 paprika', 'Vitamin E \u2192 alpukat', 'Lemak sehat \u2192 alpukat'] },
        { type: 'text', text: 'Ini juga kombinasi yang sering dipakai di *meal prep*.' },
        { type: 'heading3', text: 'Kombinasi 4 \u2014 Telur + Bayam + Jamur' },
        { type: 'list', items: ['Vitamin D \u2192 telur & jamur', 'Vitamin K \u2192 bayam', 'Vitamin B complex \u2192 telur', 'Vitamin E \u2192 bayam'] },
        { type: 'text', text: '4 kombinasi ini adalah referensi buat kalian yang bingung harus masak apa, tapi kalau kalian bisa memenuhi kebutuhan vitamin kalian dengan cara lain juga ga masalah.' },
      ] },
      { id: '2-2', type: 'text', title: 'TDEE Calculator & Ngitung KKAL', duration: '5 min baca', content: [
        { type: 'heading2', text: 'Resources Buat Ngitung KKAL' },
        { type: 'video_embed', src: 'https://www.youtube.com/embed/jHhN9P0NPQA' },
        { type: 'link_card', href: 'https://tdeecalculator.net/', text: '\U0001F517 Click di sini buat ke TDEE Calculator' },
        { type: 'text', text: 'TDEE (Total Daily Energy Expenditure) Calculator digunakan untuk **menghitung total kalori yang dibakar tubuh dalam sehari**, based on umur, berat, tinggi, jenis kelamin, dan tingkat aktivitas fisik.' },
        { type: 'heading3', text: 'Kegunaan Utama TDEE Calculator' },
        { type: 'list', items: ['**Menurunkan Berat Badan (Defisit Calorie):** Mengetahui angka TDEE membantu lo mengonsumsi kalori di bawah angka tersebut.', '**Menambah Massa Otot (Surplus Calorie):** Memastikan lo mengonsumsi kalori lebih banyak dari TDEE untuk pertumbuhan otot.', '**Mempertahankan Berat Badan (Maintenance):** Memberikan angka pasti kalori yang harus dikonsumsi untuk menjaga berat badan saat ini.', '**Nutrition Plan:** Ngasih tau informasi soal kebutuhan makronutrien (protein, lemak, karbohidrat) harian.'] },
      ] },
    ],
  },"""

src = src[:ch2_start] + new_ch2 + src[ch2_end:]
print("Chapter 2 replaced")

with open('frontend/src/pages/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(src)
print("File written")
