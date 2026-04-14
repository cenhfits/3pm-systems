import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  Dumbbell, Users, Search, CheckCircle, XCircle,
  LogOut, ChevronDown, ChevronUp, RefreshCw, LayoutDashboard,
  BookOpen, UserCheck, UserX, Menu, X, TrendingUp, Award, Activity, Shield,
  Star, Download, MessageSquare, Mail, Send, AlertCircle
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const api = axios.create({ baseURL: BACKEND_URL });
api.interceptors.request.use(cfg => {
  const token = (localStorage.getItem('token') || sessionStorage.getItem('token'));
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

const CHAPTER_NAMES = {
  1: 'Mindset', 2: 'Nutrisi', 3: 'Masak',
  4: 'Build Muscle', 5: 'Workout', 6: 'Final', 7: 'Gym Myth',
};

// ── Components ────────────────────────────────────────────────────────────────

const ProgressBar = ({ value, color = 'bg-orange-500' }) => (
  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
    <motion.div
      initial={{ width: 0 }} animate={{ width: `${value}%` }}
      transition={{ duration: 0.5 }}
      className={`h-full ${color} rounded-full`}
    />
  </div>
);

const StatCard = ({ label, value, sub, color = 'text-orange-400', icon: Icon }) => (
  <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-5">
    <div className="flex items-start justify-between mb-3">
      <p className="text-neutral-500 text-xs uppercase tracking-widest">{label}</p>
      {Icon && <div className="bg-white/5 p-2 rounded-lg"><Icon className={`w-4 h-4 ${color}`} /></div>}
    </div>
    <p className={`text-3xl font-black ${color}`}>{value}</p>
    {sub && <p className="text-neutral-600 text-xs mt-1">{sub}</p>}
  </div>
);

// ── User Row ──────────────────────────────────────────────────────────────────
const UserRow = ({ user, onGrant, onRevoke, onMakeAdmin, loading }) => {
  const [expanded, setExpanded] = useState(false);
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchDetail = async () => {
    if (detail) { setExpanded(!expanded); return; }
    setLoadingDetail(true);
    try {
      const { data } = await api.get(`/api/admin/user/${user.id}/progress`);
      setDetail(data);
      setExpanded(true);
    } catch {}
    setLoadingDetail(false);
  };

  const progressColor = user.overall_progress >= 80 ? 'bg-green-500'
    : user.overall_progress >= 40 ? 'bg-orange-500' : 'bg-blue-500';

  return (
    <>
      <tr className="border-b border-white/5 hover:bg-white/3 transition-colors">
        <td className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-black text-sm flex-shrink-0">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                {user.is_admin && <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded-full flex-shrink-0"><Shield className="w-2.5 h-2.5" />Admin</span>}
              </div>
              <p className="text-neutral-500 text-xs truncate">{user.email}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-4 hidden md:table-cell">
          <p className="text-neutral-400 text-xs">
            {user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
          </p>
        </td>
        <td className="px-4 py-4">
          {user.has_access
            ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full"><CheckCircle className="w-3 h-3" />Aktif</span>
            : <span className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-500 bg-white/5 px-2.5 py-1 rounded-full"><XCircle className="w-3 h-3" />Belum</span>
          }
        </td>
        <td className="px-4 py-4 hidden sm:table-cell w-36">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-500">{user.completed_lessons} pelajaran</span>
              <span className={`font-bold ${user.overall_progress >= 80 ? 'text-green-400' : user.overall_progress >= 40 ? 'text-orange-400' : 'text-blue-400'}`}>
                {user.overall_progress}%
              </span>
            </div>
            <ProgressBar value={user.overall_progress} color={progressColor} />
          </div>
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center gap-2 justify-end">
            <button onClick={fetchDetail} className="p-1.5 text-neutral-500 hover:text-white transition-colors">
              {loadingDetail ? <RefreshCw className="w-4 h-4 animate-spin" /> : expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {!user.is_admin && (
              <button onClick={() => onMakeAdmin(user.id, user.name)} disabled={loading}
                className="text-xs px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 font-semibold transition-colors disabled:opacity-50 flex items-center gap-1">
                <Shield className="w-3 h-3" />Jadikan Admin
              </button>
            )}
            {user.has_access
              ? <button onClick={() => onRevoke(user.id, user.name)} disabled={loading}
                  className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold transition-colors disabled:opacity-50 flex items-center gap-1">
                  <UserX className="w-3 h-3" />Cabut
                </button>
              : <button onClick={() => onGrant(user.id, user.name)} disabled={loading}
                  className="text-xs px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 font-semibold transition-colors disabled:opacity-50 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />Beri Akses
                </button>
            }
          </div>
        </td>
      </tr>
      <AnimatePresence>
        {expanded && detail && (
          <tr>
            <td colSpan={5} className="px-4 pb-4">
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="bg-[#1A1A1A] border border-white/10 rounded-xl p-4 mt-1">
                <p className="text-neutral-400 text-xs font-semibold uppercase tracking-widest mb-3">Progress per Chapter</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {Object.entries(detail.chapter_progress).map(([chId, prog]) => (
                    <div key={chId} className="text-center">
                      <p className="text-neutral-500 text-xs mb-1">{CHAPTER_NAMES[parseInt(chId)]}</p>
                      <p className={`text-sm font-black ${prog.pct === 100 ? 'text-green-400' : prog.pct > 0 ? 'text-orange-400' : 'text-neutral-600'}`}>{prog.pct}%</p>
                      <p className="text-neutral-600 text-xs">{prog.done}/{prog.total}</p>
                      <ProgressBar value={prog.pct} color={prog.pct === 100 ? 'bg-green-500' : 'bg-orange-500'} />
                    </div>
                  ))}
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
};

// ── Pages ─────────────────────────────────────────────────────────────────────

const CHAPTER_LABEL = { 1:'Mindset',2:'Nutrisi',3:'Masak',4:'Build Muscle',5:'Workout',6:'Final',7:'Gym Myth' };

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    api.get('/api/admin/feedback').then(({ data }) => setFeedbacks(data)).finally(() => setLoading(false));
  }, []);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const token = (localStorage.getItem('token') || sessionStorage.getItem('token'));
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
      const res = await fetch(`${BACKEND_URL}/api/admin/feedback/export`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `feedback_3pmsystem_${new Date().toISOString().slice(0,10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {}
    setDownloading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Feedback</h2>
        <button onClick={handleDownload} disabled={downloading}
          className="flex items-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 font-semibold text-sm px-4 py-2 rounded-xl transition-all disabled:opacity-50">
          <Download className="w-4 h-4" />
          {downloading ? 'Mengunduh...' : 'Download Excel'}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><RefreshCw className="w-6 h-6 text-orange-500 animate-spin" /></div>
      ) : feedbacks.length === 0 ? (
        <div className="bg-[#1A1A1A] border border-white/10 rounded-xl py-16 text-center">
          <MessageSquare className="w-8 h-8 text-neutral-700 mx-auto mb-3" />
          <p className="text-neutral-500 text-sm">Belum ada feedback.</p>
        </div>
      ) : (
        <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-widest">User</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-widest hidden md:table-cell">Chapter</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-widest hidden md:table-cell">Tanggal</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-widest">Jawaban</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-widest">Komentar</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((f, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors align-top">
                    <td className="px-4 py-3">
                      <p className="text-white text-sm font-semibold">{f.user_name}</p>
                      <p className="text-neutral-500 text-xs">{f.user_email}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {f.chapter_id ? (
                        <div>
                          <span className="text-xs font-bold text-orange-400">Ch.{f.chapter_id}</span>
                          <p className="text-neutral-400 text-xs">{CHAPTER_LABEL[f.chapter_id] || f.chapter_name || '-'}</p>
                        </div>
                      ) : <span className="text-neutral-600 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-neutral-500 text-xs">
                        {f.created_at ? new Date(f.created_at).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' }) : '-'}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {f.answers && Object.entries(f.answers).length > 0 ? (
                        <div className="space-y-1">
                          {Object.entries(f.answers).map(([q, a]) => (
                            <div key={q} className="flex items-center gap-1.5">
                              <span className="text-neutral-600 text-xs truncate max-w-[120px]">{q.replace(/_/g,' ')}:</span>
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                a === 'Sangat Suka' ? 'bg-emerald-500/15 text-emerald-400' :
                                a === 'Suka' ? 'bg-green-500/15 text-green-400' :
                                a === 'Netral' ? 'bg-yellow-500/15 text-yellow-400' :
                                a === 'Tidak Suka' ? 'bg-orange-500/15 text-orange-400' :
                                'bg-red-500/15 text-red-400'
                              }`}>{a}</span>
                            </div>
                          ))}
                        </div>
                      ) : <span className="text-neutral-600 text-xs italic">—</span>}
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-neutral-300 text-sm">{f.comment || <span className="text-neutral-600 italic">—</span>}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const OverviewPage = ({ users }) => {
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.has_access).length;
  const avgProgress = users.length > 0 ? Math.round(users.reduce((sum, u) => sum + u.overall_progress, 0) / users.length) : 0;
  const activeProgress = users.filter(u => u.overall_progress > 0).length;
  const completedAll = users.filter(u => u.overall_progress === 100).length;

  const topUsers = [...users].sort((a, b) => b.overall_progress - a.overall_progress).slice(0, 5);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <h2 className="text-xl font-black text-white mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>Overview</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total User" value={totalUsers} sub="Terdaftar" icon={Users} />
        <StatCard label="Akses Aktif" value={activeUsers} sub={`${totalUsers - activeUsers} belum aktif`} color="text-green-400" icon={UserCheck} />
        <StatCard label="Rata-rata Progress" value={`${avgProgress}%`} sub="Semua user" color="text-blue-400" icon={TrendingUp} />
        <StatCard label="Selesai Course" value={completedAll} sub="Progress 100%" color="text-purple-400" icon={Award} />
      </div>

      {/* Top Learners */}
      <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-5">
          <Activity className="w-4 h-4 text-orange-500" />
          <h3 className="text-white font-bold text-sm">Top Learners</h3>
        </div>
        {topUsers.length === 0 ? (
          <p className="text-neutral-500 text-sm text-center py-6">Belum ada data.</p>
        ) : (
          <div className="space-y-4">
            {topUsers.map((u, i) => (
              <div key={u.id} className="flex items-center gap-4">
                <span className={`text-sm font-black w-5 ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-neutral-300' : i === 2 ? 'text-orange-400' : 'text-neutral-600'}`}>#{i + 1}</span>
                <div className="w-7 h-7 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-black text-xs flex-shrink-0">
                  {u.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{u.name}</p>
                  <ProgressBar value={u.overall_progress} color={u.overall_progress === 100 ? 'bg-green-500' : 'bg-orange-500'} />
                </div>
                <span className={`text-sm font-bold flex-shrink-0 ${u.overall_progress === 100 ? 'text-green-400' : 'text-orange-400'}`}>{u.overall_progress}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const UsersPage = ({ users, onGrant, onRevoke, onMakeAdmin, loading, onRefresh, refreshing }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | active | inactive

  const filtered = users.filter(u => {
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'active' && u.has_access) || (filter === 'inactive' && !u.has_access);
    return matchSearch && matchFilter;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Manajemen User</h2>
        <button onClick={onRefresh} className="flex items-center gap-2 text-neutral-400 hover:text-white text-sm transition-colors">
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />Refresh
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" placeholder="Cari nama atau email..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-white/10 text-white text-sm rounded-xl pl-9 pr-4 py-2.5 placeholder-neutral-600 focus:outline-none focus:border-orange-500 transition-colors" />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'inactive'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${filter === f ? 'bg-orange-500 text-black' : 'bg-[#1A1A1A] border border-white/10 text-neutral-400 hover:text-white'}`}>
              {f === 'all' ? 'Semua' : f === 'active' ? 'Aktif' : 'Belum Aktif'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
          <Users className="w-4 h-4 text-orange-500" />
          <span className="text-white font-bold text-sm">User</span>
          <span className="text-neutral-500 text-xs">({filtered.length})</span>
        </div>
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="w-8 h-8 text-neutral-700 mx-auto mb-3" />
            <p className="text-neutral-500 text-sm">Tidak ada user ditemukan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-widest">User</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-widest hidden md:table-cell">Daftar</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-widest">Akses</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-widest hidden sm:table-cell">Progress</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-widest">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <UserRow key={user.id} user={user} onGrant={onGrant} onRevoke={onRevoke} onMakeAdmin={onMakeAdmin} loading={loading} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ProgressPage = ({ users }) => {
  const sorted = [...users].sort((a, b) => b.overall_progress - a.overall_progress);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <h2 className="text-xl font-black text-white mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>Pantau Progress</h2>

      <div className="space-y-3">
        {sorted.length === 0 ? (
          <div className="bg-[#1A1A1A] border border-white/10 rounded-xl py-16 text-center">
            <TrendingUp className="w-8 h-8 text-neutral-700 mx-auto mb-3" />
            <p className="text-neutral-500 text-sm">Belum ada data progress.</p>
          </div>
        ) : sorted.map((u) => (
          <div key={u.id} className="bg-[#1A1A1A] border border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-9 h-9 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-black text-sm flex-shrink-0">
                {u.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm">{u.name}</p>
                <p className="text-neutral-500 text-xs">{u.email}</p>
              </div>
              <div className="text-right">
                <p className={`text-lg font-black ${u.overall_progress === 100 ? 'text-green-400' : u.overall_progress > 0 ? 'text-orange-400' : 'text-neutral-600'}`}>
                  {u.overall_progress}%
                </p>
                <p className="text-neutral-600 text-xs">{u.completed_lessons} pelajaran</p>
              </div>
            </div>
            <ProgressBar value={u.overall_progress} color={u.overall_progress === 100 ? 'bg-green-500' : u.overall_progress > 40 ? 'bg-orange-500' : 'bg-blue-500'} />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ── Broadcast Email Page ──────────────────────────────────────────────────────
const BroadcastPage = () => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // {sent, failed, total, errors}
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) { setError('Subject dan isi email wajib diisi.'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const { data } = await api.post('/api/admin/broadcast-email', { subject, body });
      setResult(data);
      if (data.failed === 0) { setSubject(''); setBody(''); }
    } catch (err) {
      setError(err.response?.data?.detail || 'Gagal mengirim email broadcast.');
    } finally { setLoading(false); }
  };

  return (
    <motion.div key="broadcast" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="mb-6">
        <h2 className="text-xl font-black text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Kirim Email ke Semua User</h2>
        <p className="text-neutral-500 text-sm mt-1">Email akan dikirim ke seluruh user yang terdaftar di sistem.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Compose */}
        <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <Mail className="w-4 h-4 text-orange-400" />
            <span className="text-white font-bold text-sm">Compose Email</span>
          </div>

          <div>
            <label className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={e => { setSubject(e.target.value); setError(''); }}
              placeholder="Contoh: Update Course Terbaru 3PM System"
              className="w-full bg-[#111111] border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-neutral-600 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">Isi Email</label>
            <textarea
              value={body}
              onChange={e => { setBody(e.target.value); setError(''); }}
              placeholder={"Halo member!\n\nTulis pesan kamu di sini...\n\nSalam,\nVincent — 3PM System"}
              rows={10}
              className="w-full bg-[#111111] border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-neutral-600 focus:outline-none focus:border-orange-500 transition-colors resize-none font-mono"
            />
            <p className="text-neutral-600 text-xs mt-1.5">Baris baru otomatis jadi paragraph baru di email.</p>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleSend}
            disabled={loading || !subject.trim() || !body.trim()}
            className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading
              ? <><RefreshCw className="w-4 h-4 animate-spin" /> Mengirim...</>
              : <><Send className="w-4 h-4" /> Kirim ke Semua User</>
            }
          </button>
        </div>

        {/* Preview + Result */}
        <div className="space-y-5">
          {/* Preview */}
          <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6">
            <p className="text-xs text-neutral-500 uppercase tracking-widest mb-4">Preview Email</p>
            <div className="bg-[#111111] rounded-xl overflow-hidden border border-white/5">
              <div className="bg-orange-500 px-5 py-4">
                <p className="text-black font-black text-base">3PM System</p>
                <p className="text-black/60 text-[10px] font-bold tracking-widest uppercase">Train. Eat. Sleep.</p>
              </div>
              <div className="p-5">
                <p className="text-neutral-400 text-xs mb-3">Halo, <span className="text-white font-semibold">[Nama User]</span> 👋</p>
                {body ? (
                  <div className="text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap">{body}</div>
                ) : (
                  <p className="text-neutral-600 text-sm italic">Isi email akan muncul di sini...</p>
                )}
                <hr className="border-white/10 my-4" />
                <p className="text-neutral-600 text-xs">Email ini dikirim dari 3PM System Admin.</p>
              </div>
            </div>
          </div>

          {/* Result */}
          {result && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border p-5 ${result.failed === 0 ? 'bg-green-500/10 border-green-500/20' : 'bg-yellow-500/10 border-yellow-500/20'}`}>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className={`w-5 h-5 ${result.failed === 0 ? 'text-green-400' : 'text-yellow-400'}`} />
                <p className={`font-bold text-sm ${result.failed === 0 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {result.failed === 0 ? 'Semua email berhasil dikirim!' : 'Sebagian email berhasil dikirim'}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white/5 rounded-xl py-3">
                  <p className="text-green-400 font-black text-xl">{result.sent}</p>
                  <p className="text-neutral-500 text-xs mt-0.5">Terkirim</p>
                </div>
                <div className="bg-white/5 rounded-xl py-3">
                  <p className="text-red-400 font-black text-xl">{result.failed}</p>
                  <p className="text-neutral-500 text-xs mt-0.5">Gagal</p>
                </div>
                <div className="bg-white/5 rounded-xl py-3">
                  <p className="text-white font-black text-xl">{result.total}</p>
                  <p className="text-neutral-500 text-xs mt-0.5">Total</p>
                </div>
              </div>
              {result.errors?.length > 0 && (
                <div className="mt-3">
                  <p className="text-neutral-500 text-xs mb-1.5">Error log:</p>
                  {result.errors.map((e, i) => (
                    <p key={i} className="text-red-400/70 text-xs font-mono leading-relaxed">{e}</p>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ── Main Admin Dashboard ──────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [adminConfirm, setAdminConfirm] = useState(null);   // { userId, userName }
  const [grantConfirm, setGrantConfirm] = useState(null);   // { userId, userName }
  const [revokeConfirm, setRevokeConfirm] = useState(null); // { userId, userName }

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/api/admin/users');
      setUsers(data);
    } catch (err) {
      if (err.response?.status === 403) setError('Akses ditolak. Kamu bukan admin.');
      else setError('Gagal memuat data.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!(localStorage.getItem('token') || sessionStorage.getItem('token'))) { navigate('/login'); return; }
    fetchUsers();
  }, [navigate, fetchUsers]);

  const handleGrant = async () => {
    if (!grantConfirm) return;
    setActionLoading(true);
    try {
      await api.post('/api/admin/grant-access', { user_id: grantConfirm.userId });
      setUsers(prev => prev.map(u => u.id === grantConfirm.userId ? { ...u, has_access: true } : u));
    } catch {}
    setActionLoading(false);
    setGrantConfirm(null);
  };

  const handleRevoke = async () => {
    if (!revokeConfirm) return;
    setActionLoading(true);
    try {
      await api.post('/api/admin/revoke-access', { user_id: revokeConfirm.userId });
      setUsers(prev => prev.map(u => u.id === revokeConfirm.userId ? { ...u, has_access: false } : u));
    } catch {}
    setActionLoading(false);
    setRevokeConfirm(null);
  };

  const handleMakeAdmin = async () => {
    if (!adminConfirm) return;
    setActionLoading(true);
    try {
      await api.post('/api/admin/make-admin', { user_id: adminConfirm.userId });
      setUsers(prev => prev.map(u => u.id === adminConfirm.userId ? { ...u, is_admin: true, has_access: true } : u));
    } catch {}
    setActionLoading(false);
    setAdminConfirm(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Manajemen User', icon: Users },
    { id: 'progress', label: 'Pantau Progress', icon: TrendingUp },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'broadcast', label: 'Kirim Email', icon: Mail },
    { id: 'course', label: 'Course', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex">
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-[#111111] border-r border-white/5 z-40 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="bg-orange-500 p-1.5 rounded-lg"><Dumbbell className="w-4 h-4 text-black" /></div>
            <span className="text-white font-black text-base" style={{ fontFamily: 'Montserrat, sans-serif' }}>3PM System</span>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">Admin Panel</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3">
          <p className="text-neutral-600 text-xs font-semibold uppercase tracking-widest px-3 mb-3">Menu</p>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => { setActivePage(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl mb-1 text-left transition-all duration-200 ${activePage === id ? 'bg-orange-500/15 border border-orange-500/30 text-orange-400' : 'hover:bg-white/5 border border-transparent text-neutral-400 hover:text-white'}`}>
              <Icon className="w-4 h-4" />
              <span className="text-sm font-semibold">{label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/5 space-y-1">
          <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl transition-all text-sm">
            <BookOpen className="w-4 h-4" />Lihat sebagai User
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-neutral-400 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all text-sm">
            <LogOut className="w-4 h-4" />Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-[#0D0D0D]/90 backdrop-blur-xl border-b border-white/5 px-5 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-neutral-400 hover:text-white transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-white font-bold text-sm sm:text-base flex-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {navItems.find(n => n.id === activePage)?.label}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-neutral-500 text-xs hidden sm:block">{users.length} user terdaftar</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-5 sm:p-8 w-full">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-5 py-4 mb-6">{error}</div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <RefreshCw className="w-6 h-6 text-orange-500 animate-spin" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activePage === 'overview' && <OverviewPage key="overview" users={users} />}
              {activePage === 'users' && <UsersPage key="users" users={users} onGrant={(id, name) => setGrantConfirm({ userId: id, userName: name })} onRevoke={(id, name) => setRevokeConfirm({ userId: id, userName: name })} onMakeAdmin={(id, name) => setAdminConfirm({ userId: id, userName: name })} loading={actionLoading} onRefresh={fetchUsers} refreshing={loading} />}
              {activePage === 'progress' && <ProgressPage key="progress" users={users} />}
              {activePage === 'feedback' && <FeedbackPage key="feedback" />}
              {activePage === 'broadcast' && <BroadcastPage key="broadcast" />}
              {activePage === 'course' && (
                <motion.div key="course" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <h2 className="text-xl font-black text-white mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>Course</h2>
                  <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-8 text-center">
                    <BookOpen className="w-10 h-10 text-neutral-600 mx-auto mb-4" />
                    <p className="text-white font-semibold mb-2">Manajemen Konten Course</p>
                    <p className="text-neutral-500 text-sm">Fitur edit konten course akan segera tersedia.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </main>
      </div>

      {/* Grant Access Confirm Modal */}
      <AnimatePresence>
        {grantConfirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
              initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 mx-auto mb-4">
                <UserCheck className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-white font-bold text-center text-lg mb-1">Beri Akses?</h3>
              <p className="text-neutral-400 text-sm text-center mb-6">
                <span className="text-white font-semibold">{grantConfirm.userName}</span> akan mendapatkan akses ke course.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setGrantConfirm(null)} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 font-semibold text-sm transition-colors">Batal</button>
                <button onClick={handleGrant} disabled={actionLoading} className="flex-1 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {actionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                  Ya, Beri Akses
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Revoke Access Confirm Modal */}
      <AnimatePresence>
        {revokeConfirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
              initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 mx-auto mb-4">
                <UserX className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-white font-bold text-center text-lg mb-1">Cabut Akses?</h3>
              <p className="text-neutral-400 text-sm text-center mb-6">
                <span className="text-white font-semibold">{revokeConfirm.userName}</span> tidak bisa lagi mengakses course.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setRevokeConfirm(null)} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 font-semibold text-sm transition-colors">Batal</button>
                <button onClick={handleRevoke} disabled={actionLoading} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {actionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserX className="w-4 h-4" />}
                  Ya, Cabut Akses
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Make Admin Confirm Modal */}
      <AnimatePresence>
        {adminConfirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
              initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 mx-auto mb-4">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-white font-bold text-center text-lg mb-1">Jadikan Admin?</h3>
              <p className="text-neutral-400 text-sm text-center mb-6">
                <span className="text-white font-semibold">{adminConfirm.userName}</span> akan mendapatkan akses penuh ke admin dashboard.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setAdminConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 font-semibold text-sm transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleMakeAdmin}
                  disabled={actionLoading}
                  className="flex-1 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                  Ya, Jadikan Admin
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
