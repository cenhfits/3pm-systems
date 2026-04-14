with open('frontend/src/pages/Dashboard.jsx', 'r', encoding='utf-8') as f:
    src = f.read()

# ── Chapter 3 ─────────────────────────────────────────────────────────────────
ch3_start = src.find("    id: 3, code: 'MASAK'")
ch3_start = src.rfind("\n  {", 0, ch3_start) + 1
ch3_end = src.find("\n  {", ch3_start + 10)

old_ch3 = src[ch3_start:ch3_end]
print("Ch3 found:", repr(old_ch3[:60]))

new_ch3 = """  {
    id: 3, code: 'MASAK', title: 'Template Makanan 140-145gr Protein', icon: ChefHat,
    color: 'from-yellow-500/20 to-yellow-500/5', accent: 'text-yellow-400',
    border: 'border-yellow-500/30', badge: 'bg-yellow-500/20 text-yellow-400',
    locked: false,
    lessons: [
      { id: '3-1', type: 'video', title: 'Template Makanan 140-145gr Protein', duration: '10 min', content: [
        { type: 'image', src: '/ch3-philip.webp', alt: 'Philip Vasquez' },
        { type: 'callout', icon: '\U0001F374', text: '**Resource: 500gr Dada Ayam & 5 Butir Telur Omega 3**' },
        { type: 'video_embed', src: 'https://www.youtube.com/embed/UL2dtwg6-NM' },
        { type: 'heading2', text: 'Tools that you need to maximize your nutrition needs:' },
        { type: 'link_card', href: 'https://play.google.com/store/apps/details?id=com.fatsecret.android&hl=id', text: '\U0001F4F1 FatSecret (iOS & Android) \u2014 Buat ngetrack kalori harian lo' },
        { type: 'text', text: '\u2696\uFE0F **Penimbang berat makanan** \u2014 Buat ngitung kalori, protein, dan lain lain. *(Bisa kalian cari di Shopee / Tokopedia)*' },
      ] },
    ],
  },"""

src = src[:ch3_start] + new_ch3 + src[ch3_end:]
print("Chapter 3 replaced")

# ── Chapter 4 ─────────────────────────────────────────────────────────────────
ch4_start = src.find("    id: 4, code: 'BUILD YOUR MUSCLE'")
ch4_start = src.rfind("\n  {", 0, ch4_start) + 1
ch4_end = src.find("\n  {", ch4_start + 10)

old_ch4 = src[ch4_start:ch4_end]
print("Ch4 found:", repr(old_ch4[:60]))

new_ch4 = """  {
    id: 4, code: 'BUILD YOUR MUSCLE', title: 'How To Build Your Muscle', icon: TrendingUp,
    color: 'from-purple-500/20 to-purple-500/5', accent: 'text-purple-400',
    border: 'border-purple-500/30', badge: 'bg-purple-500/20 text-purple-400',
    locked: false,
    lessons: [
      { id: '4-1', type: 'text', title: 'How To Build Your Muscle', duration: '10 min baca', content: [
        { type: 'image', src: '/ch4-philip.webp', alt: 'Philip Vasquez' },
        { type: 'text', text: 'Buat bentukin otot, kamu itu cuman perlu 3 hal ini:' },
        { type: 'list', items: [
          '**Progressive Overload** *(But must remember: Form > Weight)*',
          '**Mind Muscle Connection**',
          '**Hypertrophy** \u2014 Khusus buat pemula, fokusnya harus ke gerakan yang bener dulu',
          'Kasih lihat cara main yang bener: gerakan **positif & negatif**',
          '**Sleep** \u2014 Recovery terjadi saat tidur, bukan saat latihan',
        ] },
      ] },
    ],
  },"""

src = src[:ch4_start] + new_ch4 + src[ch4_end:]
print("Chapter 4 replaced")

with open('frontend/src/pages/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(src)
print("File written")
