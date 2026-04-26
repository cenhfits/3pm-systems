import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, CheckCircle, MessageCircle, Dumbbell, Zap, Shield } from 'lucide-react';

const BCA_NUMBER = '3850937418';
const BCA_NAME = 'Vincent Hong';
const PRICE = 'Rp279.000';
const PRICE_NUM = '279000';
const WHATSAPP_PRIMARY = '6282213939288';
const WHATSAPP_PRIMARY_DISPLAY = '+62 822-1393-9288';
const WHATSAPP_BACKUP = '62859189684720';
const WHATSAPP_BACKUP_DISPLAY = '+62 859-1896-84720';

export default function PaymentModal({ isOpen, onClose }) {
  const [copiedNo, setCopiedNo] = useState(false);
  const [copiedAmt, setCopiedAmt] = useState(false);

  // Lock body scroll when modal open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const copy = (text, setter) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const waMessage = encodeURIComponent(
    `Halo, saya sudah transfer untuk 3PM System.\n\nNama: [isi nama kamu]\nNominal: ${PRICE}\n\n[lampirkan bukti transfer]`
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal — bottom sheet on mobile, centered on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-x-0 bottom-0 sm:inset-0 z-50 flex sm:items-center sm:justify-center sm:p-4 pointer-events-none"
          >
            <div className="bg-[#141414] border border-white/10 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-xl pointer-events-auto shadow-2xl shadow-black/60 max-h-[92vh] overflow-y-auto">

              {/* Drag handle - mobile only */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-4 sm:px-7 pt-3 sm:pt-6 pb-4 sm:pb-5 border-b border-white/5 sticky top-0 bg-[#141414] z-10">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-500 p-2 rounded-xl">
                    <Dumbbell className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <p className="text-white font-black text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>3PM System</p>
                    <p className="text-orange-500 text-xs font-semibold uppercase tracking-widest">Selesaikan Pembayaran</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 text-neutral-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-4 sm:px-7 py-4 sm:py-6 space-y-4">

                {/* Order */}
                <div className="bg-[#1E1E1E] rounded-xl px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-white font-bold">Full Course · Lifetime Access</p>
                      <p className="text-neutral-500 text-sm mt-0.5">Early bird · harga naik setelahnya</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-neutral-500 text-sm line-through">Rp4.849.998</p>
                      <p className="text-orange-500 font-black text-2xl leading-tight">{PRICE}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="bg-orange-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">Hemat 94%</span>
                    <span className="text-neutral-500 text-xs">Harga early bird · terbatas</span>
                  </div>
                </div>

                {/* BCA */}
                <div className="bg-[#1E1E1E] rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-black text-xs">BCA</span>
                    </div>
                    <p className="text-white font-bold">Transfer ke Bank BCA</p>
                  </div>

                  {/* Nomor Rekening */}
                  <div className="bg-[#111111] rounded-xl px-4 py-3">
                    <p className="text-neutral-500 text-xs mb-2">Nomor Rekening</p>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-white font-black text-lg sm:text-2xl tracking-widest">{BCA_NUMBER}</p>
                      <button
                        onClick={() => copy(BCA_NUMBER, setCopiedNo)}
                        className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-all flex-shrink-0 ${
                          copiedNo ? 'bg-green-500/20 text-green-400' : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {copiedNo ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copiedNo ? 'Tersalin' : 'Salin'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Atas Nama */}
                    <div className="bg-[#111111] rounded-xl px-4 py-3">
                      <p className="text-neutral-500 text-xs mb-1.5">Atas Nama</p>
                      <p className="text-white font-bold">{BCA_NAME}</p>
                    </div>
                    {/* Nominal */}
                    <div className="bg-[#111111] rounded-xl px-4 py-3">
                      <p className="text-neutral-500 text-xs mb-1.5">Nominal Transfer</p>
                      <div className="flex items-center gap-2">
                        <p className="text-orange-400 font-black text-lg">{PRICE}</p>
                        <button
                          onClick={() => copy(PRICE_NUM, setCopiedAmt)}
                          className={`p-1 rounded transition-all ${copiedAmt ? 'text-green-400' : 'text-neutral-600 hover:text-white'}`}
                        >
                          {copiedAmt ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['Transfer sesuai nominal', 'Screenshot bukti transfer', 'Kirim ke WhatsApp kami', 'Akses aktif maks. 1x24 jam'].map((s, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                      <span className="text-neutral-400 text-sm">{s}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Footer */}
              <div className="px-4 sm:px-7 pb-5 sm:pb-7 space-y-2.5">
                <a
                  href={`https://wa.me/${WHATSAPP_PRIMARY}?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-400 text-black font-bold py-2.5 rounded-xl transition-all duration-200 text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  Sudah Transfer? Konfirmasi via WhatsApp
                </a>
                <p className="text-center text-neutral-600 text-[11px]">
                  Tidak dibalas? Hubungi nomor backup:{' '}
                  <a
                    href={`https://wa.me/${WHATSAPP_BACKUP}?text=${waMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 underline underline-offset-2"
                  >
                    {WHATSAPP_BACKUP_DISPLAY}
                  </a>
                </p>
                <div className="flex items-center justify-center gap-1.5 text-neutral-600 text-xs">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Akses diaktifkan manual setelah transfer dikonfirmasi</span>
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
