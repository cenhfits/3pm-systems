import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, RefreshCw } from 'lucide-react';

const Section = ({ number, title, children }) => (
  <div className="mb-8">
    <h2 className="text-white font-bold text-base mb-3 flex items-center gap-2">
      <span className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 text-xs font-bold flex-shrink-0">
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
        <span className="flex-shrink-0 mt-2 w-1 h-1 rounded-full bg-orange-500" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const Prohibited = ({ items }) => (
  <ul className="space-y-1.5 mt-1">
    {items.map((item, i) => (
      <li key={i} className="flex gap-2 text-red-400/80">
        <span className="flex-shrink-0 font-bold text-xs mt-0.5">✕</span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

export default function TermsPage() {
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
        <div className="mb-10 p-8 rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-500/0 border border-orange-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-orange-400 text-xs font-bold uppercase tracking-widest">Legal Document</p>
              <h1 className="text-white font-black text-2xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Syarat &amp; Ketentuan
              </h1>
            </div>
          </div>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Dengan melakukan pembelian dan mengakses <strong className="text-white">3PM System</strong>, kamu dianggap telah membaca,
            memahami, dan menyetujui seluruh syarat dan ketentuan di bawah ini.
          </p>
          <p className="text-neutral-600 text-xs mt-3">Terakhir diperbarui: 2025</p>
        </div>

        {/* Related Policies */}
        <div className="grid grid-cols-2 gap-3 mb-10">
          <a href="/privacy" className="flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-white text-xs font-semibold">Kebijakan Privasi</p>
              <p className="text-neutral-600 text-[10px] mt-0.5">Cara kami melindungi data kamu</p>
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

        {/* Divider */}
        <div className="h-px bg-white/5 mb-10" />

        {/* Sections */}
        <Section number="1" title="Penerimaan Syarat">
          <p>
            Dengan melakukan pembelian dan mengakses 3PM System, pengguna dianggap telah membaca,
            memahami, dan menyetujui seluruh syarat dan ketentuan yang berlaku di bawah ini.
          </p>
        </Section>

        <Section number="2" title="Akses Program">
          <BulletList items={[
            'Member Early Bird mendapatkan lifetime access ke seluruh konten 3PM System yang tersedia di platform.',
            'Ke depannya, sistem akses akan beralih menjadi membership berjangka (3 bulan, 6 bulan, 1 tahun, dan lifetime) sesuai kebijakan yang berlaku pada saat pembelian.',
            'Akses diberikan secara personal dan tidak dapat dipindahtangankan kepada pihak lain dalam bentuk apapun.',
          ]} />
        </Section>

        <Section number="3" title="Kebijakan Pengembalian Dana (Refund)">
          <p>
            Sesuai dengan UU No. 8 Tahun 1999 tentang Perlindungan Konsumen dan UU No. 19 Tahun 2016
            tentang Informasi dan Transaksi Elektronik (ITE):
          </p>
          <BulletList items={[
            'Seluruh pembelian bersifat final dan tidak dapat dikembalikan, kecuali terdapat permasalahan teknis internal dari pihak 3PM System yang terbukti merugikan pengguna.',
            'Pengajuan wajib disertai bukti berupa tangkapan layar atau dokumentasi valid.',
            'Refund yang disetujui diproses dalam 1x24 jam setelah verifikasi.',
          ]} />
          <p className="mt-2">
            Selengkapnya:{' '}
            <a href="/refund" className="text-orange-400 hover:text-orange-300 transition-colors underline underline-offset-2">
              Kebijakan Refund →
            </a>
          </p>
        </Section>

        <Section number="4" title="Hak Kekayaan Intelektual">
          <p>
            Seluruh konten dalam 3PM System — video, materi tertulis, template, dan program latihan —
            merupakan hak kekayaan intelektual milik 3PM System dan dilindungi UU No. 28 Tahun 2014
            tentang Hak Cipta. Dilarang keras:
          </p>
          <Prohibited items={[
            'Menyebarkan, menduplikasi, atau menjual kembali konten dalam bentuk apapun',
            'Membagikan akses akun kepada pihak lain',
            'Menggunakan konten untuk kepentingan komersial tanpa izin tertulis',
          ]} />
          <p className="mt-2 text-neutral-500">
            Pelanggaran dapat dikenakan sanksi hukum sesuai peraturan yang berlaku di Indonesia.
          </p>
        </Section>

        <Section number="5" title="Penonaktifan Akses">
          <p>3PM System berhak menonaktifkan akses pengguna secara sepihak apabila terbukti:</p>
          <Prohibited items={[
            'Membagikan akses akun kepada pihak lain',
            'Mendistribusikan atau menjual kembali konten dalam bentuk apapun',
            'Melakukan tindakan yang merugikan 3PM System maupun pengguna lain',
          ]} />
          <p className="mt-2">
            Penonaktifan akibat pelanggaran tidak memberikan hak untuk mengajukan pengembalian dana.
          </p>
        </Section>

        <Section number="6" title="Kebijakan Privasi Data">
          <p>
            Sesuai UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi, 3PM System berkomitmen
            melindungi data pribadi pengguna. Data tidak dijual atau dibagikan kepada pihak ketiga.
          </p>
          <p className="mt-2">
            Selengkapnya:{' '}
            <a href="/privacy" className="text-orange-400 hover:text-orange-300 transition-colors underline underline-offset-2">
              Kebijakan Privasi →
            </a>
          </p>
        </Section>

        <Section number="7" title="Perubahan Konten & Harga">
          <BulletList items={[
            '3PM System berhak melakukan pembaruan konten sewaktu-waktu tanpa pemberitahuan sebelumnya.',
            'Harga dan struktur membership dapat berubah, namun tidak mempengaruhi hak akses member yang telah bergabung.',
          ]} />
        </Section>

        <Section number="8" title="Force Majeure & Gangguan Teknis">
          <p>
            3PM System tidak bertanggung jawab atas gangguan akses akibat kondisi di luar kendali
            (gangguan server, pemeliharaan sistem, bencana alam, dll). Dalam kondisi tersebut,
            akses cadangan via Notion akan diberikan kepada seluruh member aktif.
          </p>
        </Section>

        <Section number="9" title="Batasan Tanggung Jawab">
          <p>
            3PM System menyediakan informasi berdasarkan pengalaman nyata dan riset yang relevan.
            Namun hasil tiap individu dapat berbeda tergantung kondisi fisik, konsistensi, dan faktor
            personal. 3PM System tidak bertanggung jawab atas hasil yang tidak sesuai ekspektasi
            apabila program tidak dijalankan sebagaimana mestinya.
          </p>
        </Section>

        <Section number="10" title="Penyelesaian Sengketa">
          <p>
            Perselisihan diselesaikan melalui musyawarah mufakat terlebih dahulu. Jika tidak tercapai
            kesepakatan, diselesaikan sesuai hukum yang berlaku di Republik Indonesia.
          </p>
        </Section>

        <Section number="11" title="Hubungi Kami">
          <p>Untuk pertanyaan atau kendala, hubungi kami melalui:</p>
          <div className="mt-2 inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-lg px-4 py-2">
            <span>📧</span>
            <a href="mailto:cenhfits@gmail.com" className="text-orange-400 hover:text-orange-300 transition-colors font-medium">
              cenhfits@gmail.com
            </a>
          </div>
        </Section>

        {/* Bottom */}
        <div className="mt-10 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-600">
          <p>© 2025 3PM System. Seluruh hak dilindungi undang-undang.</p>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="hover:text-neutral-400 transition-colors">Kebijakan Privasi</a>
            <a href="/refund" className="hover:text-neutral-400 transition-colors">Kebijakan Refund</a>
          </div>
        </div>
      </div>
    </div>
  );
}
