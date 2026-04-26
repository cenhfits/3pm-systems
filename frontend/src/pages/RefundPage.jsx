import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Shield, FileText, AlertTriangle, CheckCircle, Clock, Mail } from 'lucide-react';

const Section = ({ number, title, children }) => (
  <div className="mb-8">
    <h2 className="text-white font-bold text-base mb-3 flex items-center gap-2">
      <span className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 text-xs font-bold flex-shrink-0">
        {number}
      </span>
      {title}
    </h2>
    <div className="text-neutral-400 text-sm leading-relaxed space-y-2 pl-8">
      {children}
    </div>
  </div>
);

const BulletList = ({ items, color = 'bg-green-500' }) => (
  <ul className="space-y-1.5 mt-1">
    {items.map((item, i) => (
      <li key={i} className="flex gap-2">
        <span className={`flex-shrink-0 mt-2 w-1 h-1 rounded-full ${color}`} />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

export default function RefundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Sticky Header */}
      <div className="border-b border-white/5 bg-[#0D0D0D]/95 sticky top-0 z-10 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <span>3PM System</span>
            <span>·</span>
            <span>Legal</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="mb-10 p-8 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-500/0 border border-green-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-green-400 text-xs font-bold uppercase tracking-widest">Legal Document</p>
              <h1 className="text-white font-black text-2xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Kebijakan Refund
              </h1>
            </div>
          </div>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Kebijakan pengembalian dana <strong className="text-white">3PM System</strong> berlaku sesuai
            UU No. 8 Tahun 1999 tentang Perlindungan Konsumen dan UU No. 19 Tahun 2016 tentang ITE.
            Harap baca kebijakan ini sebelum melakukan pembelian.
          </p>
          <p className="text-neutral-600 text-xs mt-3">Terakhir diperbarui: 2025</p>
        </div>

        {/* Related Policies */}
        <div className="grid grid-cols-2 gap-3 mb-10">
          <a href="/terms" className="flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <p className="text-white text-xs font-semibold">Syarat &amp; Ketentuan</p>
              <p className="text-neutral-600 text-[10px] mt-0.5">Aturan penggunaan platform</p>
            </div>
          </a>
          <a href="/privacy" className="flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-white text-xs font-semibold">Kebijakan Privasi</p>
              <p className="text-neutral-600 text-[10px] mt-0.5">Cara kami melindungi data kamu</p>
            </div>
          </a>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          <div className="p-4 rounded-xl border border-red-500/15 bg-red-500/5 text-center">
            <AlertTriangle className="w-5 h-5 text-red-400 mx-auto mb-2" />
            <p className="text-white text-xs font-bold">Pembelian Final</p>
            <p className="text-neutral-500 text-[10px] mt-1">Tidak dapat dikembalikan kecuali kondisi tertentu</p>
          </div>
          <div className="p-4 rounded-xl border border-green-500/15 bg-green-500/5 text-center">
            <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-2" />
            <p className="text-white text-xs font-bold">Pengajuan via Email</p>
            <p className="text-neutral-500 text-[10px] mt-1">cenhfits@gmail.com</p>
          </div>
          <div className="p-4 rounded-xl border border-blue-500/15 bg-blue-500/5 text-center">
            <Clock className="w-5 h-5 text-blue-400 mx-auto mb-2" />
            <p className="text-white text-xs font-bold">Proses 1x24 Jam</p>
            <p className="text-neutral-500 text-[10px] mt-1">Setelah verifikasi disetujui</p>
          </div>
        </div>

        <div className="h-px bg-white/5 mb-10" />

        {/* Sections */}
        <Section number="1" title="Kebijakan Umum">
          <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 mb-3">
            <p className="text-red-300 font-semibold text-sm">
              ⚠️ Seluruh pembelian di 3PM System bersifat final dan tidak dapat dikembalikan,
              kecuali memenuhi kondisi yang tercantum dalam kebijakan ini.
            </p>
          </div>
          <p>
            Dengan melakukan pembelian, pengguna dianggap telah memahami dan menyetujui
            bahwa akses ke konten digital tidak dapat dikembalikan setelah diaktifkan,
            sesuai dengan sifat produk digital yang tidak dapat "dikembalikan" secara fisik.
          </p>
        </Section>

        <Section number="2" title="Kondisi yang Memenuhi Syarat Refund">
          <p>Pengembalian dana hanya dapat dipertimbangkan dalam kondisi berikut:</p>
          <BulletList items={[
            'Terdapat kesalahan teknis internal dari pihak 3PM System yang terbukti mencegah pengguna mengakses konten yang telah dibayar',
            'Pembayaran berhasil diproses namun akses tidak diberikan dalam waktu 1x24 jam tanpa konfirmasi dari pihak kami',
            'Terjadi penagihan ganda (double charge) untuk transaksi yang sama',
          ]} />
        </Section>

        <Section number="3" title="Kondisi yang TIDAK Memenuhi Syarat Refund">
          <BulletList color="bg-red-500" items={[
            'Pengguna sudah mengakses sebagian atau seluruh konten program',
            'Pengguna berubah pikiran setelah pembelian (change of mind)',
            'Hasil program tidak sesuai ekspektasi karena tidak menjalankan program sebagaimana mestinya',
            'Pengguna melanggar Syarat & Ketentuan sehingga akses dinonaktifkan',
            'Pengguna membeli menggunakan akun orang lain',
          ]} />
        </Section>

        <Section number="4" title="Cara Mengajukan Refund">
          <p>Untuk mengajukan pengembalian dana, ikuti langkah berikut:</p>
          <ol className="space-y-3 mt-2 counter-reset-list">
            {[
              { step: '1', label: 'Kirim email ke cenhfits@gmail.com dengan subjek: [REFUND REQUEST] - Nama Kamu' },
              { step: '2', label: 'Sertakan bukti pembayaran (screenshot/bukti transfer)' },
              { step: '3', label: 'Jelaskan permasalahan teknis yang dialami secara detail' },
              { step: '4', label: 'Lampirkan dokumentasi/screenshot yang mendukung pengajuan kamu' },
            ].map(({ step, label }) => (
              <li key={step} className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 text-xs font-bold flex-shrink-0 mt-0.5">
                  {step}
                </span>
                <span>{label}</span>
              </li>
            ))}
          </ol>
        </Section>

        <Section number="5" title="Proses Verifikasi & Pencairan">
          <BulletList items={[
            'Tim kami akan merespons pengajuan dalam waktu 1x24 jam di hari kerja',
            'Verifikasi bukti dan investigasi permasalahan dilakukan terlebih dahulu',
            'Jika pengajuan disetujui, pengembalian dana diproses dalam 1x24 jam setelah persetujuan',
            'Metode pengembalian dana disesuaikan dengan metode pembayaran awal',
          ]} />
        </Section>

        <Section number="6" title="Kontak Pengajuan Refund">
          <p>Seluruh pengajuan refund hanya dilayani melalui:</p>
          <div className="mt-3 flex items-center gap-3 p-4 rounded-xl border border-green-500/20 bg-green-500/5">
            <Mail className="w-5 h-5 text-green-400 flex-shrink-0" />
            <div>
              <p className="text-white text-sm font-semibold">Email Resmi</p>
              <a href="mailto:cenhfits@gmail.com" className="text-green-400 hover:text-green-300 transition-colors text-sm">
                cenhfits@gmail.com
              </a>
            </div>
          </div>
          <p className="mt-3 text-neutral-500 text-xs">
            Pengajuan yang tidak disertai bukti yang valid tidak akan diproses.
          </p>
        </Section>

        {/* Bottom */}
        <div className="mt-10 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-600">
          <p>© 2025 3PM System. Seluruh hak dilindungi undang-undang.</p>
          <div className="flex items-center gap-4">
            <a href="/terms" className="hover:text-neutral-400 transition-colors">Syarat &amp; Ketentuan</a>
            <a href="/privacy" className="hover:text-neutral-400 transition-colors">Kebijakan Privasi</a>
          </div>
        </div>
      </div>
    </div>
  );
}
