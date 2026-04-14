with open('frontend/src/pages/Dashboard.jsx', 'r', encoding='utf-8') as f:
    src = f.read()

ch6_start = src.find("    id: 6, code: 'FINAL'")
ch6_start = src.rfind("\n  {", 0, ch6_start) + 1
ch6_end = src.find("\n  {", ch6_start + 10)
if ch6_end == -1:
    ch6_end = src.find("\n];", ch6_start)

old_ch6 = src[ch6_start:ch6_end]
print("Ch6 found:", repr(old_ch6[:60]))

new_ch6 = (
    "  {\n"
    "    id: 6, code: 'FINAL', title: 'FINAL \u2014 Your Next Step', icon: Flag,\n"
    "    color: 'from-orange-500/20 to-orange-500/5', accent: 'text-orange-400',\n"
    "    border: 'border-orange-500/30', badge: 'bg-orange-500/20 text-orange-400',\n"
    "    locked: false,\n"
    "    lessons: [\n"
    "      { id: '6-1', type: 'text', title: 'FINAL \u2014 Your Next Step', duration: '5 min baca', content: [\n"
    "        { type: 'image', src: '/ch6-philip.webp', alt: 'Philip Vasquez' },\n"
    "        { type: 'heading2', text: 'Consistency & Discipline' },\n"
    "        { type: 'text', text: 'Lo udah sampai di sini. Lo udah punya semua yang lo butuhin \u2014 mindset, nutrisi, dan program latihan. Tapi gw mau jujur ke lo satu hal:' },\n"
    "        { type: 'callout', icon: '\U0001F525', text: '**Semua ilmu ini ga ada artinya kalau lo ga konsisten.** Program terbaik yang lo jalanin secara konsisten, jauh lebih baik daripada program \"sempurna\" yang lo jalanin setengah-setengah.' },\n"
    "        { type: 'text', text: 'Konsistensi itu bukan soal mood. Ada hari di mana lo capek, males, ga pengen latihan \u2014 dan di situlah karakter lo diuji. **Discipline** adalah melakukan hal yang harus lo lakukan, bahkan saat lo ga pengen melakukannya.' },\n"
    "        { type: 'list', items: [\n"
    "          'Commit ke program minimal **3 bulan** sebelum lo judge hasilnya',\n"
    "          'Progress foto setiap **4 minggu** \u2014 bukan cermin setiap hari',\n"
    "          'Lo ga akan selalu ngerasa progress \u2014 tapi **data ga bohong**',\n"
    "          'Satu sesi yang jelek lebih baik dari **tidak sama sekali**',\n"
    "        ] },\n"
    "        { type: 'divider' },\n"
    "        { type: 'heading2', text: \"What's Next \u2014 Apakah Cuman Gym Aja?\" },\n"
    "        { type: 'text', text: 'Gym cuma satu bagian dari upgrade diri lo. Kalau lo udah mulai disiplin di gym, lo bakal notice sesuatu \u2014 disiplin itu **menular ke area lain** di hidup lo.' },\n"
    "        { type: 'list', items: [\n"
    "          '\U0001F4DA **Belajar skill baru** \u2014 coding, desain, bisnis, bahasa inggris. Investasi ke otak sama pentingnya dengan investasi ke badan.',\n"
    "          '\U0001F4B0 **Financial health** \u2014 mulai tracking pengeluaran, mulai nabung atau invest dari sekarang, meski kecil.',\n"
    "          '\U0001F9E0 **Mental health** \u2014 journaling, tidur cukup, manage stress. Recovery mental sama pentingnya dengan recovery otot.',\n"
    "          '\U0001F91D **Circle yang bener** \u2014 kelilingin diri lo dengan orang yang juga mau grow, bukan yang drag lo down.',\n"
    "        ] },\n"
    "        { type: 'callout', icon: '\U0001F4A1', text: 'Gym ngajarin lo bahwa **hasil itu butuh waktu dan proses**. Apply mindset yang sama ke semua aspek hidup lo.' },\n"
    "        { type: 'divider' },\n"
    "        { type: 'heading2', text: 'Maximize Your Value' },\n"
    "        { type: 'text', text: 'Lo dateng ke sini buat bentukin otot. Tapi tujuan yang lebih besar adalah jadi **versi terbaik dari diri lo** \u2014 fisik, mental, dan finansial.' },\n"
    "        { type: 'list', items: [\n"
    "          '**Jaga fisik lo** \u2014 badan yang sehat bikin lo bisa produktif lebih lama',\n"
    "          '**Jaga mindset lo** \u2014 growth mindset adalah aset terbesar yang lo punya',\n"
    "          '**Jaga relasi lo** \u2014 network dan reputasi lo adalah investasi jangka panjang',\n"
    "          '**Terus belajar** \u2014 dunia berubah cepat, yang ga mau belajar akan tertinggal',\n"
    "        ] },\n"
    "        { type: 'callout', icon: '\U0001F3C6', text: 'Lo udah invest ke diri lo sendiri dengan selesain course ini. Itu bukan hal kecil \u2014 banyak orang yang ga pernah sampai sejauh ini. Sekarang tinggal satu hal yang tersisa: **Take action.** See you at the top \u2014 @cenhfits' },\n"
    "      ] },\n"
    "    ],\n"
    "  },"
)

src = src[:ch6_start] + new_ch6 + src[ch6_end:]
print("Chapter 6 replaced")

with open('frontend/src/pages/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(src)
print("Done")
