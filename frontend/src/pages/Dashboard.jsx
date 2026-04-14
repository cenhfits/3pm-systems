import React, { useState, useEffect, useCallback } from 'react';
import PaymentModal from '../components/PaymentModal';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  Dumbbell, Brain, Utensils, ChefHat, TrendingUp, Calendar, Flag, Zap,
  ChevronRight, ChevronLeft, Lock, Play, FileText, CheckCircle, Menu, LogOut,
  ShoppingCart, LayoutDashboard, Star, Send, Gift, ExternalLink, Download
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const api = axios.create({ baseURL: BACKEND_URL });
api.interceptors.request.use(cfg => {
  const token = (localStorage.getItem('token') || sessionStorage.getItem('token'));
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// ── Chapter Data ──────────────────────────────────────────────────────────────
const chapters = [
  {
    id: 0, code: 'INTRO - LO WAJIB NONTON DULU SEBELUM LANJUT KE CHAPTER LAIN!', title: 'Introduction', icon: Play,
    color: 'from-orange-500/20 to-orange-500/5', accent: 'text-orange-400',
    border: 'border-orange-500/30', badge: 'bg-orange-500/20 text-orange-400',
    locked: false,
    lessons: [
      { id: '0-1', type: 'video', title: 'Intro — Tonton Ini Dulu!', duration: '5 min', content: [
        { type: 'image', src: '/intro-philip.webp', alt: 'Philip Vasquez' },
        { type: 'callout', icon: '👋', text: 'Sebelum lo mulai ke chapter-chapter lain, lo wajib nonton ini dulu, biar lo paham tujuan course ini untuk apa.' },
        { type: 'video_embed', src: 'https://www.youtube.com/embed/qM87IZH3w38' },
      ]},
    ],
  },
  {
    id: 1, code: 'MINDSET', title: 'Have This MINDSET', icon: Brain,
    color: 'from-purple-500/20 to-purple-500/5', accent: 'text-purple-400',
    border: 'border-purple-500/30', badge: 'bg-purple-500/20 text-purple-400',
    locked: false,
    lessons: [
      { id: '1-1', type: 'text', title: 'Have This MINDSET', duration: '10 min baca', content: [
        { type: 'image', src: '/ch1-philip.webp', alt: 'Philip Vasquez' },
        { type: 'callout', icon: '🎯', text: 'Goal: Ngubah mindset lo biar bisa tetap on track ke progress gym lo' },
        { type: 'text', text: '**CHAPTER INI WAJIB LO BACA DAN GA BOLEH SKIP!**' },
        { type: 'text', text: 'Percaya ama gw, mau sejago apapun lo…' },
        { type: 'text', text: 'tapi kalau mindset lo udah salah, apapun lo lakuin juga bakalan ngaco.' },
        { type: 'text', text: 'Dan banyak banget orang yang punya mindset keliru soal bentukin otot, yang ujungnya cuman bikin mereka stuck dan ga berkembang.' },
        { type: 'text', text: 'Di *chapter* ini, gw bakalan spill semua mindset yang harus lo \"***AVOID***\" biar progress lu lebih lancar.' },
        { type: 'heading2', text: '1. Train Otot - Failure Bikin Otot Growth?' },
        { type: 'text', text: 'Banyak yang mikir kalau \"*Train To Failure*\" itu bisa bentukin otot.' },
        { type: 'text', text: 'Jawabannya: bisa iya, bisa engga.' },
        { type: 'text', text: 'Loh kok bisa bang? Sini gw jelasin biar lo paham apa yang gw maksud.' },
        { type: 'text', text: 'Sebelumnya gw pengen lo paham apa arti dari *Train To Failure* itu apa: Basically, *Train to failure* itu artinya lo ngelakuin repetisi sampai gak bisa angkat lagi dengan form yang benar.' },
        { type: 'heading3', text: 'Kenapa Failure Bisa Bikin Otot Tumbuh?' },
        { type: 'text', text: 'Otot tumbuh karena 3 hal utama:' },
        { type: 'numbered', items: ['*Mechanical tension* (beban berat)', '*Metabolic stress* (*pump, burn*)', '*Muscle fiber recruitment* (aktivasi serabut otot maksimal)'] },
        { type: 'text', text: 'Artinya….' },
        { type: 'text', text: 'Semakin dekat ke *failure* → semakin banyak serabut (*muscle spindles*) otot aktif → *stimulus* (rangsangan ke otot) makin besar.' },
        { type: 'text', text: '\"Ya berarti harus selalu *failure* dong?\"' },
        { type: 'text', text: 'Tunggu dulu. Ini baru mau gw jelasin:' },
        { type: 'text', text: '*Failure* itu bikin stimulus tinggi, tapi juga bikin *fatigue* juga tinggi.' },
        { type: 'text', text: 'Dan *muscle growth* itu bukan cuma soal stimulus, tapi soal rasio stimulus dibanding fatigue.' },
        { type: 'text', text: 'Kalau lu failure terus tiap set, tiap latihan, tiap minggu… Ya ambyarr, otot lu jadinya ga ke recover.' },
        { type: 'text', text: 'Jadi gausah train to failure dong? Ya tergantung tujuan lo mau gimana: *Hypertrophy* kah? *Strength*? Atau *Endurance*?' },
        { type: 'text', text: 'Cuman gw yakin 99% dari kalian yang join course ini ya pasti mau bentukin otot, so gw bakalan lebih reccomend kalian untuk train RIR 1-3. Untuk detailnya gw ada jelasin di chapter \"***How To Build Your Muscle***\".' },
        { type: 'text', text: 'So ini cuman biar lo kebayang aja dan ga salah kaprah soal ***Train To Failure*** ini.' },
        { type: 'heading2', text: '2. Instant Mentality' },
        { type: 'text', text: 'Sangking banyaknya konten-konten yang show off badan mereka jadi cuman dalam waktu singkat, dan akhirnya banyak yang jadi kepengen bentukin badan (***FOMO***). Padahal bisa aja influencer yang mereka tontonin lagi make **Roid** atau apapun itu.' },
        { type: 'text', text: 'Biasanya mereka bandingin progress natural mereka dengan progress orang yang mungkin nggak natural. Endingnya apa? Ya langsung stop nge-gym.' },
        { type: 'text', text: 'Karena mereka *expect* dalam waktu singkat bisa langsung dapet otot gede cuman dalam waktu 1 minggu. Padahal ya ga gitu…' },
        { type: 'text', text: '**Perkembangan otot itu biasanya 0.5kg - 0.9kg per bulan, kalau lo memang masih baru awal ngegym. Tapi kalau untuk level intermediate - advance itu dari 0.25kg - 0.5kg per bulan aja biasanya. [*Source*](https://www.bodyspec.com/blog/post/the_complete_guide_to_newbie_gains)**' },
        { type: 'text', text: 'Dan perkembangan otot itu tergantung dari cara lo konsumsi makanan, latihan, dan tidur.' },
        { type: 'text', text: '**Jadi** kalau lo memang mau gedein otot lo, coba deh *optimize* dari 3 itu dulu.' },
        { type: 'text', text: 'Tapi masalahnya bukan cuma soal pemahaman soal latihan, nutrisi, dan lain-lain. Tapi di *mentality* nya.' },
        { type: 'text', text: 'Gw punya banyak temen yang pengen ikut gw ngegym, *most of them* ga tahan sampe 1 minggu, dan dari semua yang ikut gw, yang paling lama bertahan cuman 1 bulan. *Why?* Karena yang mereka dapet cuman pain-nya doang dan hasil yang mereka pengen ga ada.' },
        { type: 'text', text: '*Instant mentality* ini malah bikin lo nge-stuck cuman gara gara lo ga mau berprogres, percaya deh ama gw, setelah 1-2 minggu lo latihan, rasa sakitnya itu bakalan menghilang dengan sendirinya.' },
        { type: 'text', text: 'Karena otot lo udah *recovery* & beradaptasi.' },
        { type: 'text', text: '*One thing that you need to remember is:*' },
        { type: 'heading3', text: 'Proccess Is Not Your Enemy.' },
        { type: 'heading2', text: '3. Gym Lebih Lama ≠ Progress' },
        { type: 'text', text: 'Banyak yang ngira kalau gym 2-3 jam = otot makin gede.' },
        { type: 'text', text: '**Faktanya** otot kalau lu train selama itu, yang ada dapet pain-nya doang, gain-nya kaga ada.' },
        { type: 'text', text: 'Karena muscle growth itu bukan soal seberapa lama lo di gym, tapi soal **stimulus yang berkualitas + recovery yang cukup.** [*Source*](https://pubmed.ncbi.nlm.nih.gov/36248475/)' },
        { type: 'text', text: 'Dalam *hypertrophy*, waktu latihan paling ideal adalah **45 - 90 menit per sesi.**' },
        { type: 'text', text: 'Dan *make sure* kalau lagi latihan, kamu harus bener-bener fokus dan ga buang-buang waktu lo di gym, biar progress lo bisa **lebih bagus**.' },
        { type: 'heading2', text: '4. Supplementation Over Everything' },
        { type: 'quote', text: '\"Kalau mau bentukin otot harus pakai suplemen dulu\"' },
        { type: 'text', text: 'Kata siapa? Gw masih bisa bentukin otot tanpa suplemen, kecuali **creatine & omega 3.**' },
        { type: 'image', src: '/ch1-vincent.webp', alt: 'Vincent di gym', fit: 'contain' },
        { type: 'text', text: 'Sebelumnya, lo harus paham dulu definisi suplemen itu apa.' },
        { type: 'text', text: '**Suplemen** itu produk yang dirancang untuk melengkapi kebutuhan zat gizi (vitamin, mineral, asam amino, herbal) guna memelihara, meningkatkan, atau memperbaiki fungsi kesehatan dan daya tahan tubuh. [Source](https://www.halodoc.com/artikel/suplemen-makanan-manfaat-dan-tips-memilih-yang-tepat)' },
        { type: 'text', text: '***MEANS*** kalau lo udah mencukupi nutrisi lo dari real food, ya lu ga perlu suplementasi lagi.' },
        { type: 'text', text: 'Kecuali kalau kebutuhan nutrisi lo kurang, lo bisa pakai suplemen untuk memenuhi itu.' },
        { type: 'text', text: '\"Terus bang Vincent emangnya ga pakai suplemen sama sekali?\"' },
        { type: 'text', text: 'Gw pakai. Tapi yang gw pakai cuman *creatine* dan juga suplemen *omega 3* (karena malas masak & ngolah ikan hehe).' },
        { type: 'text', text: '*The reason why* gw pakai *creatine*: Kalau mau dapet *creatine* 5gr setiap hari, *it means* gw harus makan daging sapi 1kg setiap hari & kalau gw makan tiap hari 1kg sapi, yang ada boncos.' },
        { type: 'text', text: 'Jadi ya bukan suplemen itu ga boleh, boleh-boleh aja sebenarnya. Selagi nutrisi lo itu memang tidak tercukupi seperti yang gw sebut di atas.' },
        { type: 'text', text: 'Kalau ***goals*** lo memang mau bentukin otot: banyakin protein dari real food, tidur, dan latihan yang bener. Itu udah lebih dari cukup.' },
        { type: 'heading2', text: '5. Healthy Lifestyle Harus Jadi Habit' },
        { type: 'text', text: 'Percaya ama gw…' },
        { type: 'text', text: 'Salah satu hal yang bakalan lo syukuri & terimakasih ke diri lo di masa depan adalah investasi ke kesehatan, dan jujur aja, gw udah ngelakuin ini dari umur 14-15 tahun sampai umur gw yang sekarang 19 tahun. Alasannya simple: di masa tua nanti, gw masih punya **tenaga & ga banyak penyakit.**' },
        { type: 'text', text: 'Kalau gw sehat:' },
        { type: 'list', items: ['Gw masih bisa **belajar**.', 'Gw masih bisa **ngumpul bareng temen.**', 'Gw masih bisa **ngumpul sama keluarga.**', 'Gw masih bisa **ngelakuin aktivitas yang gw suka.**', 'Dan gw masih **kuat untuk jalan-jalan bareng anak gw di masa depan nanti.**'] },
        { type: 'text', text: 'Kalau gw pengen semua itu = **gw harus jaga kesehatan & bentukin otot dari pas masih muda.**' },
        { type: 'heading2', text: 'Kapan Waktu Terbaik Untuk Bentukin Otot?' },
        { type: 'text', text: 'Sekarang!' },
        { type: 'text', text: 'Sekarang adalah waktu terbaik yang bisa lo manfaatin, karena berat badan lo akan naik seiring berjalannya waktu kalau lo ga gerak sama sekali!' },
        { type: 'text', text: 'Dan semakin lama lo nunda, makin berat juga buat mulai.' },
        { type: 'text', text: 'Investasi ke kesehatan itu bukan soal keliatan berotot dan *aesthetic* doang.' },
        { type: 'text', text: 'Tapi soal kualitas hidup & *freedom* yang lo dapet di masa depan nanti.' },
        { type: 'text', text: "*Trust me…* investasi ke kesehatan itu bakaln jadi salah satu hal yang bakalan lo syukuri di hari tua nanti, *so don't waste ur time, and start working out.*" },
      ] },
    ],
  },
  {
    id: 2, code: 'NUTRISI', title: 'Nutrition For Muscle & Testosterone', icon: Utensils,
    color: 'from-green-500/20 to-green-500/5', accent: 'text-green-400',
    border: 'border-green-500/30', badge: 'bg-green-500/20 text-green-400',
    locked: false,
    lessons: [
      { id: '2-1', type: 'video', title: 'Kebutuhan Nutrisi & Vitamin', duration: '15 min', content: [
        { type: 'image', src: '/ch2-philip.webp', alt: 'Philip Vasquez' },
        { type: 'callout', icon: '🎯', text: 'GOAL: Lo bisa memahami kebutuhan nutrisi untuk bentukin otot lo' },
        { type: 'callout', icon: '⚠️', text: '**Important Note** ⚠️\n\nGw bukan ahli nutrisi, semua yang gw jelasin di sini *based on experience* yang udah gw jalanin selama beberapa bulan. Kalau kalian ada masalah kesehatan lainnya, please make sure untuk konsul ke dokter atau ke ahli nutrisi dulu untuk kesehatan lo.' },
        { type: 'heading2', text: 'Kebutuhan nutrisi yang lo butuhin' },
        { type: 'video_embed', src: 'https://www.youtube.com/embed/InFRnBXg3SQ' },
        { type: 'heading2', text: 'Resources Vitamin' },
        { type: 'callout', icon: '💡', text: 'Klik tombol "▶" di samping untuk melihat benefit secara penuh.' },
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
        { type: 'callout', icon: '☀️', text: '**Recommendations:** Paparin tubuh lo ke sinar matahari langsung di jam 8/9 pagi ATAU jam 4/5 sore selama 10-15 menit.' },
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
        { type: 'heading3', text: 'Kombinasi 1 — Salmon + Bayam + Alpukat' },
        { type: 'list', items: ['Vitamin D → salmon', 'Vitamin B complex → salmon', 'Vitamin K → bayam', 'Vitamin C → bayam', 'Vitamin E → alpukat', 'Lemak sehat → salmon & alpukat'] },
        { type: 'heading3', text: 'Kombinasi 2 — Telur + Brokoli + Nasi Merah' },
        { type: 'list', items: ['Vitamin D → telur', 'Vitamin B complex → telur & nasi merah', 'Vitamin C → brokoli', 'Vitamin K → brokoli'] },
        { type: 'heading3', text: 'Kombinasi 3 — Ayam + Paprika Merah + Alpukat' },
        { type: 'list', items: ['Vitamin B complex → ayam', 'Vitamin C → paprika', 'Vitamin E → alpukat', 'Lemak sehat → alpukat'] },
        { type: 'text', text: 'Ini juga kombinasi yang sering dipakai di *meal prep*.' },
        { type: 'heading3', text: 'Kombinasi 4 — Telur + Bayam + Jamur' },
        { type: 'list', items: ['Vitamin D → telur & jamur', 'Vitamin K → bayam', 'Vitamin B complex → telur', 'Vitamin E → bayam'] },
        { type: 'text', text: '4 kombinasi ini adalah referensi buat kalian yang bingung harus masak apa, tapi kalau kalian bisa memenuhi kebutuhan vitamin kalian dengan cara lain juga ga masalah.' },
      ] },
      { id: '2-2', type: 'video', title: 'TDEE Calculator & Ngitung KKAL', duration: '5 min', content: [
        { type: 'heading2', text: 'Resources Buat Ngitung KKAL' },
        { type: 'video_embed', src: 'https://www.youtube.com/embed/jHhN9P0NPQA' },
        { type: 'link_card', href: 'https://tdeecalculator.net/', text: '🔗 Click di sini buat ke TDEE Calculator' },
        { type: 'text', text: 'TDEE (Total Daily Energy Expenditure) Calculator digunakan untuk **menghitung total kalori yang dibakar tubuh dalam sehari**, based on umur, berat, tinggi, jenis kelamin, dan tingkat aktivitas fisik.' },
        { type: 'heading3', text: 'Kegunaan Utama TDEE Calculator' },
        { type: 'list', items: ['**Menurunkan Berat Badan (Defisit Calorie):** Mengetahui angka TDEE membantu lo mengonsumsi kalori di bawah angka tersebut.', '**Menambah Massa Otot (Surplus Calorie):** Memastikan lo mengonsumsi kalori lebih banyak dari TDEE untuk pertumbuhan otot.', '**Mempertahankan Berat Badan (Maintenance):** Memberikan angka pasti kalori yang harus dikonsumsi untuk menjaga berat badan saat ini.', '**Nutrition Plan:** Ngasih tau informasi soal kebutuhan makronutrien (protein, lemak, karbohidrat) harian.'] },
      ] },
      { id: '2-3', type: 'text', title: 'Supplement Needs', duration: '8 min', content: [
        { type: 'callout', icon: '⚠️', text: '**Important:** Suplemen WHEY, GAINER, dan OMEGA 3 lo **ga wajib beli** kalau lo udah bisa memenuhinya lewat real food. Yang wajib lo beli cuma **Creatine**. Ingat — suplemen itu cuma bantu memenuhi kebutuhan lo pas lagi ga sempat atau ga bisa konsumsi dari makanan.' },
        { type: 'heading2', text: '1. Creatine' },
        { type: 'heading3', text: 'Muscle First Pro Creatine' },
        { type: 'image', src: '/supp-m1-creatine.webp', alt: 'Muscle First Pro Creatine', size: 'product'},
        { type: 'link_card', href: 'https://shopee.co.id/MUSCLE-FIRST-Pro-Creatine-360gr-Menambah-Massa-Otot-Suplemen-Fitness-i.8802988.289998377', text: '🛒 Beli di Shopee — Official Store' },
        { type: 'heading3', text: 'Crevolene' },
        { type: 'image', src: '/supp-crevolene.webp', alt: 'Crevolene Creatine', size: 'product'},
        { type: 'link_card', href: 'https://shopee.co.id/Evolene-NUQDgwqVE-6aMBLYLbQv6i5N5y7bC5SajqSjHPzt8UJUqbZ8a-Otot-Suplemen-Fitness-i.244776591.24157750608', text: '🛒 Beli di Shopee — Official Store' },
        { type: 'heading3', text: 'Provus Creatine' },
        { type: 'image', src: '/supp-provus-creatine.webp', alt: 'Provus Creatine', size: 'product' },
        { type: 'link_card', href: 'https://shopee.co.id/Provus-Creatine-Matrix-300gr-(Kemasan-Lama)-Unflavored-i.1088395013.46954913369', text: '🛒 Beli di Shopee — Official Store' },
        { type: 'divider' },
        { type: 'heading2', text: '2. Omega 3' },
        { type: 'callout', icon: '💡', text: 'Kalau lo udah rutin konsumsi ikan, suplemen Omega 3 ini **ga perlu dibeli**.' },
        { type: 'heading3', text: 'NOW Ultra Omega 3' },
        { type: 'image', src: '/supp-now-omega3.webp', alt: 'NOW Ultra Omega 3', size: 'product' },
        { type: 'link_card', href: 'https://shopee.co.id/NOW-Ultra-Omega-3-Fish-OIl-90-Softgels-i.789452017.21475465102', text: '🛒 Beli di Shopee — Official Store' },
        { type: 'heading3', text: 'Blackmores Fish Oil' },
        { type: 'image', src: '/supp-blackmores.webp', alt: 'Blackmores Fish Oil', size: 'product' },
        { type: 'link_card', href: 'https://shopee.co.id/Blackmores-Ultimate-Omega-Odourless-Minyak-Ikan-Tidak-Berbau-1-Kapsul-Sehari-Isi-60-Kapsul-(Membantu-Memelihara-Kesehatan)-BPOM-HALAL-i.204176418.4109712057', text: '🛒 Beli di Shopee — Official Store' },
        { type: 'divider' },
        { type: 'heading2', text: '3. Gainer' },
        { type: 'heading3', text: 'M1 Pro Gainer' },
        { type: 'image', src: '/supp-m1-gainer.webp', alt: 'M1 Pro Gainer', size: 'product' },
        { type: 'link_card', href: 'https://shopee.co.id/MUSCLE-FIRST-Pro-Gainer-2lbs-900gr-Mass-Gainer-Penambah-Berat-Badan-i.8802988.896956194', text: '🛒 Beli di Shopee — Official Store' },
        { type: 'heading3', text: 'EVOMASS' },
        { type: 'image', src: '/supp-evomass.webp', alt: 'EVOMASS Gainer', size: 'product' },
        { type: 'link_card', href: 'https://shopee.co.id/Evolene-Evomass-10-lbs-4500gr-Mass-Gainer-Suplemen-Fitness-i.244776591.7927678019', text: '🛒 Beli di Shopee — Official Store' },
        { type: 'heading3', text: 'Massiv Gainer' },
        { type: 'image', src: '/supp-massiv.webp', alt: 'Massiv Fitlife Gainer', size: 'product' },
        { type: 'link_card', href: 'https://shopee.co.id/FITlife-Massiv-Gainer-5-lbs-2260-gram-(MPro-Upgraded)-i.180143494.7109556935', text: '🛒 Beli di Shopee — Official Store' },
        { type: 'heading3', text: 'Provus Gainer' },
        { type: 'image', src: '/supp-provus-gainer.webp', alt: 'Provus Mega Mass Gainer', size: 'product' },
        { type: 'link_card', href: 'https://shopee.co.id/Provus-Mega-Mass-3-lb-6-Serving-Weight-Gainer-Penambah-Berat-Badan-i.6348001.23933372225', text: '🛒 Beli di Shopee — Official Store' },
        { type: 'divider' },
        { type: 'heading2', text: '4. Whey' },
        { type: 'heading3', text: 'Whey Evolene' },
        { type: 'image', src: '/supp-evo-whey.webp', alt: 'Evolene EvoWhey', size: 'product' },
        { type: 'link_card', href: 'https://shopee.co.id/Evolene-EvoWhey-Evosorption-Whey-Protein-50-Serving-1550gr-Suplemen-Fitness-i.244776591.25838061460', text: '🛒 Beli di Shopee — Official Store' },
        { type: 'heading3', text: 'Pro Whey' },
        { type: 'image', src: '/supp-pro-whey.webp', alt: 'Muscle First Pro Whey', size: 'product' },
        { type: 'link_card', href: 'https://shopee.co.id/MUQDgwqVE-6aMBLYLbQv6i5N5y7bC5SajqSjHPzt8UJUqbZ8a-Suplemen-Fitness-i.8802988.5876940790', text: '🛒 Beli di Shopee — Official Store' },
        { type: 'heading3', text: 'Provus Whey' },
        { type: 'image', src: '/supp-provus-whey.webp', alt: 'Provus Premium Whey Gold', size: 'product' },
        { type: 'link_card', href: 'https://shopee.co.id/Provus-Premium-Whey-Gold-900gr-Whey-Protein-Concentrate-i.1088395013.27004990140', text: '🛒 Beli di Shopee — Official Store' },
      ] },
    ],
  },
  {
    id: 3, code: 'MASAK', title: 'Template Makanan 140-145gr Protein', icon: ChefHat,
    color: 'from-yellow-500/20 to-yellow-500/5', accent: 'text-yellow-400',
    border: 'border-yellow-500/30', badge: 'bg-yellow-500/20 text-yellow-400',
    locked: false,
    lessons: [
      { id: '3-1', type: 'video', title: 'Template Makanan 140-145gr Protein', duration: '10 min', content: [
        { type: 'image', src: '/ch3-philip.webp', alt: 'Philip Vasquez' },
        { type: 'callout', icon: '🍴', text: '**Resource: 500gr Dada Ayam & 5 Butir Telur Omega 3**' },
        { type: 'video_embed', src: 'https://www.youtube.com/embed/UL2dtwg6-NM' },
        { type: 'heading2', text: 'Tools that you need to maximize your nutrition needs:' },
        { type: 'link_card', href: 'https://play.google.com/store/apps/details?id=com.fatsecret.android&hl=id', text: '📱 FatSecret (iOS & Android) — Buat ngetrack kalori harian lo' },
        { type: 'text', text: '⚖️ **Penimbang berat makanan** — Buat ngitung kalori, protein, dan lain lain. *(Bisa kalian cari di Shopee / Tokopedia)*' },
      ] },
    ],
  },
  {
    id: 4, code: 'BUILD YOUR MUSCLE', title: 'How To Build Your Muscle', icon: TrendingUp,
    color: 'from-purple-500/20 to-purple-500/5', accent: 'text-purple-400',
    border: 'border-purple-500/30', badge: 'bg-purple-500/20 text-purple-400',
    locked: false,
    lessons: [
      { id: '4-1', type: 'text', title: 'How To Build Your Muscle', duration: '10 min baca', content: [
        { type: 'image', src: '/ch4-philip.webp', alt: 'Philip Vasquez' },
        { type: 'divider' },
        { type: 'video_embed', src: 'https://www.youtube.com/embed/WtQPaItoDnQ' },
      ] },
    ],
  },
  {
    id: 5, code: 'WORKOUT', title: 'Split Gym 3-5/Week Program', icon: Calendar,
    color: 'from-blue-500/20 to-blue-500/5', accent: 'text-blue-400',
    border: 'border-blue-500/30', badge: 'bg-blue-500/20 text-blue-400',
    locked: false,
    lessons: [
      { id: '5-1', type: 'text', title: 'Split Gym 3-5/Week Program', duration: '10 min', content: [
        { type: 'image', src: '/ch5-program.webp', alt: 'Program Latihan' },
        { type: 'callout', icon: '🎯', text: 'GOAL: Bisa menyesuaikan jadwal latihan sesuai dengan free time yang kalian punya' },
        { type: 'heading2', text: 'Pilih Program Latihan' },
        { type: 'program_selector', programs: [
          {
            id: '3x', title: '3x Per Week', subtitle: 'Full Body / Upper Body & Lower Body',
            days: [
              { day: '1. Full Body WO', isRest: false, exercises: [
                { name: 'Back Squat, Goblet Squat, atau Leg Press', setsReps: '3 & 5-10' },
                { name: 'Deadlift / RDL', setsReps: '3 & 5-10' },
                { name: 'Flat Bench Press / Dumbbell Press', setsReps: '3 & 8-12' },
                { name: 'Bent-over Row / Cable Row', setsReps: '3 & 8-12' },
                { name: 'Dumbbell / Barbell Overhead Press', setsReps: '3 & 10-15' },
                { name: 'Pull-ups / Lat Pulldown', setsReps: '3 & 8-12' },
                { name: 'Plank', setsReps: '2-3 x 30s–1m' },
              ]},
              { day: '2. Rest', isRest: true, exercises: [{ name: 'Rest / Istirahat', setsReps: '—' }] },
              { day: '3. Upper Body WO', isRest: false, exercises: [
                { name: 'Barbell Overhead Press', setsReps: '2 & 4-6' },
                { name: 'Pull Up / Lat Pull Down', setsReps: '3 & 8-10' },
                { name: 'Close Grip Bench Press', setsReps: '3 & 8-10' },
                { name: 'Wide Grip Seated Row × Dumbbell Lateral Raise', setsReps: '3&12 × 3&15' },
                { name: 'Lower Cable Cross Over', setsReps: '1 & 10' },
                { name: 'Upper Cable Cross Over', setsReps: '1 & 10' },
                { name: 'Facepull / Rear Delt Fly', setsReps: '2 × 12-15' },
                { name: 'Seated Bicep Curl', setsReps: '3 × 10-12' },
              ]},
              { day: '4. Rest', isRest: true, exercises: [{ name: 'Rest / Istirahat', setsReps: '—' }] },
              { day: '5. Lower Body WO', isRest: false, exercises: [
                { name: 'Deadlift / RDL', setsReps: '3 & 5-10' },
                { name: 'Barbell / Machine Squat', setsReps: '3 & 5-10' },
                { name: 'Leg Press', setsReps: '3 & 10-12' },
                { name: 'Leg Extensions', setsReps: '3 & 10-12' },
                { name: 'Hip Thrust / Abduction Machine', setsReps: '3–10-15' },
                { name: 'Calf Raises', setsReps: '3 & 12' },
              ]},
              { day: '6–7. Rest', isRest: true, exercises: [{ name: 'Rest / Istirahat', setsReps: '—' }] },
            ],
            reminders: [
              'Selalu start dari warm up dulu sebelum mulai latihan beban',
              'Selalu fokus ke intensitas latihan',
              'Beban yang dimainin itu harus max sesuai dengan reps yang udah ditulis',
              'Selalu progressive overload 2-4 minggu sekali bisa dari set, reps, dan beban.',
              'Fokus latihan, kurang kurangi ngobrol.',
              '**Istirahat secukupnya, ga ada patokan seberapa lama lo harus beristirahat (jangan terlalu lama dan jangan terlalu cepat)**',
            ],
            tips: 'Kalau latihan di variasi awal dengan 3 set, make sure selalu ada 1 set untuk warm up sebanyak 10-15 reps, dan total set akan jadi 4.',
          },
          {
            id: '4x', title: '4x Per Week', subtitle: 'Upper / Lower / Rest / Upper / Lower / Rest / Rest',
            days: [
              { day: '1. Upper Body WO', isRest: false, exercises: [
                { name: 'Barbell Overhead Press', setsReps: '2 & 4-6' },
                { name: 'Pull Up / Lat Pull Down', setsReps: '3 & 8-10' },
                { name: 'Close Grip Bench Press', setsReps: '3 & 8-10' },
                { name: 'Wide Grip Seated Row × Lateral Raise', setsReps: '3&12 × 3&15' },
                { name: 'Lower Cable Cross Over', setsReps: '1 & 10' },
                { name: 'Upper Cable Cross Over', setsReps: '1 & 10' },
                { name: 'Facepull / Rear Delt Fly', setsReps: '2 × 12-15' },
                { name: 'Seated Bicep Curl', setsReps: '3 × 10-12' },
              ]},
              { day: '2. Lower Body WO', isRest: false, exercises: [
                { name: 'Deadlift / RDL', setsReps: '3 & 5-10' },
                { name: 'Barbell / Machine Squat', setsReps: '3 & 5-10' },
                { name: 'Leg Press', setsReps: '3 & 10-12' },
                { name: 'Leg Extension', setsReps: '3 & 10-12' },
                { name: 'Hip Thrust / Abduction Machine', setsReps: '3–10-15' },
                { name: 'Calf Raises', setsReps: '3 & 15-20' },
              ]},
              { day: '3. Rest', isRest: true, exercises: [{ name: 'Rest / Istirahat', setsReps: '—' }] },
              { day: '4. Upper Body WO', isRest: false, exercises: [
                { name: 'Incline Bench Press', setsReps: '3 & 6-8' },
                { name: 'Cable Fly', setsReps: '2 & 10-12' },
                { name: 'Weighted Pull Up', setsReps: '3 & 6-8' },
                { name: 'High Cable Lateral Raise', setsReps: '2-3 & 8-10' },
                { name: 'Deficit Pendlay Row', setsReps: '2 & 6-8' },
                { name: 'Cable Overhead Tricep Extension', setsReps: '2 & 8-10' },
                { name: 'Bayesian Curl', setsReps: '2 & 8-10' },
              ]},
              { day: '5. Lower Body WO', isRest: false, exercises: [
                { name: 'Deadlift / RDL', setsReps: '4 & 5-10' },
                { name: 'Leg Press', setsReps: '4 & 10-12' },
                { name: 'Hip Thrust / Abduction Machine', setsReps: '3 & 8-10' },
                { name: 'Slow Eccentric Leg Extension', setsReps: '3 & 8-10' },
                { name: 'Calf Raises', setsReps: '4 × 15-20' },
                { name: 'Leg Raises', setsReps: '3 × 10-20' },
              ]},
              { day: '6–7. Rest', isRest: true, exercises: [{ name: 'Rest / Istirahat', setsReps: '—' }] },
            ],
            reminders: [
              'Selalu start dari warm up dulu sebelum mulai latihan beban',
              'Selalu fokus ke intensitas latihan',
              'Beban yang dimainin itu harus max sesuai dengan reps yang udah ditulis',
              'Selalu progressive overload 2-4 minggu sekali bisa dari set, reps, dan beban.',
              'Fokus latihan, kurang kurangi ngobrol.',
              '**Istirahat secukupnya, ga ada patokan seberapa lama lo harus beristirahat (jangan terlalu lama dan jangan terlalu cepat)**',
            ],
            tips: 'Kalau latihan di variasi awal dengan 3 set, make sure selalu ada 1 set untuk warm up sebanyak 10-15 reps, dan total set akan jadi 4.',
          },
          {
            id: '5x', title: '5x Per Week', subtitle: 'Push / Pull / Legs & Shoulder / Rest / Upper / Lower / Rest',
            days: [
              { day: '1. Push', isRest: false, exercises: [
                { name: 'Incline Bench Press', setsReps: '3 & 6-8' },
                { name: 'Flat Bench Press', setsReps: '3 & 8-10' },
                { name: 'Weighted Dips', setsReps: '3-4 & 10-12' },
                { name: 'Pec Deck Fly', setsReps: '3-4 & 12' },
                { name: 'Overhead Tricep Extension', setsReps: '3 & 10-12' },
                { name: 'Single Arm Tricep Push Down', setsReps: '3 & 12-15' },
                { name: 'Reserve Grip Tricep Push Down', setsReps: '3 & 10-12' },
                { name: 'Ab Crunch Machine', setsReps: '3 & 12-15' },
              ]},
              { day: '2. Pull', isRest: false, exercises: [
                { name: 'Lat Pull Down', setsReps: '2-3 & 6-8' },
                { name: 'Reserve Grip LPD', setsReps: '2-3 & 8-10' },
                { name: '1 Arm Seated Cable Row', setsReps: '3 & 10-12' },
                { name: 'Cable Straight Arm Pull Down', setsReps: '3 & 10-12' },
                { name: 'Seated Bicep Curl', setsReps: '3–10-12' },
                { name: 'T-Bar Bicep Curl', setsReps: '3 & 8-10' },
                { name: 'Cable Hammer Curl', setsReps: '3 & 10-15' },
              ]},
              { day: '3. Leg & Shoulder', isRest: false, exercises: [
                { name: 'Deadlift', setsReps: '2-3 & 6-8' },
                { name: 'Squat', setsReps: '2-3 & 6-10' },
                { name: 'Leg Extension (optional)', setsReps: '3 & 10-15' },
                { name: 'Lateral Raise', setsReps: '3-4 & 10-15' },
                { name: 'Overhead DBL Press / Barbell Overhead Press', setsReps: '3 & 8-10' },
                { name: 'Rear Delt Fly / Face Pull', setsReps: '3 & 12-15' },
                { name: 'Shrugs', setsReps: '3-4 & 12-15' },
              ]},
              { day: '4. Rest', isRest: true, exercises: [{ name: 'Rest / Istirahat', setsReps: '—' }] },
              { day: '5. Upper Body WO', isRest: false, exercises: [
                { name: 'Incline Barbell Bench Press', setsReps: '3 & 6-8' },
                { name: 'Cable Fly', setsReps: '2 & 10-12' },
                { name: 'Weighted Pull Up', setsReps: '3 & 6-8' },
                { name: 'High Cable Lateral Raise', setsReps: '2-3 & 8-10' },
                { name: 'Deficit Pendlay Row', setsReps: '2 & 6-8' },
                { name: 'Cable Overhead Tricep Extension', setsReps: '2 & 8-10' },
                { name: 'Bayesian Curl', setsReps: '2 & 8-10' },
              ]},
              { day: '6. Lower Body WO', isRest: false, exercises: [
                { name: 'Deadlift / RDL', setsReps: '3 & 6-10' },
                { name: 'Leg Press', setsReps: '3-4 & 10-12' },
                { name: 'Hip Thrust / Abduction Machine', setsReps: '3 & 8-10' },
                { name: 'Slow Eccentric Leg Extension', setsReps: '3 & 8-10' },
                { name: 'Calf Raises', setsReps: '4 × 15-20' },
                { name: 'Leg Raises', setsReps: '3 × 10-20' },
              ]},
              { day: '7. Rest', isRest: true, exercises: [{ name: 'Rest / Istirahat', setsReps: '—' }] },
            ],
            reminders: [
              'Selalu start dari warm up dulu sebelum mulai latihan beban',
              'Selalu fokus ke intensitas latihan',
              'Beban yang dimainin itu harus max sesuai dengan reps yang udah ditulis',
              'Selalu progressive overload 2-4 minggu sekali bisa dari set, reps, dan beban.',
              'Fokus latihan, kurang kurangi ngobrol.',
              '**Istirahat secukupnya, ga ada patokan seberapa lama lo harus beristirahat (jangan terlalu lama dan jangan terlalu cepat)**',
            ],
            tips: 'Kalau latihan di variasi awal dengan 3 set, make sure selalu ada 1 set untuk warm up sebanyak 10-15 reps, dan total set akan jadi 4.',
          },
        ]},
        { type: 'callout', icon: '⚠️', text: '**NOTE:** Setelah lo pilih program latihan, make sure keep it consistent sampai 3 bulan kalau lo mau hasilnya maksimal. Kalau ada masalah, langsung tag **@cenhfits** di VIP community — gw bakalan jawab semua kebutuhan kalian untuk progress bentukin otot.' },
      ] },
    ],
  },
  {
    id: 6, code: 'FINAL', title: 'FINAL — Your Next Step', icon: Flag,
    color: 'from-orange-500/20 to-orange-500/5', accent: 'text-orange-400',
    border: 'border-orange-500/30', badge: 'bg-orange-500/20 text-orange-400',
    locked: false,
    lessons: [
      { id: '6-1', type: 'video', title: 'FINAL — Your Next Step', duration: '15 min', content: [
        { type: 'video_embed', src: 'https://www.youtube.com/embed/eUpr3wGOm3A' },
      ] },
    ],
  },
  {
    id: 7, code: 'GYM MYTH', title: 'Gym Myths Debunked', icon: Zap,
    color: 'from-pink-500/20 to-pink-500/5', accent: 'text-pink-400',
    border: 'border-pink-500/30', badge: 'bg-pink-500/20 text-pink-400',
    locked: true, comingSoon: true, lessons: [],
  },
];

const TOTAL_LESSONS = chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);

// ── Progress Bar ──────────────────────────────────────────────────────────────
const ProgressBar = ({ value, color = 'bg-orange-500', className = '' }) => (
  <div className={`h-1.5 bg-white/10 rounded-full overflow-hidden ${className}`}>
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`h-full ${color} rounded-full`}
    />
  </div>
);

