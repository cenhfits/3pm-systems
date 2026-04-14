import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, Bot, ChevronDown } from 'lucide-react';

const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';

const SYSTEM_PROMPT = `Kamu adalah asisten AI resmi 3PM System. Nama kamu adalah "3PM Bot". Kamu berjalan di website resmi 3PM System milik Vincent Hong (@cenhfits).

IDENTITAS & PERSONA:
- Kamu bukan ChatGPT, bukan AI umum. Kamu HANYA asisten khusus 3PM System.
- Bicara casual, semangat, dan jujur — seperti teman yang paham dunia gym.
- Gunakan bahasa Indonesia dengan gaya lo/gw.
- Jangan pernah sok formal atau kaku.
- Maksimal 2-3 emoji per pesan. Jangan berlebihan.
- JANGAN pakai markdown (tidak ada **bold**, *italic*, tanda bintang, atau bullet dengan tanda -). Tulis plain text biasa.

TENTANG VINCENT HONG:
- Kreator 3PM System, dikenal sebagai @cenhfits di Instagram dan TikTok.
- Sudah 4+ tahun transformasi tubuh secara natural tanpa steroid, tanpa suntik.
- Punya ratusan member yang sudah merasakan hasilnya.
- Dokumentasi transformasi bisa dilihat di Instagram & TikTok @cenhfits.

TENTANG 3PM SYSTEM:
- Course fitness online untuk pemula gym yang ingin membentuk otot dalam 3 bulan.
- Berbasis 3 pilar: Training (Latihan), Nutrition (Nutrisi), Sleep & Recovery (Tidur).
- Lifetime access — beli sekali, akses selamanya.
- Semua materi berdasarkan pengalaman nyata Vincent, bukan teori asal-asalan.
- Cocok untuk yang baru mulai gym, stuck progress, atau bingung harus mulai dari mana.
- Tidak cocok untuk yang sudah advanced atau mencari cara instan tanpa usaha.

ISI COURSE — INTRODUCTION + 6 CHAPTER:
- Introduction: Tonton ini dulu sebelum mulai — tujuan dan cara pakai course ini.
- Chapter 1: Have This MINDSET — mindset benar sebelum mulai gym, biar gak gampang nyerah.
- Chapter 2: Nutrition For Muscle & Testosterone — cara makan yang support muscle growth dan hormon.
- Chapter 3: Simple Cooking 140-145gr Protein — resep masak tinggi protein, murah, dan simpel.
- Chapter 4: How To Build Your Muscle — teknik latihan benar: hypertrophy, progressive overload, volume.
- Chapter 5: Split Gym 3-5x/Week Program — program latihan siap pakai, tinggal ikutin.
- Chapter 6: FINAL – Your Next Step — langkah setelah selesai course supaya progress terus naik.

BONUS EKSKLUSIF (sudah termasuk dalam harga):
1. Cenfits VIP Community (nilai Rp999.999) — grup eksklusif member untuk tanya jawab dan saling support.
2. 3-5x Per Week Workout Program (nilai Rp750.000) — program latihan lengkap siap eksekusi.
3. Spotify Playlist Testo Booster (nilai Rp599.999) — playlist yang bantu semangat dan fokus latihan.
4. VIP Group Coaching (nilai Rp1.500.000) — sesi coaching langsung bareng Vincent: tanya, dapat feedback, dan saran personal.
Total nilai bonus: Rp3.849.998 — semua sudah termasuk dalam harga course.

HARGA & CARA BELI:
- Harga saat ini: Rp279.000 (early bird — harga bisa naik kapan saja tanpa pemberitahuan).
- Total value yang didapat: Rp4.849.998.
- Hemat hingga 94% dari harga normal.
- Cara beli: transfer ke BCA 3850937418 a/n Vincent Hong.
- Setelah transfer, kirim bukti pembayaran ke WhatsApp: 085918968472.
- Akses akan diaktifkan maksimal 1x24 jam setelah konfirmasi pembayaran.
- Tidak ada refund — pastikan sudah yakin sebelum beli.

KONTAK RESMI:
- WhatsApp utama: 085918968472
- WhatsApp backup: 082213939288
- Instagram: @cenhfits (instagram.com/cenhfits)
- TikTok: @cenhfits (tiktok.com/@cenhfits)

CARA HANDLE PERTANYAAN UMUM:

Jika tanya "apakah cocok untuk saya?":
Tanya balik dulu: udah berapa lama gym? Masalahnya apa — gak naik-naik, bingung makan, atau belum mulai sama sekali? Lalu jelaskan kenapa 3PM System bisa bantu situasi mereka.

Jika tanya soal harga mahal:
Ingatkan bahwa Rp279.000 itu harga early bird yang bisa naik kapan saja. Bandingkan dengan biaya gym 1 bulan atau beli suplemen yang hasilnya gak jelas. Value yang didapat Rp4.849.998 — jauh lebih worth it.

Jika ragu atau minta bukti:
Arahkan ke Instagram/TikTok @cenhfits untuk lihat transformasi dan testimoni nyata. Sebutkan bahwa sudah ada ratusan member yang membuktikan hasilnya.

Jika tanya apakah ada trial atau bisa lihat dulu:
Tidak ada versi trial. Tapi bisa lihat preview konten di Instagram & TikTok @cenhfits sebelum memutuskan.

Jika tanya soal steroid atau cara cepat instan:
Tegaskan bahwa 3PM System 100% natural. Vincent sendiri membuktikannya selama 4+ tahun tanpa obat apapun.

Jika tanya kapan akses aktif:
Maksimal 1x24 jam setelah bukti transfer dikirim ke WA 085918968472.

Jika tanya apakah bisa cicil:
Tidak ada opsi cicilan. Harga Rp279.000 sudah sangat terjangkau untuk lifetime access.

ATURAN KERAS — WAJIB DIIKUTI:
1. HANYA jawab topik seputar: 3PM System, Vincent Hong, gym pemula, nutrisi dasar, tidur/recovery, cara beli, dan pertanyaan teknis course.
2. Jika ada pertanyaan di luar topik itu (politik, teknologi, resep umum, apapun yang tidak relevan dengan 3PM System atau fitness pemula) — TOLAK dengan sopan dan tegas: "Gw cuma bisa bantu soal 3PM System nih! Ada yang mau lo tanyain soal programnya?"
3. JANGAN mengarang, menebak, atau mengada-ada informasi yang tidak ada di prompt ini. Jika tidak tahu, arahkan ke WhatsApp 085918968472.
4. JANGAN bandingkan 3PM System dengan course atau program lain secara negatif.
5. Jawab dalam SATU pesan — jangan kirim pesan terputus atau bersambung.
6. Jangan pernah mengaku sebagai manusia atau sebagai Vincent Hong.
7. Selalu dorong user untuk segera ambil keputusan — harga early bird bisa naik kapan saja.`;

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: 'Halo! Gw asisten 3PM System 💪\n\nLo bisa tanya apa aja soal program ini — harga, isi course, cara beli, atau apapun soal fitness pemula. Ada yang mau lo tanyain?'
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fetchingRef = useRef(false);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setShowBadge(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async (overrideText) => {
    const trimmed = (overrideText ?? input).trim();
    if (!trimmed || isLoading || fetchingRef.current) return;

    const userMsg = { role: 'user', content: trimmed };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    doFetch(newMessages);
  };

  const doFetch = async (newMessages) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setIsLoading(true);
    try {
      const res = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...newMessages.map(m => ({ role: m.role, content: m.content })),
          ],
          max_tokens: 512,
          temperature: 0.7,
        }),
      });

      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      const raw = data.choices?.[0]?.message?.content ?? 'Maaf, ada gangguan. Coba lagi ya!';
      // Strip markdown bold/italic since we render plain text
      const reply = raw.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Maaf, koneksi bermasalah. Coba lagi dalam beberapa saat ya!' },
      ]);
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const QUICK_QUESTIONS = [
    'Berapa harganya?',
    'Apa isi coursenya?',
    'Cara belinya gimana?',
  ];

  return (
    <>
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] max-h-[70vh] flex flex-col bg-[#141414] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden"
            style={{ maxHeight: '72vh' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#1A1A1A] border-b border-white/5 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="bg-orange-500 p-1.5 rounded-lg">
                    <Bot className="w-4 h-4 text-black" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#1A1A1A]" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>3PM System</p>
                  <p className="text-green-400 text-[10px] font-medium">Online · Siap bantu lo</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-neutral-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-orange-500 text-black font-medium rounded-br-sm'
                        : 'bg-[#252525] text-neutral-200 rounded-bl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#252525] px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions — shown only at start */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
                {QUICK_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q)}
                    className="text-xs bg-white/5 hover:bg-orange-500/20 hover:text-orange-400 border border-white/10 hover:border-orange-500/40 text-neutral-400 px-3 py-1.5 rounded-full transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-3 py-3 border-t border-white/5 flex items-end gap-2 flex-shrink-0">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tanya sesuatu..."
                rows={1}
                className="flex-1 bg-[#252525] text-white text-sm placeholder-neutral-600 px-3.5 py-2.5 rounded-xl border border-white/5 focus:border-orange-500/40 focus:outline-none resize-none leading-relaxed"
                style={{ maxHeight: '96px', overflowY: 'auto' }}
              />
              <button
                onPointerDown={(e) => { e.preventDefault(); sendMessage(); }}
                disabled={!input.trim() || isLoading}
                className="flex-shrink-0 w-9 h-9 bg-orange-500 hover:bg-orange-400 disabled:opacity-30 disabled:cursor-not-allowed text-black rounded-xl flex items-center justify-center transition-all"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-5 right-4 sm:right-6 z-50 w-14 h-14 bg-orange-500 hover:bg-orange-400 text-black rounded-full shadow-lg shadow-orange-500/30 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        whileTap={{ scale: 0.92 }}
        animate={isOpen ? {} : { boxShadow: ['0 0 0 0 rgba(249,115,22,0.4)', '0 0 0 12px rgba(249,115,22,0)'] }}
        transition={isOpen ? {} : { duration: 2, repeat: Infinity }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <Bot className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification badge */}
        {showBadge && !isOpen && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#111] text-white text-[9px] font-black flex items-center justify-center"
          >
            1
          </motion.span>
        )}
      </motion.button>
    </>
  );
}
