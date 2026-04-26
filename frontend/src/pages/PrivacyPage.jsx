import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Shield, RefreshCw } from 'lucide-react';

const Section = ({ number, title, children }) => (
  <div className="mb-8">
    <h2 className="text-white font-bold text-base mb-3 flex items-center gap-2">
      <span className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xs font-bold flex-shrink-0">
        {number}
      </span>
      {title}
    </h2>
    <div className="text-neutral-400 text-sm leading-relaxed space-y-2 pl-8">
      {children}
    </div>
  </div>
);

const BulletList = ({ items }) => (
  <ul className="space-y-1.5 mt-1">
    {items.map((item, i) => (
      <li key={i} className="flex gap-2">
        <span className="flex-shrink-0 mt-2 w-1 h-1 rounded-full bg-blue-500" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

export default function PrivacyPage() {
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
        <div className="mb-10 p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/0 border border-blue-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">Legal Document</p>
              <h1 className="text-white font-black text-2xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Kebijakan Privasi
              </h1>
            </div>
          </div>
          <p className="text-neutral-400 text-sm leading-relaxed">
            <strong className="text-white">3PM System</strong> berkomitmen untuk melindungi privasi dan keamanan
            data pribadi seluruh pengguna platform. Kebijakan ini menjelaskan bagaimana kami mengumpulkan,
            menggunakan, dan melindungi data kamu.
          </p>
          <p className="text-neutral-600 text-xs mt-3">Terakhir diperbarui: 2025 · Berlaku sesuai UU No. 27 Tahun 2022 tentang PDP</p>
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
          <a href="/refund" className="flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-white text-xs font-semibold">Kebijakan Refund</p>
              <p className="text-neutral-600 text-[10px] mt-0.5">Ketentuan pengembalian dana</p>
            </div>
          </a>
        </div>

        <div className="h-px bg-white/5 mb-10" />

        {/* Sections */}
        <Section number="1" title="Data yang Kami Kumpulkan">
          <p>Saat kamu mendaftar dan menggunakan 3PM System, kami mengumpulkan data berikut:</p>
          <BulletList items={[
            'Nama lengkap — untuk personalisasi akun dan komunikasi',
            'Alamat email — untuk verifikasi akun, notifikasi, dan komunikasi resmi',
            'Nomor telepon — untuk keperluan verifikasi dan kontak darurat',
            'Data progress belajar — untuk menampilkan perkembangan kamu di dalam platform',
            'Informasi pembayaran — hanya untuk keperluan verifikasi transaksi (tidak disimpan di server kami)',
          ]} />
        </Section>

        <Section number="2" title="Bagaimana Kami Menggunakan Data">
          <BulletList items={[
            'Memberikan dan mengelola akses ke konten 3PM System',
            'Mengirimkan notifikasi penting terkait akun dan program',
            'Merespons pertanyaan, laporan kendala, dan pengajuan refund',
            'Meningkatkan kualitas layanan dan konten platform',
            'Mematuhi kewajiban hukum yang berlaku di Indonesia',
          ]} />
        </Section>

        <Section number="3" title="Keamanan Data">
          <p>
            Kami menggunakan enkripsi dan langkah keamanan teknis untuk melindungi data kamu dari
            akses yang tidak sah, perubahan, pengungkapan, atau penghancuran.
          </p>
          <BulletList items={[
            'Password disimpan dalam bentuk terenkripsi (bcrypt) — tidak dapat dibaca oleh siapapun',
            'Komunikasi antara browser dan server menggunakan HTTPS/TLS',
            'Token autentikasi menggunakan standar JWT dengan masa berlaku terbatas',
          ]} />
        </Section>

        <Section number="4" title="Berbagi Data dengan Pihak Ketiga">
          <p>
            <strong className="text-white">3PM System tidak menjual, menyewakan, atau membagikan data pribadi kamu</strong>{' '}
            kepada pihak ketiga untuk kepentingan komersial.
          </p>
          <p>
            Data hanya dapat dibagikan dalam kondisi berikut:
          </p>
          <BulletList items={[
            'Diwajibkan oleh hukum atau perintah pengadilan yang sah',
            'Diperlukan untuk mencegah penipuan atau aktivitas ilegal',
            'Dengan persetujuan eksplisit dari kamu sebagai pengguna',
          ]} />
        </Section>

        <Section number="5" title="Hak Pengguna atas Data Pribadi">
          <p>Sesuai UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi, kamu berhak untuk:</p>
          <BulletList items={[
            'Mengakses data pribadi yang kami simpan tentang kamu',
            'Meminta koreksi data yang tidak akurat',
            'Meminta penghapusan akun dan seluruh data pribadi kamu',
            'Mengajukan keberatan atas pemrosesan data tertentu',
          ]} />
          <p className="mt-2">
            Untuk menggunakan hak-hak di atas, hubungi kami di{' '}
            <a href="mailto:cenhfits@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors">
              cenhfits@gmail.com
            </a>
          </p>
        </Section>

        <Section number="6" title="Cookie & Penyimpanan Lokal">
          <p>
            3PM System menggunakan <em>localStorage</em> dan <em>sessionStorage</em> di browser kamu
            untuk menyimpan token autentikasi agar kamu tidak perlu login ulang setiap saat.
            Data ini hanya tersimpan di perangkat kamu dan tidak dikirim ke pihak ketiga.
          </p>
        </Section>

        <Section number="7" title="Retensi Data">
          <p>
            Kami menyimpan data kamu selama akun aktif atau diperlukan untuk memberikan layanan.
            Jika kamu meminta penghapusan akun, data akan dihapus dari sistem kami dalam waktu 30 hari
            kerja, kecuali data yang wajib disimpan berdasarkan ketentuan hukum.
          </p>
        </Section>

        <Section number="8" title="Perubahan Kebijakan">
          <p>
            3PM System berhak memperbarui kebijakan privasi ini sewaktu-waktu. Perubahan signifikan
            akan diinformasikan melalui email atau notifikasi di platform. Penggunaan platform setelah
            perubahan berlaku dianggap sebagai persetujuan terhadap kebijakan yang diperbarui.
          </p>
        </Section>

        <Section number="9" title="Hubungi Kami">
          <p>Untuk pertanyaan terkait privasi data kamu:</p>
          <div className="mt-2 inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2">
            <span>📧</span>
            <a href="mailto:cenhfits@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
              cenhfits@gmail.com
            </a>
          </div>
        </Section>

        {/* Bottom */}
        <div className="mt-10 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-600">
          <p>© 2025 3PM System. Seluruh hak dilindungi undang-undang.</p>
          <div className="flex items-center gap-4">
            <a href="/terms" className="hover:text-neutral-400 transition-colors">Syarat &amp; Ketentuan</a>
            <a href="/refund" className="hover:text-neutral-400 transition-colors">Kebijakan Refund</a>
          </div>
        </div>
      </div>
    </div>
  );
}