// ── No Access Screen ──────────────────────────────────────────────────────────
const NoAccessScreen = ({ user }) => {
  const [paymentOpen, setPaymentOpen] = useState(false);
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md text-center"
      >
        <div className="w-20 h-20 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-9 h-9 text-orange-500" />
        </div>
        <h2 className="text-2xl font-black text-white mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Akses Course Belum Aktif
        </h2>
        <p className="text-neutral-400 mb-2">
          Hai <strong className="text-white">{user?.name}</strong>, akun kamu sudah terdaftar.
        </p>
        <p className="text-neutral-400 mb-8">
          Untuk mengakses 12 Week Journey, selesaikan pembayaran terlebih dahulu.
        </p>
        <button
          onClick={() => setPaymentOpen(true)}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-black font-bold px-8 py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/30"
        >
          <Zap className="w-4 h-4" />
          Lihat Harga dan Daftar
        </button>
        <p className="text-neutral-600 text-xs mt-6">
          Sudah bayar? Hubungi kami dan akses akan diaktifkan dalam 1x24 jam.
        </p>
      </motion.div>
      <PaymentModal isOpen={paymentOpen} onClose={() => setPaymentOpen(false)} />
    </div>
  );
};

// ── Accordion Block ───────────────────────────────────────────────────────────
const AccordionBlock = ({ title, items }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden my-2">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }} className="text-neutral-400 text-xs leading-none">▶</motion.span>
          <span className="text-neutral-200 font-medium text-sm">{title}</span>
        </div>
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

// ── Workout Program Selector ─────────────────────────────────────────────────
const WorkoutProgramSelector = ({ programs }) => {
  const [selected, setSelected] = useState(null);
  const prog = programs.find(p => p.id === selected);
  const boldify = (t) => t.replace(/\*\*(.+?)\*\*/g, '<strong class="text-neutral-200">$1</strong>');

  return (
    <AnimatePresence mode="wait">
      {!selected ? (
        <motion.div key="cards"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
          className="my-4 space-y-3">
          {programs.map(p => (
            <motion.button key={p.id} onClick={() => setSelected(p.id)} whileHover={{ x: 4 }}
              className="w-full bg-[#1A1A1A] border border-white/10 hover:border-orange-500/30 rounded-xl p-4 text-left flex items-center justify-between group transition-colors duration-200">
              <div>
                <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-0.5">{p.title}</p>
                <p className="text-white font-semibold text-sm">{p.subtitle}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-orange-500 transition-colors flex-shrink-0" />
            </motion.button>
          ))}
        </motion.div>
      ) : (
        <motion.div key="table"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
          className="my-4">
          <button onClick={() => setSelected(null)}
            className="flex items-center gap-2 text-neutral-400 hover:text-white text-sm mb-5 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Kembali ke pilihan program
          </button>
          <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-1">{prog.title}</p>
          <h3 className="text-white font-bold text-lg mb-5">{prog.subtitle}</h3>

          <div className="rounded-xl overflow-hidden border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-4 py-3 text-left text-neutral-400 text-xs font-semibold uppercase tracking-wider w-36">Day</th>
                  <th className="px-4 py-3 text-left text-neutral-400 text-xs font-semibold uppercase tracking-wider">Exercise & Sets</th>
                </tr>
              </thead>
              <tbody>
                {prog.days.map((day, di) =>
                  day.exercises.map((ex, ei) => (
                    <tr key={`${di}-${ei}`} className={`border-t border-white/5 ${day.isRest ? 'bg-white/[0.015]' : di % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                      {ei === 0 && (
                        <td rowSpan={day.exercises.length}
                          className={`px-4 py-3 align-top text-sm font-semibold border-r border-white/5 ${day.isRest ? 'text-neutral-500' : 'text-orange-400'}`}>
                          {day.day}
                        </td>
                      )}
                      <td className="px-4 py-3">
                        {day.isRest ? (
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 flex-shrink-0" />
                            <span className="text-neutral-400 text-sm italic">Rest / Istirahat</span>
                          </div>
                        ) : (
                          <div>
                            <p className="text-neutral-200 text-sm leading-relaxed">{ex.name}</p>
                            <p className="text-orange-400 text-xs font-mono font-semibold mt-1">{ex.setsReps}</p>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {prog.reminders && (
            <div className="mt-4 bg-white/[0.03] border border-white/10 rounded-xl p-4">
              <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mb-3">Reminder</p>
              <ul className="space-y-1.5">
                {prog.reminders.map((r, i) => (
                  <li key={i} className="text-neutral-400 text-xs flex gap-2 leading-relaxed">
                    <span className="flex-shrink-0 mt-1.5 w-1 h-1 rounded-full bg-neutral-600" />
                    <span dangerouslySetInnerHTML={{ __html: boldify(r) }} />
                  </li>
                ))}
              </ul>
              {prog.tips && (
                <p className="text-neutral-500 text-xs mt-3 italic border-t border-white/5 pt-3"
                  dangerouslySetInnerHTML={{ __html: boldify(prog.tips) }} />
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ── Lesson View ───────────────────────────────────────────────────────────────
// FIX 1: Pisahkan tombol "Pelajaran Berikutnya" dari "Tandai Selesai & Lanjut"
// FIX 2: Bug loading stuck — setLoading(false) sekarang selalu dipanggil di finally
const LessonView = ({ lesson, isCompleted, onComplete, onBack, nextLesson, onNextLesson, nextChapter, onNextChapter }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [justCompleted, setJustCompleted] = useState(false);

  const effectivelyCompleted = isCompleted || justCompleted;

  // Kasus: ada materi berikutnya di chapter yang sama — tampilkan tombol "Pelajaran Berikutnya" saja
  // Tombol ini TIDAK perlu menandai selesai dulu (hanya navigasi)
  const handleNextLesson = () => {
    onNextLesson();
  };

  // Kasus: ini materi terakhir di chapter, tombol untuk tandai selesai & lanjut ke chapter berikutnya
  const handleCompleteAndAdvance = async () => {
    // Jika sudah selesai sebelumnya, langsung navigasi
    if (effectivelyCompleted) {
      if (nextChapter) { onNextChapter(); return; }
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onComplete();
      setJustCompleted(true);
      // Navigasi ke chapter berikutnya setelah sukses ditangani di parent (onNextChapter akan trigger feedback)
      if (nextChapter) {
        onNextChapter();
        return;
      }
    } catch {
      setError('Gagal menyimpan. Cek koneksi internet kamu.');
    } finally {
      // FIX 2: Selalu reset loading di finally agar tidak stuck
      setLoading(false);
    }
  };

  // Kasus: materi terakhir, tidak ada chapter berikutnya — hanya tandai selesai
  const handleMarkDone = async () => {
    if (effectivelyCompleted) return;
    setLoading(true);
    setError('');
    try {
      await onComplete();
      setJustCompleted(true);
    } catch {
      setError('Gagal menyimpan. Cek koneksi internet kamu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="h-full flex flex-col">
      <button onClick={onBack} className="flex items-center gap-2 text-neutral-400 hover:text-white text-sm mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4" />Kembali ke chapter
      </button>

      <div className="flex items-center gap-2 mb-4">
        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${lesson.type === 'video' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}`}>
          {lesson.type === 'video' ? '▷ VIDEO' : '✦ TEKS'}
        </span>
        <span className="text-neutral-500 text-xs">{lesson.duration}</span>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>{lesson.title}</h2>

      {lesson.type === 'video' && !Array.isArray(lesson.content) && (
        <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl aspect-video flex flex-col items-center justify-center mb-6 gap-3">
          {lesson.videoUrl
            ? <iframe src={lesson.videoUrl} className="w-full h-full rounded-2xl" allow="autoplay; fullscreen" allowFullScreen title={lesson.title} />
            : <><div className="w-16 h-16 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center"><Play className="w-7 h-7 text-orange-500 ml-1" /></div><p className="text-neutral-500 text-sm">Video akan segera tersedia</p></>
          }
        </div>
      )}

      <div className="flex-1">
        {Array.isArray(lesson.content) ? lesson.content.map((block, i) => {
          const inlineHtml = (text) => text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-orange-400 hover:text-orange-300 underline">$1</a>');
          const Inline = ({ t }) => <span dangerouslySetInnerHTML={{ __html: inlineHtml(t) }} />;

          switch (block.type) {
            case 'callout':
              return (
                <div key={i} className="flex gap-3 bg-white/5 rounded-lg px-4 py-3 my-4">
                  <span className="text-lg leading-7 flex-shrink-0">{block.icon || '💡'}</span>
                  <p className="text-neutral-200 leading-7"><Inline t={block.text} /></p>
                </div>
              );
            case 'heading':
              return <h2 key={i} className="text-white font-bold text-lg mt-8 mb-3">{block.text}</h2>;
            case 'heading2':
              return <h2 key={i} className="text-white font-bold text-xl mt-10 mb-2">{block.text}</h2>;
            case 'heading3':
              return <h3 key={i} className="text-white font-semibold text-base mt-6 mb-1">{block.text}</h3>;
            case 'text':
              return <p key={i} className="text-neutral-300 leading-7 my-1"><Inline t={block.text} /></p>;
            case 'highlight':
              return (
                <div key={i} className="bg-white/5 border-l-2 border-orange-500 px-4 py-3 my-4 rounded-r-lg">
                  <p className="text-neutral-200 leading-7"><Inline t={block.text} /></p>
                </div>
              );
            case 'quote':
              return (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 my-1 italic">
                  <p className="text-neutral-300 text-sm"><Inline t={block.text} /></p>
                </div>
              );
            case 'list':
              return (
                <ul key={i} className="my-3 space-y-2">
                  {block.items.map((item, j) => (
                    <li key={j} className="text-neutral-300 leading-7 flex gap-3">
                      <span className="flex-shrink-0 mt-2.5 w-1.5 h-1.5 rounded-full bg-neutral-400" />
                      <span><Inline t={item} /></span>
                    </li>
                  ))}
                </ul>
              );
            case 'numbered':
              return (
                <ol key={i} className="my-3 space-y-2">
                  {block.items.map((item, j) => (
                    <li key={j} className="text-neutral-300 leading-7 flex gap-3">
                      <span className="flex-shrink-0 text-neutral-500 font-medium w-5">{j + 1}.</span>
                      <span><Inline t={item} /></span>
                    </li>
                  ))}
                </ol>
              );
            case 'full_image':
              return (
                <div key={i} className="my-6">
                  {block.caption && <p className="text-white font-semibold text-base mb-2">{block.caption}</p>}
                  <img src={block.src} alt={block.alt || ''} style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '0.75rem' }} onError={e => { e.target.style.display = 'none'; }} />
                </div>
              );
            case 'image':
              if (block.size === 'product') {
                return (
                  <div key={i} className="my-3 flex justify-center">
                    <img src={block.src} alt={block.alt || ''} className="h-44 w-auto max-w-[200px] object-contain rounded-xl bg-white/5" onError={e => { e.target.style.display = 'none'; }} />
                  </div>
                );
              }
              return (
                <div key={i} className="my-6">
                  {block.caption && <p className="text-white font-semibold text-base mb-2">{block.caption}</p>}
                  {block.large ? (
                    <img src={block.src} alt={block.alt || ''} style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '0.75rem', objectFit: 'unset' }} onError={e => { e.target.style.display = 'none'; }} />
                  ) : (
                    <img src={block.src} alt={block.alt || ''} className="rounded-xl w-full object-cover" style={{ maxHeight: block.fit === 'contain' ? undefined : '288px', objectFit: block.fit === 'contain' ? 'contain' : 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                  )}
                </div>
              );
            case 'divider':
              return <hr key={i} className="border-white/10 my-8" />;
            case 'video_embed':
              return (
                <div key={i} className="my-6 rounded-xl overflow-hidden aspect-video bg-black">
                  <iframe src={block.src} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="video" />
                </div>
              );
            case 'accordion':
              return <AccordionBlock key={i} title={block.title} items={block.items} />;
            case 'program_selector':
              return <WorkoutProgramSelector key={i} programs={block.programs} />;
            case 'link_card':
              return (
                <a key={i} href={block.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 my-2 transition-colors group">
                  <span className="text-neutral-200 text-sm flex-1">{block.text}</span>
                  <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors flex-shrink-0" />
                </a>
              );
            default:
              return null;
          }
        }) : lesson.content.split('\n').map((line, i) => {
          const html = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
          if (line.startsWith('- ')) return <p key={i} className="text-neutral-300 leading-7 flex gap-3 my-1"><span className="flex-shrink-0 mt-2.5 w-1.5 h-1.5 rounded-full bg-neutral-400" /><span dangerouslySetInnerHTML={{ __html: line.slice(2) }} /></p>;
          if (line.match(/^\d+\./)) return <p key={i} className="text-neutral-300 leading-7 my-1" dangerouslySetInnerHTML={{ __html: html }} />;
          if (line === '') return <div key={i} className="h-3" />;
          return <p key={i} className="text-neutral-300 leading-7 my-1" dangerouslySetInnerHTML={{ __html: html }} />;
        })}
      </div>

      {/* ── Action Buttons ── */}
      <div className="mt-8 pt-6 border-t border-white/10 space-y-2">
        {error && <p className="text-red-400 text-xs text-center">{error}</p>}

        {/* CASE 1: Ada materi berikutnya di chapter yang sama → hanya tampil "Pelajaran Berikutnya" */}
        {nextLesson ? (
          <button
            onClick={handleNextLesson}
            className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-black hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-200"
          >
            <ChevronRight className="w-4 h-4" />
            Pelajaran Berikutnya
          </button>
        ) : nextChapter ? (
          /* CASE 2: Materi terakhir di chapter, ada chapter berikutnya → "Tandai Selesai & Lanjut" */
          <button
            onClick={handleCompleteAndAdvance}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 ${
              effectivelyCompleted
                ? 'bg-orange-500 hover:bg-orange-400 text-black hover:shadow-lg hover:shadow-orange-500/30'
                : 'bg-orange-500 hover:bg-orange-400 text-black hover:shadow-lg hover:shadow-orange-500/30'
            }`}
          >
            {loading
              ? <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />Menyimpan...</>
              : effectivelyCompleted
                ? <><ChevronRight className="w-4 h-4" />Lanjut ke {nextChapter.title}</>
                : <><CheckCircle className="w-4 h-4" />Tandai Selesai & Lanjut</>
            }
          </button>
        ) : (
          /* CASE 3: Materi terakhir, tidak ada chapter berikutnya → hanya "Tandai Selesai" */
          <button
            onClick={handleMarkDone}
            disabled={loading || effectivelyCompleted}
            className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 ${
              effectivelyCompleted
                ? 'bg-green-500/20 border border-green-500/30 text-green-400 cursor-default'
                : 'bg-orange-500 hover:bg-orange-400 text-black hover:shadow-lg hover:shadow-orange-500/30'
            }`}
          >
            {loading
              ? <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />Menyimpan...</>
              : <><CheckCircle className="w-4 h-4" />{effectivelyCompleted ? 'Selesai Dipelajari' : 'Tandai Selesai'}</>
            }
          </button>
        )}

        {effectivelyCompleted && !nextLesson && !nextChapter && (
          <p className="text-center text-green-400 text-xs font-semibold">🎉 Lo udah selesaiin semua materi!</p>
        )}
      </div>
    </motion.div>
  );
};

// ── Completion Feedback Modal ─────────────────────────────────────────────────
const CHAPTER_NAMES = {
  0: 'Introduction',
  1: 'Mindset', 2: 'Nutrisi', 3: 'Masak',
  4: 'Build Your Muscle', 5: 'Workout Program', 6: 'Final',
};

const FEEDBACK_QUESTIONS = [
  { key: 'kualitas_materi', label: 'Bagaimana kualitas materi course ini?' },
  { key: 'kemudahan_pahami', label: 'Apakah materi mudah dipahami?' },
  { key: 'manfaat', label: 'Seberapa bermanfaat course ini buat kamu?' },
  { key: 'rekomendasikan', label: 'Apakah kamu akan merekomendasikan course ini?' },
];

const ANSWER_OPTIONS = [
  { value: 'Sangat Tidak Suka', emoji: '😡', color: 'border-red-500/50 bg-red-500/10 text-red-400' },
  { value: 'Tidak Suka',        emoji: '😕', color: 'border-orange-500/50 bg-orange-500/10 text-orange-400' },
  { value: 'Netral',            emoji: '😐', color: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400' },
  { value: 'Suka',              emoji: '😊', color: 'border-green-500/50 bg-green-500/10 text-green-400' },
  { value: 'Sangat Suka',       emoji: '🤩', color: 'border-emerald-400/50 bg-emerald-500/10 text-emerald-400' },
];

const CompletionFeedbackModal = ({ isOpen, onClose, userId, chapterId, onFeedbackDone }) => {
  const [answers, setAnswers] = useState({});
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) { setAnswers({}); setComment(''); setSubmitted(false); }
  }, [isOpen, chapterId]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const allAnswered = FEEDBACK_QUESTIONS.every(q => answers[q.key]);

  const markDone = () => {
    if (userId && chapterId !== null) {
      localStorage.setItem(`feedback_done_${userId}_ch${chapterId}`, '1');
    }
  };

  const handleSubmit = async () => {
    if (!allAnswered) return;
    setLoading(true);
    try {
      await api.post('/api/feedback', { chapter_id: chapterId, answers, comment });
      setSubmitted(true);
      markDone();
    } catch {}
    setLoading(false);
  };

  const handleClose = () => {
    markDone();
    onClose();
    // Callback setelah feedback selesai (lanjutkan navigasi ke chapter berikutnya)
    if (onFeedbackDone) onFeedbackDone();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50" />

          <motion.div initial={{ opacity: 0, scale: 0.92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }} transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">

            <div className="bg-[#141414] border border-white/10 rounded-2xl w-full max-w-lg pointer-events-auto shadow-2xl shadow-black/60 max-h-[90vh] overflow-y-auto">

              {submitted ? (
                <div className="p-10 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}
                    className="w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="w-9 h-9 text-green-400" />
                  </motion.div>
                  <h3 className="text-white font-black text-xl mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Terima kasih!</h3>
                  <p className="text-neutral-400 text-sm mb-6">Feedback kamu sangat berarti buat kami. Terus semangat menjalankan 3 pilar!</p>
                  <button onClick={handleClose} className="bg-orange-500 hover:bg-orange-400 text-black font-bold px-8 py-3 rounded-xl transition-all">
                    Lanjut ke Chapter Berikutnya
                  </button>
                </div>
              ) : (
                <>
                  <div className="p-6 border-b border-white/5 text-center">
                    <div className="text-4xl mb-3">🏆</div>
                    <h3 className="text-white font-black text-xl mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Chapter {chapterId} selesai!
                    </h3>
                    <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-1">
                      {CHAPTER_NAMES[chapterId] || `Chapter ${chapterId}`}
                    </p>
                    <p className="text-neutral-400 text-sm">Luangkan 1 menit untuk kasih feedback kamu.</p>
                  </div>

                  <div className="p-6 space-y-6">
                    {FEEDBACK_QUESTIONS.map((q, qi) => (
                      <div key={q.key}>
                        <p className="text-white text-sm font-semibold mb-3">
                          <span className="text-orange-500 mr-2">{qi + 1}.</span>{q.label}
                        </p>
                        <div className="grid grid-cols-5 gap-2">
                          {ANSWER_OPTIONS.map(opt => {
                            const selected = answers[q.key] === opt.value;
                            return (
                              <button key={opt.value} onClick={() => setAnswers(prev => ({ ...prev, [q.key]: opt.value }))}
                                className={`flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl border-2 transition-all duration-150 ${
                                  selected ? opt.color + ' scale-105' : 'border-white/10 bg-white/3 hover:border-white/20'
                                }`}>
                                <span className="text-xl">{opt.emoji}</span>
                                <span className={`text-[9px] font-semibold text-center leading-tight ${selected ? '' : 'text-neutral-500'}`}>
                                  {opt.value}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    <div>
                      <p className="text-neutral-400 text-sm mb-2">Ada yang ingin ditambahkan? <span className="text-neutral-600">(opsional)</span></p>
                      <textarea
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="Cerita pengalamanmu..."
                        rows={3}
                        className="w-full bg-[#1A1A1A] border border-white/10 text-white text-sm rounded-xl px-4 py-3 placeholder-neutral-600 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button onClick={handleClose}
                        className="flex-1 py-3 rounded-xl border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 text-sm font-semibold transition-all">
                        Lewati
                      </button>
                      <button onClick={handleSubmit} disabled={!allAnswered || loading}
                        className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold py-3 rounded-xl transition-all text-sm">
                        <Send className="w-4 h-4" />
                        {loading ? 'Mengirim...' : 'Kirim Feedback'}
                      </button>
                    </div>

                    {!allAnswered && (
                      <p className="text-center text-neutral-600 text-xs">Jawab semua pertanyaan dulu ya.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ── Chapter View ──────────────────────────────────────────────────────────────
const ChapterView = ({ chapter, completedLessons, onLessonComplete, onBack, allChapters, onGoToChapter }) => {
  const [activeLesson, setActiveLesson] = useState(null);
  const Icon = chapter.icon;

  // FIX 3: Reset activeLesson setiap chapter berubah agar isi tidak tertinggal dari chapter lama
  useEffect(() => {
    setActiveLesson(null);
  }, [chapter.id]);

  const chapterDone = chapter.lessons.filter(l => completedLessons.includes(l.id)).length;
  const chapterPct = chapter.lessons.length > 0 ? Math.round((chapterDone / chapter.lessons.length) * 100) : 0;

  const activeLessonIdx = activeLesson ? chapter.lessons.findIndex(l => l.id === activeLesson.id) : -1;
  const nextLesson = activeLessonIdx >= 0 && activeLessonIdx < chapter.lessons.length - 1
    ? chapter.lessons[activeLessonIdx + 1]
    : null;
  const nextChapter = allChapters
    ? allChapters.find(c => c.id === chapter.id + 1 && !c.locked)
    : null;

  if (activeLesson) {
    return (
      <LessonView
        lesson={activeLesson}
        isCompleted={completedLessons.includes(activeLesson.id)}
        onComplete={() => onLessonComplete(chapter.id, activeLesson.id)}
        onBack={() => setActiveLesson(null)}
        nextLesson={nextLesson}
        onNextLesson={() => setActiveLesson(nextLesson)}
        nextChapter={!nextLesson ? nextChapter : null}  // Hanya pass nextChapter kalau ini lesson terakhir
        onNextChapter={() => { onGoToChapter && onGoToChapter(chapter, nextChapter); }}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
      <button onClick={onBack} className="flex items-center gap-2 text-neutral-400 hover:text-white text-sm mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4" />Semua Chapter
      </button>

      <div className={`bg-gradient-to-br ${chapter.color} border ${chapter.border} rounded-2xl p-6 mb-6`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${chapter.badge}`}>Chapter {chapter.id}</span>
          <span className={`text-sm font-bold ${chapter.accent}`}>{chapterPct}%</span>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <Icon className={`w-8 h-8 ${chapter.accent}`} />
          <div>
            <p className={`text-xs font-bold uppercase tracking-widest ${chapter.accent}`}>{chapter.code}</p>
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>{chapter.title}</h2>
          </div>
        </div>
        <ProgressBar value={chapterPct} />
        <p className="text-neutral-500 text-xs mt-2">{chapterDone} dari {chapter.lessons.length} pelajaran selesai</p>
      </div>

      <div className="space-y-3">
        {chapter.lessons.map((lesson) => {
          const done = completedLessons.includes(lesson.id);
          return (
            <motion.button key={lesson.id} onClick={() => setActiveLesson(lesson)} whileHover={{ x: 4 }}
              className="w-full bg-[#1A1A1A] border border-white/10 hover:border-orange-500/30 rounded-xl p-4 flex items-center gap-4 text-left transition-colors group">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-green-500/20' : lesson.type === 'video' ? 'bg-blue-500/20' : 'bg-orange-500/20'}`}>
                {done
                  ? <CheckCircle className="w-4 h-4 text-green-400" />
                  : lesson.type === 'video'
                    ? <Play className="w-3.5 h-3.5 text-blue-400 ml-0.5" />
                    : <FileText className="w-3.5 h-3.5 text-orange-400" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate transition-colors ${done ? 'text-green-400' : 'text-white group-hover:text-orange-400'}`}>{lesson.title}</p>
                <p className="text-neutral-500 text-xs mt-0.5">{lesson.duration}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-orange-500 transition-colors flex-shrink-0" />
            </motion.button>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-white/5">
        {chapterPct === 100 ? (
          nextChapter ? (
            <button
              onClick={() => onGoToChapter && onGoToChapter(chapter, nextChapter)}
              className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-black hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-200"
            >
              Lanjut ke Chapter {nextChapter.id}: {nextChapter.title}
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <p className="text-center text-green-400 text-sm font-bold py-2">🎉 Semua chapter selesai!</p>
          )
        ) : (
          (() => {
            const firstIncomplete = chapter.lessons.find(l => !completedLessons.includes(l.id));
            return firstIncomplete ? (
              <button
                onClick={() => setActiveLesson(firstIncomplete)}
                className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-500/30 text-white transition-all duration-200"
              >
                <Play className="w-4 h-4 text-orange-500" />
                Lanjutkan: {firstIncomplete.title}
              </button>
            ) : null;
          })()
        )}
      </div>
    </motion.div>
  );
};

// ── Bonus View ───────────────────────────────────────────────────────────────
const TRACKING_CONTENT = [
  { type: 'image', src: '/bonus-philip.webp', alt: 'Philip Vasquez' },
  { type: 'callout', icon: '▶', text: 'Pelajari cara ngetrack latihan lo supaya progress lo terukur dan terarah.' },
  { type: 'video_embed', src: 'https://www.youtube.com/embed/E1VhXHmWRhs' },
  { type: 'link_card', href: 'https://educated-curve-705.notion.site/Workout-Tracker-BONUS-86349a76c91182b98b5d81dc031262f5', text: '📋 Akses Workout Tracker — BONUS' },
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
          <div style={{ margin: '1.5rem 0' }}>
            <p style={{ color: '#fff', fontWeight: 600, fontSize: '1rem', marginBottom: '0.5rem' }}>
              Cara Duplicate WO Tracker ke Notion lo
            </p>
            <img
              src="/cara-duplicate-wo-tracker.webp"
              alt="Cara duplicate workout tracker"
              style={{ display: 'block', width: '100%', height: 'auto', borderRadius: '0.75rem', maxWidth: '100%' }}
            />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div key="bonus-home" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
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
                <div className="flex items-start justify-between">
                  <div className={`w-14 h-14 rounded-2xl ${b.iconBg} border flex items-center justify-center text-3xl`}>
                    {b.emoji}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${b.iconBg} border ${b.accent}`}>{b.label}</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-base leading-snug">{b.title}</p>
                  <p className={`text-xs font-semibold mt-0.5 ${b.accent}`}>{b.subtitle}</p>
                  <p className="text-neutral-400 text-sm mt-3 leading-relaxed">{b.description}</p>
                </div>
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
};

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [activeChapter, setActiveChapter] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [chapterProgress, setChapterProgress] = useState({});
  const [activePage, setActivePage] = useState(null);

  // FIX 4: Feedback state — menyimpan {chapterId, pendingNextChapter} 
  // Feedback muncul saat perpindahan CHAPTER (bukan materi), setelah lesson terakhir selesai
  const [feedbackState, setFeedbackState] = useState(null); // null | { chapterId, nextChapter }

  const [user, setUser] = useState(() => {
    try { return JSON.parse((localStorage.getItem('user') || sessionStorage.getItem('user'))); }
    catch { return null; }
  });

  const fetchProgress = useCallback(async (userId) => {
    try {
      const { data } = await api.get('/api/progress');
      setCompletedLessons(data.completed_lessons);
      setOverallProgress(data.overall_progress);
      setChapterProgress(data.chapter_progress);
    } catch {}
  }, []);

  useEffect(() => {
    if (!(localStorage.getItem('token') || sessionStorage.getItem('token'))) { navigate('/login'); return; }
    api.get('/api/auth/me').then(({ data }) => {
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      fetchProgress(data.id);
    }).catch(() => {
      navigate('/login');
    });
  }, [navigate, fetchProgress]);

  useEffect(() => {
    if (activeChapter) {
      window.history.pushState({ inChapter: true }, '');
    }
  }, [activeChapter]);

  useEffect(() => {
    const handler = () => {
      if (activeChapter) {
        setActiveChapter(null);
        window.history.pushState({ dashboard: true }, '');
      }
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, [activeChapter]);

  const handleLessonComplete = async (chapterId, lessonId) => {
    const isAlready = completedLessons.includes(lessonId);
    try {
      let newCompleted;
      if (isAlready) {
        await api.delete('/api/progress/uncomplete', { data: { chapter_id: chapterId, lesson_id: lessonId } });
        newCompleted = completedLessons.filter(l => l !== lessonId);
      } else {
        await api.post('/api/progress/complete', { chapter_id: chapterId, lesson_id: lessonId });
        newCompleted = [...completedLessons, lessonId];
      }
      setCompletedLessons(newCompleted);
      const updatedChapterProgress = { ...chapterProgress };
      const chLessons = chapters.find(c => c.id === chapterId)?.lessons || [];
      const chDone = chLessons.filter(l => newCompleted.includes(l.id)).length;
      updatedChapterProgress[String(chapterId)] = chLessons.length > 0
        ? Math.round((chDone / chLessons.length) * 1000) / 10
        : 0;
      setChapterProgress(updatedChapterProgress);
      setOverallProgress(TOTAL_LESSONS > 0 ? Math.round((newCompleted.length / TOTAL_LESSONS) * 1000) / 10 : 0);
    } catch {}
  };

  // FIX 4 (lanjutan): Handler saat pindah chapter — tampilkan feedback dulu,
  // setelah feedback selesai baru navigasi ke chapter berikutnya
  const handleGoToChapter = useCallback((fromChapter, toChapter) => {
    const userId = user?.id;
    const fromChapterId = fromChapter?.id;

    // Cek apakah feedback untuk chapter ini sudah pernah diisi
    const feedbackAlreadyDone = fromChapterId !== undefined && fromChapterId !== null
      && localStorage.getItem(`feedback_done_${userId}_ch${fromChapterId}`);

    if (!feedbackAlreadyDone && fromChapterId !== undefined && fromChapterId !== null) {
      // Tampilkan modal feedback; navigasi ke chapter berikutnya setelah modal ditutup
      setFeedbackState({ chapterId: fromChapterId, nextChapter: toChapter });
    } else {
      // Langsung navigasi
      setActiveChapter(toChapter);
      setActivePage(null);
    }
  }, [user]);

  // Dipanggil setelah user tutup/submit feedback → lanjut ke chapter berikutnya
  const handleFeedbackDone = useCallback(() => {
    if (feedbackState?.nextChapter) {
      setActiveChapter(feedbackState.nextChapter);
      setActivePage(null);
    }
    setFeedbackState(null);
  }, [feedbackState]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const hasAccess = user?.has_access;

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex">
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-[#111111] border-r border-white/5 z-40 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="bg-orange-500 p-1.5 rounded-lg"><Dumbbell className="w-4 h-4 text-black" /></div>
            <div className="flex flex-col leading-none">
              <span className="text-white font-black text-base tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>3PM System</span>
              <span className="text-orange-500 text-[9px] font-semibold tracking-widest uppercase">Train. Eat. Sleep.</span>
            </div>
          </div>
        </div>

        {user && (
          <div className="px-5 py-4 border-b border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-black font-black text-sm flex-shrink-0">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                <p className="text-neutral-500 text-xs truncate">{user.email}</p>
              </div>
            </div>
            {hasAccess && (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-neutral-500 text-xs">Progress Keseluruhan</span>
                  <span className="text-orange-400 text-xs font-bold">{overallProgress}%</span>
                </div>
                <ProgressBar value={overallProgress} />
                <p className="text-neutral-600 text-xs mt-1.5">{completedLessons.length} dari {TOTAL_LESSONS} pelajaran</p>
              </div>
            )}
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <p className="text-neutral-600 text-xs font-semibold uppercase tracking-widest px-3 mb-3">12 Week Journey</p>
          {chapters.map((ch) => {
            const Icon = ch.icon;
            const isActive = activeChapter?.id === ch.id;
            const pct = chapterProgress[String(ch.id)] || 0;
            return (
              <button key={ch.id} onClick={() => { if (!ch.locked && hasAccess) { setActiveChapter(ch); setActivePage(null); setSidebarOpen(false); } }}
                disabled={ch.locked || !hasAccess}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl mb-1 text-left transition-all duration-200 ${isActive ? 'bg-orange-500/15 border border-orange-500/30' : 'hover:bg-white/5 border border-transparent'} ${(ch.locked || !hasAccess) ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${ch.color}`}>
                  <Icon className={`w-4 h-4 ${ch.accent}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold uppercase tracking-wider truncate ${isActive ? 'text-orange-400' : 'text-neutral-300'}`}>{ch.code}</p>
                  {hasAccess && !ch.locked && pct > 0 && <div className="mt-1"><ProgressBar value={pct} /></div>}
                </div>
                {ch.locked ? <Lock className="w-3.5 h-3.5 text-neutral-600 flex-shrink-0" />
                  : !hasAccess ? <Lock className="w-3.5 h-3.5 text-neutral-600 flex-shrink-0" />
                  : isActive ? <div className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                  : pct === 100 ? <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  : null}
              </button>
            );
          })}
        </nav>

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

        <div className="p-4 border-t border-white/5 space-y-1">
          {user?.is_admin && (
            <button onClick={() => navigate('/admin')} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 rounded-xl transition-all text-sm font-semibold">
              <LayoutDashboard className="w-4 h-4" />Admin Panel
            </button>
          )}
          <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-neutral-400 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all text-sm">
            <LogOut className="w-4 h-4" />Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 bg-[#0D0D0D]/90 backdrop-blur-xl border-b border-white/5 px-5 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-neutral-400 hover:text-white transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-white font-bold text-sm sm:text-base truncate" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {activePage === 'bonus' ? 'Claim Your Bonus' : activeChapter ? activeChapter.title : '12 Week Journey'}
            </h1>
            <p className="text-neutral-500 text-xs">7 Chapter · {TOTAL_LESSONS} Pelajaran</p>
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-8 w-full">
          {!hasAccess ? (
            <NoAccessScreen user={user} />
          ) : (
            <AnimatePresence mode="wait">
              {activePage === 'bonus' ? (
                <BonusView key="bonus" renderBlocks={(blocks) => blocks.map((block, i) => {
                  const inlineHtml = (t) => (t || '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
                  switch (block.type) {
                    case 'image': return <img key={i} src={block.src} alt={block.alt || ''} className="w-full rounded-xl object-cover max-h-72 mb-4" />;
                    case 'callout': return <div key={i} className="flex gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 my-4"><span className="text-lg flex-shrink-0">{block.icon}</span><span className="text-neutral-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: inlineHtml(block.text) }} /></div>;
                    case 'video_embed': return <div key={i} className="my-6 rounded-xl overflow-hidden aspect-video bg-black"><iframe src={block.src} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="video" /></div>;
                    case 'link_card': return <a key={i} href={block.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 my-2 transition-colors group"><span className="text-neutral-200 text-sm flex-1">{block.text}</span><ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors flex-shrink-0" /></a>;
                    default: return null;
                  }
                })} />
              ) : activeChapter ? (
                <ChapterView
                  key={activeChapter.id}
                  chapter={activeChapter}
                  completedLessons={completedLessons}
                  onLessonComplete={handleLessonComplete}
                  onBack={() => setActiveChapter(null)}
                  allChapters={chapters}
                  onGoToChapter={handleGoToChapter}
                />
              ) : (
                <motion.div key="home" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <div className="bg-gradient-to-br from-orange-500/15 to-orange-500/5 border border-orange-500/20 rounded-2xl p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-black text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          Selamat datang, {user?.name?.split(' ')[0]} 👋
                        </h2>
                        <p className="text-neutral-400 text-sm mt-0.5">Lanjutkan perjalanan 12 minggu kamu</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-black text-orange-500">{overallProgress}%</p>
                        <p className="text-neutral-500 text-xs">selesai</p>
                      </div>
                    </div>
                    <ProgressBar value={overallProgress} className="h-2" />
                    <p className="text-neutral-500 text-xs mt-2">{completedLessons.length} dari {TOTAL_LESSONS} pelajaran selesai</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {chapters.map((ch) => {
                      const Icon = ch.icon;
                      const pct = chapterProgress[String(ch.id)] || 0;
                      return (
                        <motion.button key={ch.id} onClick={() => !ch.locked && setActiveChapter(ch)} disabled={ch.locked}
                          whileHover={!ch.locked ? { y: -4 } : {}} whileTap={!ch.locked ? { scale: 0.98 } : {}}
                          className={`relative bg-[#1A1A1A] border rounded-2xl p-5 text-left transition-all duration-200 group ${ch.locked ? 'opacity-50 cursor-not-allowed border-white/5' : 'border-white/10 hover:border-orange-500/30 cursor-pointer'}`}
                        >
                          {ch.comingSoon && <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest bg-white/10 text-neutral-400 px-2 py-0.5 rounded-full">Soon</span>}
                          {pct === 100 && <CheckCircle className="absolute top-3 right-3 w-5 h-5 text-green-400" />}

                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${ch.color} flex items-center justify-center mb-4`}>
                            <Icon className={`w-5 h-5 ${ch.accent}`} />
                          </div>
                          <span className={`text-xs font-bold uppercase tracking-widest ${ch.accent}`}>Chapter {ch.id}</span>
                          <h3 className="text-white font-bold text-sm mt-1 mb-1 group-hover:text-orange-400 transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>{ch.code}</h3>
                          <p className="text-neutral-500 text-xs leading-relaxed mb-3">{ch.title}</p>

                          {!ch.locked && (
                            <>
                              <ProgressBar value={pct} />
                              <p className="text-neutral-600 text-xs mt-1.5">{pct}% selesai</p>
                            </>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </main>
      </div>

      {/* FIX 4: Feedback modal hanya muncul saat perpindahan CHAPTER, bukan perpindahan materi */}
      <CompletionFeedbackModal
        isOpen={feedbackState !== null}
        onClose={() => setFeedbackState(null)}
        userId={user?.id}
        chapterId={feedbackState?.chapterId ?? null}
        onFeedbackDone={handleFeedbackDone}
      />
    </div>
  );
}