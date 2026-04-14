import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Dumbbell, Copy, CheckCircle, ChevronLeft, MessageCircle, Zap, Clock, Shield
} from 'lucide-react';

const PRICE = 'Rp275.000';
const PRICE_NUM = '275000';
const BCA_NUMBER = '3850937418';
const BCA_NAME = 'Vincent Hong';
const WHATSAPP_NUMBER = '6282213939288';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function PaymentPage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);

  const copyText = (text, setter) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const steps = [
    { num: 1, text: 'Transfer ke rekening BCA di bawah sesuai nominal yang tertera.' },
    { num: 2, text: 'Screenshot bukti transfer kamu.' },
    { num: 3, text: 'Kirim bukti transfer + nama kamu via WhatsApp ke nomor yang tertera.' },
    { num: 4, text: 'Akses course akan diaktifkan dalam maks. 1x24 jam (biasanya lebih cepat).' },
  ];

  const waMessage = encodeURIComponent(
    `Halo, saya sudah transfer untuk 3PM System.\n\nNama: [isi nama kamu]\nNominal: ${PRICE}\n\n[lampirkan bukti transfer]`
  );

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col">
      {/* Header */}
      <header className="border-b border-white/5 px-5 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm"
          >
            <ChevronLeft className="w-4 h-4" />Kembali
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-1.5 rounded-lg">
              <Dumbbell className="w-4 h-4 text-black" />
            </div>
            <span className="text-white font-black text-base" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              3PM System
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-5 py-10">
        <div className="max-w-lg mx-auto space-y-6">

          {/* Title */}
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="text-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-orange-400 bg-orange-500/10 px-3 py-1.5 rounded-full mb-4">
              <Zap className="w-3 h-3" />Langkah Terakhir
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Selesaikan Pembayaran
            </h1>
            <p className="text-neutral-400 text-sm">Transfer ke rekening BCA di bawah, lalu konfirmasi via WhatsApp.</p>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            variants={fadeInUp} initial="hidden" animate="visible"
            className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-5"
          >
            <p className="text-neutral-500 text-xs font-semibold uppercase tracking-widest mb-4">Ringkasan Pesanan</p>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-white font-semibold">3PM System — Full Course</p>
                <p className="text-neutral-500 text-xs mt-0.5">Lifetime access + semua update</p>
              </div>
              <p className="text-orange-500 font-black text-lg">{PRICE}</p>
            </div>
            <div className="border-t border-white/5 pt-3 flex justify-between">
              <span className="text-neutral-400 text-sm">Total</span>
              <span className="text-white font-black">{PRICE}</span>
            </div>
          </motion.div>

          {/* BCA Transfer Details */}
          <motion.div
            variants={fadeInUp} initial="hidden" animate="visible"
            className="bg-[#1A1A1A] border border-orange-500/20 rounded-2xl p-5 space-y-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-black text-xs">BCA</span>
              </div>
              <p className="text-white font-bold">Bank BCA</p>
            </div>

            {/* Account Number */}
            <div className="bg-[#111111] rounded-xl p-4">
              <p className="text-neutral-500 text-xs mb-1">Nomor Rekening</p>
              <div className="flex items-center justify-between gap-3">
                <p className="text-white font-black text-xl tracking-widest">{BCA_NUMBER}</p>
                <button
                  onClick={() => copyText(BCA_NUMBER, setCopied)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                    copied ? 'bg-green-500/20 text-green-400' : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  {copied ? <><CheckCircle className="w-3.5 h-3.5" />Tersalin</> : <><Copy className="w-3.5 h-3.5" />Salin</>}
                </button>
              </div>
            </div>

            {/* Account Name */}
            <div className="bg-[#111111] rounded-xl p-4">
              <p className="text-neutral-500 text-xs mb-1">Atas Nama</p>
              <p className="text-white font-semibold">{BCA_NAME}</p>
            </div>

            {/* Amount */}
            <div className="bg-[#111111] rounded-xl p-4">
              <p className="text-neutral-500 text-xs mb-1">Jumlah Transfer</p>
              <div className="flex items-center justify-between gap-3">
                <p className="text-orange-500 font-black text-xl">{PRICE}</p>
                <button
                  onClick={() => copyText(PRICE_NUM, setCopiedAmount)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                    copiedAmount ? 'bg-green-500/20 text-green-400' : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  {copiedAmount ? <><CheckCircle className="w-3.5 h-3.5" />Tersalin</> : <><Copy className="w-3.5 h-3.5" />Salin</>}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Steps */}
          <motion.div
            variants={fadeInUp} initial="hidden" animate="visible"
            className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-5"
          >
            <p className="text-neutral-500 text-xs font-semibold uppercase tracking-widest mb-4">Cara Pembayaran</p>
            <div className="space-y-3">
              {steps.map(({ num, text }) => (
                <div key={num} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-black font-black text-xs">{num}</span>
                  </div>
                  <p className="text-neutral-300 text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Deadline notice */}
          <motion.div
            variants={fadeInUp} initial="hidden" animate="visible"
            className="flex items-start gap-3 bg-orange-500/5 border border-orange-500/20 rounded-xl p-4"
          >
            <Clock className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
            <p className="text-neutral-400 text-sm">
              Selesaikan transfer dan konfirmasi dalam <strong className="text-white">1x24 jam</strong>. Akses akan diaktifkan setelah pembayaran dikonfirmasi.
            </p>
          </motion.div>

          {/* WhatsApp CTA */}
          <motion.a
            variants={fadeInUp} initial="hidden" animate="visible"
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-green-500/30 text-sm sm:text-base"
          >
            <MessageCircle className="w-5 h-5" />
            Konfirmasi Pembayaran via WhatsApp
          </motion.a>

          {/* Guarantee */}
          <motion.div
            variants={fadeInUp} initial="hidden" animate="visible"
            className="flex items-center justify-center gap-2 text-neutral-600 text-xs"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Pembayaran aman. Akses langsung setelah konfirmasi.</span>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
