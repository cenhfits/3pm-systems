import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  Dumbbell, Users, Search, CheckCircle, XCircle,
  LogOut, ChevronDown, ChevronUp, RefreshCw, LayoutDashboard,
  BookOpen, UserCheck, UserX, Menu, X, TrendingUp, Award, Activity, Shield,
  Star, Download, MessageSquare, Mail, Send, AlertCircle,
  Eye, EyeOff, Plus, Edit2, Trash2, Brain, Utensils, ChefHat, Calendar, Flag, Zap,
  Play, FileText, Clock, Image, Youtube, Type, Lightbulb, List, Link, Minus,
  AlignLeft, ChevronRight, LayoutList,
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
          {user.has_access ? (
            <div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full"><CheckCircle className="w-3 h-3" />Aktif</span>
              {user.access_expires_at && (
                <p className="text-neutral-600 text-[10px] mt-1 flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  Exp: {new Date(user.access_expires_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              )}
            </div>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-500 bg-white/5 px-2.5 py-1 rounded-full"><XCircle className="w-3 h-3" />Belum</span>
          )}
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
const TARGET_OPTIONS = [
  { value: 'all', label: 'Semua User', desc: 'Semua yang terdaftar' },
  { value: 'has_access', label: 'Sudah Beli', desc: 'User dengan akses aktif' },
  { value: 'no_access', label: 'Belum Beli', desc: 'User tanpa akses' },
];

const BroadcastPage = () => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [target, setTarget] = useState('all');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) { setError('Subject dan isi email wajib diisi.'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const { data } = await api.post('/api/admin/broadcast-email', { subject, body, target });
      setResult(data);
      if (data.failed === 0) { setSubject(''); setBody(''); }
    } catch (err) {
      setError(err.response?.data?.detail || 'Gagal mengirim email broadcast.');
    } finally { setLoading(false); }
  };

  return (
    <motion.div key="broadcast" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="mb-6">
        <h2 className="text-xl font-black text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Kirim Email</h2>
        <p className="text-neutral-500 text-sm mt-1">Pilih target penerima lalu tulis email.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Compose */}
        <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <Mail className="w-4 h-4 text-orange-400" />
            <span className="text-white font-bold text-sm">Compose Email</span>
          </div>

          <div>
            <label className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">Kirim ke</label>
            <div className="grid grid-cols-3 gap-2">
              {TARGET_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setTarget(opt.value)}
                  className={`py-2 px-3 rounded-xl border text-left transition-colors ${target === opt.value ? 'bg-orange-500/20 border-orange-500/40 text-orange-400' : 'bg-[#111111] border-white/10 text-neutral-400 hover:border-white/20'}`}>
                  <p className="text-xs font-bold">{opt.label}</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
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
              : <><Send className="w-4 h-4" /> Kirim ke {TARGET_OPTIONS.find(o => o.value === target)?.label}</>
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

// ── Course Management Page ────────────────────────────────────────────────────

const STATIC_CHAPTERS = [
  { id: 0, code: 'INTRO', title: 'Introduction', color_theme: 'orange' },
  { id: 1, code: 'MINDSET', title: 'Have This MINDSET', color_theme: 'purple' },
  { id: 2, code: 'NUTRISI', title: 'Nutrisi', color_theme: 'green' },
  { id: 3, code: 'MASAK', title: 'Masak', color_theme: 'orange' },
  { id: 4, code: 'BUILD YOUR MUSCLE', title: 'Build Your Muscle', color_theme: 'blue' },
  { id: 5, code: 'WORKOUT', title: 'Workout Program', color_theme: 'red' },
  { id: 6, code: 'FINAL', title: 'Final', color_theme: 'yellow' },
  { id: 7, code: 'GYM MYTH', title: 'Gym Myths', color_theme: 'cyan' },
];

const COLOR_BADGE = {
  orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  blue:   'bg-blue-500/20 text-blue-400 border-blue-500/30',
  green:  'bg-green-500/20 text-green-400 border-green-500/30',
  red:    'bg-red-500/20 text-red-400 border-red-500/30',
  cyan:   'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

const ICON_OPTIONS = [
  { name: 'BookOpen', Icon: BookOpen }, { name: 'Brain', Icon: Brain },
  { name: 'Utensils', Icon: Utensils }, { name: 'ChefHat', Icon: ChefHat },
  { name: 'TrendingUp', Icon: TrendingUp }, { name: 'Calendar', Icon: Calendar },
  { name: 'Flag', Icon: Flag }, { name: 'Zap', Icon: Zap },
  { name: 'Dumbbell', Icon: Dumbbell }, { name: 'Play', Icon: Play },
  { name: 'Star', Icon: Star }, { name: 'FileText', Icon: FileText },
];

// Convert any YouTube URL format → embed URL
const toEmbedUrl = (url = '') => {
  if (!url) return '';
  if (url.includes('youtube.com/embed/')) return url;
  const short = url.match(/youtu\.be\/([^?&]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  const watch = url.match(/[?&]v=([^?&]+)/);
  if (watch) return `https://www.youtube.com/embed/${watch[1]}`;
  return url;
};

const BLOCK_TYPES = [
  { type: 'text',        label: 'Paragraf',    desc: 'Teks narasi biasa',           Icon: AlignLeft,  color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/25' },
  { type: 'heading2',   label: 'Judul Besar', desc: 'Judul section (H2)',           Icon: Type,       color: 'text-purple-400',  bg: 'bg-purple-500/10 border-purple-500/25' },
  { type: 'heading3',   label: 'Sub-judul',   desc: 'Judul kecil (H3)',             Icon: Type,       color: 'text-violet-400',  bg: 'bg-violet-500/10 border-violet-500/25' },
  { type: 'callout',    label: 'Callout',     desc: 'Kotak highlight / catatan',    Icon: Lightbulb,  color: 'text-yellow-400',  bg: 'bg-yellow-500/10 border-yellow-500/25' },
  { type: 'image',      label: 'Gambar',      desc: 'Foto / ilustrasi',             Icon: Image,      color: 'text-green-400',   bg: 'bg-green-500/10 border-green-500/25' },
  { type: 'video_embed',label: 'YouTube',     desc: 'Embed video YouTube',          Icon: Youtube,    color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/25' },
  { type: 'list',       label: 'Daftar Poin', desc: 'Bullet list beberapa item',   Icon: List,       color: 'text-cyan-400',    bg: 'bg-cyan-500/10 border-cyan-500/25' },
  { type: 'link_card',  label: 'Tombol Link', desc: 'Tombol / card link eksternal', Icon: Link,       color: 'text-orange-400',  bg: 'bg-orange-500/10 border-orange-500/25' },
  { type: 'divider',    label: 'Pemisah',     desc: 'Garis horizontal pemisah',     Icon: Minus,      color: 'text-neutral-400', bg: 'bg-neutral-500/10 border-neutral-500/25' },
];

const emptyBlock = (type) => {
  if (type === 'list') return { type, items: [''] };
  if (type === 'link_card') return { type, href: '', text: '' };
  if (type === 'divider') return { type };
  if (type === 'callout') return { type, icon: '💡', text: '' };
  return { type, text: '', src: '', alt: '', icon: '💡' };
};

const emptyLesson = () => ({ id: '', type: 'video', title: '', duration: '10 min', videoUrl: '', content: [], visible: true });

// ── Block Preview ─────────────────────────────────────────────────────────────
const renderMd = (text = '') => text
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/\*(.+?)\*/g, '<em>$1</em>');

const BlockPreview = ({ block }) => {
  if (!block) return null;
  switch (block.type) {
    case 'text':
      return block.text
        ? <p className="text-neutral-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMd(block.text) }} />
        : <p className="text-neutral-600 text-sm italic">Paragraf kosong...</p>;
    case 'heading2':
      return block.text
        ? <h2 className="text-white font-bold text-base">{block.text}</h2>
        : <p className="text-neutral-600 text-sm italic">Judul kosong...</p>;
    case 'heading3':
      return block.text
        ? <h3 className="text-white font-semibold text-sm">{block.text}</h3>
        : <p className="text-neutral-600 text-sm italic">Sub-judul kosong...</p>;
    case 'callout':
      return (
        <div className="flex gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
          <span className="text-base flex-shrink-0">{block.icon || '💡'}</span>
          <p className="text-neutral-300 text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMd(block.text || 'Isi callout...') }} />
        </div>
      );
    case 'image':
      return block.src
        ? <img src={block.src} alt={block.alt || ''} className="rounded-lg max-h-28 object-cover w-full" onError={e => e.target.style.display='none'} />
        : <div className="h-16 rounded-lg bg-white/5 border border-dashed border-white/10 flex items-center justify-center text-neutral-600 text-xs">Preview gambar muncul setelah URL diisi</div>;
    case 'video_embed': {
      const embedSrc = toEmbedUrl(block.src);
      return embedSrc
        ? <div className="rounded-lg overflow-hidden aspect-video bg-black"><iframe src={embedSrc} className="w-full h-full" title="preview" allowFullScreen /></div>
        : <div className="h-16 rounded-lg bg-red-500/5 border border-dashed border-red-500/20 flex items-center justify-center gap-2 text-red-400/60 text-xs"><Youtube className="w-4 h-4" />Isi URL YouTube untuk preview</div>;
    }
    case 'list':
      return (block.items || []).filter(Boolean).length > 0
        ? <ul className="space-y-1">{(block.items || []).filter(Boolean).map((item, i) => <li key={i} className="flex gap-2 text-neutral-300 text-sm"><span className="mt-2 w-1 h-1 rounded-full bg-orange-400 flex-shrink-0" /><span dangerouslySetInnerHTML={{ __html: renderMd(item) }} /></li>)}</ul>
        : <p className="text-neutral-600 text-sm italic">Tambah item di editor...</p>;
    case 'link_card':
      return block.text
        ? <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium">{block.text}<ChevronRight className="w-3.5 h-3.5" /></div>
        : <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-neutral-500 text-sm">Teks link...</div>;
    case 'divider':
      return <div className="h-px bg-white/10 my-1" />;
    default:
      return <p className="text-neutral-600 text-xs italic">Block type tidak dikenali</p>;
  }
};

// ── Add Block Panel ───────────────────────────────────────────────────────────
const AddBlockPanel = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-white/15 hover:border-orange-500/40 hover:bg-orange-500/5 text-neutral-500 hover:text-orange-400 text-sm font-medium transition-all"
      >
        <Plus className="w-4 h-4" />
        Tambah Content Block
      </button>
      {open && (
        <div className="mt-2 p-3 bg-[#0D0D0D] border border-white/10 rounded-xl grid grid-cols-3 gap-2 shadow-xl z-10">
          {BLOCK_TYPES.map(({ type, label, desc, Icon, color, bg }) => (
            <button
              key={type}
              onClick={() => { onAdd(type); setOpen(false); }}
              className={`flex flex-col items-start gap-1.5 p-3 rounded-xl border ${bg} hover:opacity-90 transition-all text-left`}
            >
              <Icon className={`w-4 h-4 ${color}`} />
              <span className={`text-xs font-semibold ${color}`}>{label}</span>
              <span className="text-neutral-500 text-[10px] leading-tight">{desc}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Content Block Editor ──────────────────────────────────────────────────────
const ContentBlockEditor = ({ block, idx, onChange, onDelete }) => {
  const update = (fields) => onChange(idx, { ...block, ...fields });
  const meta = BLOCK_TYPES.find(b => b.type === block.type) || BLOCK_TYPES[0];
  const inputCls = "w-full bg-[#0D0D0D] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors";

  const updateListItem = (i, val) => {
    const items = [...(block.items || [])];
    items[i] = val;
    update({ items });
  };
  const addListItem = () => update({ items: [...(block.items || []), ''] });
  const removeListItem = (i) => update({ items: (block.items || []).filter((_, j) => j !== i) });

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      {/* Block Header */}
      <div className={`flex items-center gap-2 px-3 py-2 border-b border-white/5 ${meta.bg}`}>
        <meta.Icon className={`w-3.5 h-3.5 ${meta.color} flex-shrink-0`} />
        <span className={`text-xs font-bold ${meta.color} flex-1`}>{meta.label}</span>
        <span className="text-neutral-600 text-[10px]">{meta.desc}</span>
        <button onClick={() => onDelete(idx)} className="ml-2 text-neutral-600 hover:text-red-400 transition-colors text-xs" title="Hapus block">✕</button>
      </div>

      <div className="bg-[#111111] p-3 space-y-3">
        {/* ── Inputs ── */}
        <div className="space-y-2">
          {(block.type === 'text') && (
            <textarea value={block.text || ''} onChange={e => update({ text: e.target.value })} rows={3}
              placeholder="Tulis paragraf teks di sini. Gunakan **teks** untuk bold, *teks* untuk italic."
              className={inputCls + ' resize-none'} />
          )}
          {(block.type === 'heading2' || block.type === 'heading3') && (
            <input value={block.text || ''} onChange={e => update({ text: e.target.value })}
              placeholder={block.type === 'heading2' ? 'Tulis judul section...' : 'Tulis sub-judul...'}
              className={inputCls + ' font-bold'} />
          )}
          {block.type === 'callout' && (
            <>
              <div className="flex gap-2 items-center">
                <input value={block.icon || '💡'} onChange={e => update({ icon: e.target.value })}
                  placeholder="💡" className="w-14 bg-[#0D0D0D] border border-white/10 rounded-lg px-2 py-2 text-center text-base focus:outline-none focus:border-orange-500 transition-colors" />
                <span className="text-neutral-600 text-xs">← Pilih emoji untuk ikon callout</span>
              </div>
              <textarea value={block.text || ''} onChange={e => update({ text: e.target.value })} rows={2}
                placeholder="Tulis isi callout di sini. Mendukung **bold** dan *italic*."
                className={inputCls + ' resize-none'} />
            </>
          )}
          {block.type === 'image' && (
            <>
              {/* Upload from gallery */}
              <label className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-dashed border-white/20 hover:border-orange-500/50 hover:bg-orange-500/5 text-neutral-400 hover:text-orange-400 text-sm cursor-pointer transition-all">
                <Image className="w-4 h-4" />
                Pilih dari galeri
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = ev => update({ src: ev.target.result, alt: block.alt || file.name.replace(/\.[^.]+$/, '') });
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
              {block.src && (
                <div className="relative">
                  <img src={block.src} alt={block.alt || ''} className="rounded-lg w-full max-h-40 object-cover" onError={e => e.target.style.display='none'} />
                  <button
                    onClick={() => update({ src: '', alt: '' })}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 hover:bg-red-500/80 text-white text-xs flex items-center justify-center transition-colors"
                  >✕</button>
                </div>
              )}
              <input value={block.alt || ''} onChange={e => update({ alt: e.target.value })}
                placeholder="Deskripsi gambar (opsional)"
                className={inputCls} />
            </>
          )}
          {block.type === 'video_embed' && (
            <>
              <input
                value={block.src || ''}
                onChange={e => update({ src: e.target.value })}
                onBlur={e => update({ src: toEmbedUrl(e.target.value) })}
                placeholder="Paste URL YouTube apa saja — otomatis dikonversi ke embed"
                className={inputCls}
              />
              <p className="text-neutral-600 text-[10px]">
                💡 Bisa paste URL biasa (youtube.com/watch?v=...) atau youtu.be/... — akan otomatis dikonversi.
              </p>
            </>
          )}
          {block.type === 'list' && (
            <div className="space-y-1.5">
              {(block.items || ['']).map((item, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <span className="text-neutral-500 text-xs w-4 text-center flex-shrink-0">{i + 1}.</span>
                  <input value={item} onChange={e => updateListItem(i, e.target.value)}
                    placeholder={`Item ${i + 1}... (mendukung **bold**)`}
                    className="flex-1 bg-[#0D0D0D] border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors" />
                  <button onClick={() => removeListItem(i)} className="text-neutral-600 hover:text-red-400 transition-colors text-xs flex-shrink-0">✕</button>
                </div>
              ))}
              <button onClick={addListItem} className="flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 transition-colors mt-1">
                <Plus className="w-3 h-3" /> Tambah item
              </button>
            </div>
          )}
          {block.type === 'link_card' && (
            <>
              <input value={block.text || ''} onChange={e => update({ text: e.target.value })}
                placeholder="Label tombol, contoh: 🛒 Beli di Shopee"
                className={inputCls} />
              <input value={block.href || ''} onChange={e => update({ href: e.target.value })}
                placeholder="URL tujuan, contoh: https://shopee.co.id/..."
                className={inputCls} />
            </>
          )}
          {block.type === 'divider' && (
            <p className="text-neutral-600 text-xs text-center py-1">Garis pemisah horizontal — tidak perlu input</p>
          )}
        </div>

        {/* ── Preview ── */}
        {block.type !== 'divider' && (
          <div className="border-t border-white/5 pt-2">
            <p className="text-[10px] text-neutral-600 uppercase tracking-widest mb-1.5">Preview</p>
            <div className="bg-[#0D0D0D] rounded-lg p-3 border border-white/5">
              <BlockPreview block={block} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Lesson Editor ─────────────────────────────────────────────────────────────
const LessonEditor = ({ lesson, idx, onChange, onDelete }) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('edit'); // 'edit' | 'preview'
  const update = (fields) => onChange(idx, { ...lesson, ...fields });
  const updateBlock = (bIdx, block) => {
    const content = [...(lesson.content || [])];
    content[bIdx] = block;
    update({ content });
  };
  const deleteBlock = (bIdx) => update({ content: (lesson.content || []).filter((_, i) => i !== bIdx) });
  const addBlock = (type) => update({ content: [...(lesson.content || []), emptyBlock(type)] });

  return (
    <div className="bg-[#1A1A1A] border border-white/10 rounded-xl overflow-hidden">
      {/* Lesson Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <button onClick={() => setOpen(!open)} className="flex-1 flex items-center gap-3 text-left">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${lesson.type === 'video' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'}`}>
            {lesson.type === 'video' ? <Play className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">{lesson.title || <span className="text-neutral-500 italic">Lesson tanpa judul</span>}</p>
            <p className="text-neutral-500 text-xs">{lesson.type === 'video' ? 'Video' : 'Materi Teks'} · {lesson.duration} · {(lesson.content || []).length} block</p>
          </div>
          {open ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
        </button>
        <button onClick={() => onDelete(idx)} className="p-1.5 text-red-400/40 hover:text-red-400 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {open && (
        <div className="border-t border-white/5">
          {/* Info Fields */}
          <div className="px-4 pt-3 pb-3 space-y-3 border-b border-white/5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 block">Judul Lesson</label>
                <input value={lesson.title} onChange={e => update({ title: e.target.value })}
                  placeholder="Nama lesson ini..."
                  className="w-full bg-[#111111] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors" />
              </div>
              <div>
                <label className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 block">Estimasi Durasi</label>
                <input value={lesson.duration} onChange={e => update({ duration: e.target.value })} placeholder="contoh: 10 min"
                  className="w-full bg-[#111111] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors" />
              </div>
            </div>
            {/* Video toggle */}
            <div className={`rounded-xl border p-3 transition-all ${lesson.type === 'video' ? 'border-orange-500/30 bg-orange-500/5' : 'border-white/10 bg-white/[0.02]'}`}>
              <label className="flex items-center justify-between cursor-pointer select-none" onClick={() => update({ type: lesson.type === 'video' ? 'text' : 'video', videoUrl: '' })}>
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${lesson.type === 'video' ? 'bg-orange-500/20' : 'bg-white/5'}`}>
                    <Youtube className={`w-4 h-4 ${lesson.type === 'video' ? 'text-orange-400' : 'text-neutral-500'}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${lesson.type === 'video' ? 'text-white' : 'text-neutral-400'}`}>Ada video utama di lesson ini?</p>
                    <p className="text-neutral-600 text-xs">Aktifkan jika lesson ini berisi video YouTube</p>
                  </div>
                </div>
                <div className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors flex-shrink-0 ${lesson.type === 'video' ? 'bg-orange-500' : 'bg-white/10'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${lesson.type === 'video' ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
              </label>
              {lesson.type === 'video' && (
                <div className="mt-3 space-y-2">
                  <input
                    value={lesson.videoUrl || ''}
                    onChange={e => update({ videoUrl: e.target.value })}
                    onBlur={e => update({ videoUrl: toEmbedUrl(e.target.value) })}
                    placeholder="Paste URL YouTube — otomatis dikonversi"
                    className="w-full bg-[#111111] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
                    onClick={e => e.stopPropagation()}
                  />
                  {lesson.videoUrl && (
                    <div className="rounded-lg overflow-hidden aspect-video bg-black">
                      <iframe src={toEmbedUrl(lesson.videoUrl)} className="w-full h-full" title="video preview" allowFullScreen />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Content Blocks Section */}
          <div className="px-4 pt-3 pb-4 space-y-3">
            {/* Tab bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 bg-[#111111] rounded-lg p-1">
                <button onClick={() => setTab('edit')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${tab === 'edit' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}>
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
                <button onClick={() => setTab('preview')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${tab === 'preview' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}>
                  <Eye className="w-3 h-3" /> Preview
                </button>
              </div>
              <span className="text-neutral-600 text-[10px]">{(lesson.content || []).length} block</span>
            </div>

            {tab === 'edit' ? (
              <div className="space-y-2">
                {(lesson.content || []).length === 0 ? (
                  <div className="py-6 border border-dashed border-white/10 rounded-xl text-center">
                    <LayoutList className="w-6 h-6 text-neutral-700 mx-auto mb-2" />
                    <p className="text-neutral-600 text-sm">Belum ada konten</p>
                    <p className="text-neutral-700 text-xs mt-0.5">Klik tombol di bawah untuk mulai menambah blok konten</p>
                  </div>
                ) : (
                  (lesson.content || []).map((block, bIdx) => (
                    <ContentBlockEditor key={bIdx} block={block} idx={bIdx} onChange={updateBlock} onDelete={deleteBlock} />
                  ))
                )}
                <AddBlockPanel onAdd={addBlock} />
              </div>
            ) : (
              // Preview mode
              <div className="bg-[#0D0D0D] rounded-xl border border-white/5 p-4">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
                  <div className={`w-5 h-5 rounded flex items-center justify-center ${lesson.type === 'video' ? 'bg-blue-500/20' : 'bg-orange-500/20'}`}>
                    {lesson.type === 'video' ? <Play className="w-3 h-3 text-blue-400" /> : <FileText className="w-3 h-3 text-orange-400" />}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{lesson.title || 'Lesson tanpa judul'}</p>
                    <p className="text-neutral-600 text-xs">{lesson.duration}</p>
                  </div>
                </div>
                {lesson.type === 'video' && lesson.videoUrl && (
                  <div className="mb-4 rounded-lg overflow-hidden aspect-video bg-black">
                    <iframe src={toEmbedUrl(lesson.videoUrl)} className="w-full h-full" title="lesson video" allowFullScreen />
                  </div>
                )}
                {lesson.type === 'video' && !lesson.videoUrl && (
                  <div className="mb-4 h-20 rounded-lg bg-red-500/5 border border-dashed border-red-500/20 flex items-center justify-center gap-2 text-red-400/50 text-xs">
                    <Youtube className="w-4 h-4" /> URL video belum diisi
                  </div>
                )}
                {(lesson.content || []).length === 0 && lesson.type !== 'video' ? (
                  <p className="text-neutral-600 text-sm text-center py-4">Belum ada konten untuk dipreview.</p>
                ) : (lesson.content || []).length > 0 ? (
                  <div className="space-y-3">
                    {(lesson.content || []).map((block, bIdx) => (
                      <BlockPreview key={bIdx} block={block} />
                    ))}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ChapterModal = ({ chapter, onClose, onSave, isNew }) => {
  const [form, setForm] = useState(chapter || {
    title: '', code: '', icon_name: 'BookOpen', color_theme: 'orange', coming_soon: false, visible: true, lessons: [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const updateLesson = (idx, lesson) => setForm(f => { const lessons = [...f.lessons]; lessons[idx] = lesson; return { ...f, lessons }; });
  const deleteLesson = (idx) => setForm(f => ({ ...f, lessons: f.lessons.filter((_, i) => i !== idx) }));
  const addLesson = () => setForm(f => ({ ...f, lessons: [...f.lessons, emptyLesson()] }));

  const handleSave = async () => {
    if (!form.title.trim()) { setError('Judul chapter wajib diisi.'); return; }
    const payload = { ...form, code: form.title.trim().toUpperCase() };
    setSaving(true); setError('');
    try { await onSave(payload); onClose(); }
    catch (e) { setError(e.response?.data?.detail || 'Gagal menyimpan.'); }
    setSaving(false);
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 px-4 py-8 overflow-y-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="bg-[#1A1A1A] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <h3 className="text-white font-bold text-lg">{isNew ? 'Buat Chapter Baru' : 'Edit Chapter'}</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-widest mb-1.5 block">Judul Chapter</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Contoh: Bonus Material" className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors" />
          </div>

          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-widest mb-2 block">Warna Tema</label>
            <div className="flex gap-2 flex-wrap">
              {Object.keys(COLOR_BADGE).map(c => (
                <button key={c} onClick={() => setForm(f => ({ ...f, color_theme: c }))}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold capitalize transition-all ${form.color_theme === c ? `${COLOR_BADGE[c]} ring-1` : 'bg-white/5 border-white/10 text-neutral-500'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-widest mb-2 block">Icon</label>
            <div className="flex gap-2 flex-wrap">
              {ICON_OPTIONS.map(({ name, Icon }) => (
                <button key={name} onClick={() => setForm(f => ({ ...f, icon_name: name }))}
                  className={`p-2.5 rounded-xl border transition-all ${form.icon_name === name ? 'bg-orange-500/20 border-orange-500/40' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                  <Icon className={`w-4 h-4 ${form.icon_name === name ? 'text-orange-400' : 'text-neutral-400'}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div onClick={() => setForm(f => ({ ...f, coming_soon: !f.coming_soon }))}
                className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${form.coming_soon ? 'bg-orange-500' : 'bg-white/10'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${form.coming_soon ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
              <span className="text-neutral-400 text-sm">Coming Soon</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div onClick={() => setForm(f => ({ ...f, visible: !f.visible }))}
                className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${form.visible ? 'bg-green-500' : 'bg-white/10'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${form.visible ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
              <span className="text-neutral-400 text-sm">Visible (aktif)</span>
            </label>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs text-neutral-500 uppercase tracking-widest">Materi / Lessons</label>
              <button onClick={addLesson} className="flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors">
                <Plus className="w-3.5 h-3.5" />Tambah Lesson
              </button>
            </div>
            {form.lessons.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-white/10 rounded-xl">
                <p className="text-neutral-600 text-sm">Belum ada lesson. Klik Tambah Lesson.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {form.lessons.map((lesson, idx) => (
                  <LessonEditor key={idx} lesson={lesson} idx={idx} onChange={updateLesson} onDelete={deleteLesson} />
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}
        </div>
        <div className="px-6 py-4 border-t border-white/5 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 font-semibold text-sm transition-colors">Batal</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            {isNew ? 'Buat Chapter' : 'Simpan Perubahan'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const CoursePage = () => {
  const [staticConfigs, setStaticConfigs] = useState({});
  const [dynamicChapters, setDynamicChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | { type: 'create' | 'edit', chapter?: {} }
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { id, title }

  const fetchChapters = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/admin/chapters');
      setStaticConfigs(data.static_configs || {});
      setDynamicChapters(data.dynamic_chapters || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchChapters(); }, []);

  const toggleStatic = async (chId, currentVisible) => {
    setTogglingId(`static-${chId}`);
    try {
      await api.patch(`/api/admin/chapters/static/${chId}`, { visible: !currentVisible });
      setStaticConfigs(prev => ({ ...prev, [String(chId)]: { ...prev[String(chId)], visible: !currentVisible } }));
    } catch {}
    setTogglingId(null);
  };

  const toggleDynamic = async (chapter) => {
    setTogglingId(`dynamic-${chapter.id}`);
    try {
      await api.put(`/api/admin/chapters/dynamic/${chapter.id}`, { ...chapter, visible: !chapter.visible, lessons: chapter.lessons || [] });
      setDynamicChapters(prev => prev.map(c => c.id === chapter.id ? { ...c, visible: !c.visible } : c));
    } catch {}
    setTogglingId(null);
  };

  const deleteDynamic = async (chapterId) => {
    setDeletingId(chapterId);
    try {
      await api.delete(`/api/admin/chapters/dynamic/${chapterId}`);
      setDynamicChapters(prev => prev.filter(c => c.id !== chapterId));
    } catch {}
    setDeletingId(null);
  };

  const handleCreate = async (form) => {
    const { data } = await api.post('/api/admin/chapters/dynamic', form);
    setDynamicChapters(prev => [...prev, data]);
  };

  const handleEdit = async (form) => {
    const chId = modal.chapter.id;
    await api.put(`/api/admin/chapters/dynamic/${chId}`, form);
    setDynamicChapters(prev => prev.map(c => c.id === chId ? { ...c, ...form } : c));
  };

  if (loading) return <div className="flex justify-center py-20"><RefreshCw className="w-6 h-6 text-orange-500 animate-spin" /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Course Management</h2>
          <p className="text-neutral-500 text-sm mt-0.5">On/off chapter, buat & edit materi baru</p>
        </div>
        <button onClick={() => setModal({ type: 'create' })}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-black font-bold text-sm px-4 py-2.5 rounded-xl transition-all">
          <Plus className="w-4 h-4" />Buat Chapter
        </button>
      </div>

      {/* Static Chapters */}
      <div className="mb-8">
        <p className="text-xs text-neutral-500 uppercase tracking-widest mb-3 px-1">Chapter Bawaan</p>
        <div className="space-y-2">
          {STATIC_CHAPTERS.map(ch => {
            const cfg = staticConfigs[String(ch.id)] || {};
            const visible = cfg.visible !== false;
            const isToggling = togglingId === `static-${ch.id}`;
            return (
              <div key={ch.id} className="flex items-center gap-4 bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${COLOR_BADGE[ch.color_theme] || COLOR_BADGE.orange}`}>
                  Ch.{ch.id}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{ch.title}</p>
                  <p className="text-neutral-500 text-xs">{ch.code}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${visible ? 'bg-green-500/15 text-green-400' : 'bg-white/5 text-neutral-500'}`}>
                  {visible ? 'Aktif' : 'Hidden'}
                </span>
                <button onClick={() => toggleStatic(ch.id, visible)} disabled={isToggling}
                  className={`p-2 rounded-lg border transition-colors disabled:opacity-50 ${visible ? 'bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20' : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10'}`}>
                  {isToggling ? <RefreshCw className="w-4 h-4 animate-spin" /> : visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Chapters */}
      <div>
        <p className="text-xs text-neutral-500 uppercase tracking-widest mb-3 px-1">
          Chapter Buatan ({dynamicChapters.length})
        </p>
        {dynamicChapters.length === 0 ? (
          <div className="bg-[#1A1A1A] border border-dashed border-white/10 rounded-2xl py-12 text-center">
            <BookOpen className="w-8 h-8 text-neutral-700 mx-auto mb-3" />
            <p className="text-neutral-500 text-sm">Belum ada chapter buatan.</p>
            <button onClick={() => setModal({ type: 'create' })} className="mt-3 text-orange-400 text-sm hover:text-orange-300 transition-colors">
              + Buat chapter pertama
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {dynamicChapters.map((ch, dynIdx) => {
              const visible = ch.visible !== false;
              const isToggling = togglingId === `dynamic-${ch.id}`;
              const isDeleting = deletingId === ch.id;
              const chapterNum = STATIC_CHAPTERS.length + dynIdx;
              return (
                <div key={ch.id} className="flex items-center gap-4 bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${COLOR_BADGE[ch.color_theme] || COLOR_BADGE.orange}`}>
                    Ch.{chapterNum}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{ch.title}</p>
                    <p className="text-neutral-500 text-xs">{(ch.lessons || []).length} lesson{(ch.lessons || []).length !== 1 ? 's' : ''}</p>
                  </div>
                  {ch.coming_soon && <span className="text-[10px] font-bold text-neutral-500 bg-white/5 px-2 py-0.5 rounded-full">Soon</span>}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${visible ? 'bg-green-500/15 text-green-400' : 'bg-white/5 text-neutral-500'}`}>
                    {visible ? 'Aktif' : 'Hidden'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setModal({ type: 'edit', chapter: ch })}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => toggleDynamic(ch)} disabled={isToggling}
                      className={`p-2 rounded-lg border transition-colors disabled:opacity-50 ${visible ? 'bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20' : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10'}`}>
                      {isToggling ? <RefreshCw className="w-4 h-4 animate-spin" /> : visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button onClick={() => setDeleteConfirm({ id: ch.id, title: ch.title })} disabled={isDeleting}
                      className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50">
                      {isDeleting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {modal && (
          <ChapterModal
            isNew={modal.type === 'create'}
            chapter={modal.chapter}
            onClose={() => setModal(null)}
            onSave={modal.type === 'create' ? handleCreate : handleEdit}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              className="bg-[#1A1A1A] border border-red-500/20 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 16 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Red accent top bar */}
              <div className="h-1 bg-gradient-to-r from-red-600 to-red-400" />

              <div className="p-6">
                {/* Icon */}
                <div className="flex justify-center mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-400" />
                  </div>
                </div>

                {/* Text */}
                <h3 className="text-white font-bold text-lg text-center mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Hapus Chapter?
                </h3>
                <p className="text-neutral-400 text-sm text-center mb-1">
                  Chapter ini akan dihapus permanen:
                </p>
                <p className="text-white font-semibold text-sm text-center mb-4 px-4 py-2 bg-white/5 rounded-xl border border-white/10 truncate">
                  {deleteConfirm.title}
                </p>

                {/* Warning */}
                <div className="flex items-start gap-2.5 bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3 mb-6">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300/80 text-xs leading-relaxed">
                    Semua materi dan lesson di dalam chapter ini akan ikut terhapus. <strong className="text-red-300">Tindakan ini tidak bisa dibatalkan.</strong>
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 font-semibold text-sm transition-all"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => { deleteDynamic(deleteConfirm.id); setDeleteConfirm(null); }}
                    className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Ya, Hapus
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
  const [grantDuration, setGrantDuration] = useState('lifetime');
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
      const { data } = await api.post('/api/admin/grant-access', { user_id: grantConfirm.userId, duration: grantDuration });
      setUsers(prev => prev.map(u => u.id === grantConfirm.userId
        ? { ...u, has_access: true, access_expires_at: data.expires_at || null }
        : u));
    } catch {}
    setActionLoading(false);
    setGrantConfirm(null);
    setGrantDuration('lifetime');
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
              {activePage === 'course' && <CoursePage key="course" />}
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
              <h3 className="text-white font-bold text-center text-lg mb-1">Beri Akses</h3>
              <p className="text-neutral-400 text-sm text-center mb-5">
                <span className="text-white font-semibold">{grantConfirm.userName}</span>
              </p>
              <div className="mb-5">
                <p className="text-xs text-neutral-500 uppercase tracking-widest mb-2">Durasi Akses</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: '3months', label: '3 Bulan' },
                    { value: '6months', label: '6 Bulan' },
                    { value: '1year', label: '1 Tahun' },
                    { value: 'lifetime', label: 'Lifetime ♾️' },
                  ].map(opt => (
                    <button key={opt.value} onClick={() => setGrantDuration(opt.value)}
                      className={`py-2.5 rounded-xl border text-sm font-bold transition-colors ${grantDuration === opt.value ? 'bg-green-500/20 border-green-500/40 text-green-400' : 'bg-white/5 border-white/10 text-neutral-400 hover:border-white/20'}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setGrantConfirm(null); setGrantDuration('lifetime'); }} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 font-semibold text-sm transition-colors">Batal</button>
                <button onClick={handleGrant} disabled={actionLoading} className="flex-1 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {actionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                  Beri Akses
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
