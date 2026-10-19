import React, { useState } from 'react';
import {
  X,
  Lock,
  User,
  ShieldCheck,
  Sparkles,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Scissors,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react';
import { AuthUser } from '../types/fashion';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser, token: string) => void;
  currentUser: AuthUser | null;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentUser,
  onLogout,
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('admin123');
  const [password, setPassword] = useState('123456789');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickFillAdmin = () => {
    setUsername('admin123');
    setPassword('123456789');
    setIsRegisterMode(false);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const endpoint = isRegisterMode ? '/api/auth/register' : '/api/auth/login';
      const payload: any = {
        username: username.trim(),
        password: password.trim(),
      };
      if (isRegisterMode && displayName.trim()) {
        payload.displayName = displayName.trim();
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Xác thực không thành công.');
      }

      setSuccessMsg(`Đăng nhập thành công! Chào mừng ${data.user.displayName}`);
      onLoginSuccess(data.user, data.token);

      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Đã xảy ra lỗi khi kết nối.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-[#14161b] border border-[#272a34] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative">
        {/* Top Gold Tailor Tape Line */}
        <div className="w-full h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />

        {/* Header */}
        <div className="p-5 border-b border-[#272a34] flex items-center justify-between bg-[#101217]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wide">
                Hệ Thống Xác Thực Atelier AI
              </h3>
              <p className="text-[11px] text-zinc-400">
                Tài khoản Master Tailor & Xưởng May Độc Quyền
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-[#1f222d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If user is already logged in */}
        {currentUser ? (
          <div className="p-6 flex flex-col gap-5">
            <div className="p-4 rounded-2xl bg-[#0c0d10] border border-amber-500/30 flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-zinc-950 font-bold flex items-center justify-center text-lg font-serif shrink-0 shadow-lg">
                AT
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-zinc-100 text-sm truncate">
                    {currentUser.displayName}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[9px] font-bold">
                    {currentUser.role}
                  </span>
                </div>
                <p className="text-xs text-amber-400/90 font-medium mt-0.5 truncate">
                  {currentUser.atelierTitle}
                </p>
                <p className="text-[11px] text-zinc-400 font-mono mt-1">
                  Username: <span className="text-zinc-200 font-bold">{currentUser.username}</span>
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-[#0e1015] rounded-xl border border-[#272a34] text-xs space-y-2">
              <div className="flex items-center gap-2 text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Toàn quyền tạo rập & xuất Tech Pack xưởng may</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Quyền Master Tailor hiệu chỉnh thông số đo trực tiếp</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Lưu trữ bộ sưu tập không giới hạn</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onLogout}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#1f222d] hover:bg-rose-500/20 hover:text-rose-300 text-zinc-300 border border-[#2e3344] text-xs font-semibold transition-all active:scale-95"
              >
                Đăng Xuất
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all active:scale-95 shadow-md"
              >
                Tiếp Tục Sử Dụng
              </button>
            </div>
          </div>
        ) : (
          /* Login / Register Form */
          <div className="p-6 flex flex-col gap-5">
            {/* Quick credentials spotlight box */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#1c1813] to-[#12141a] border border-amber-500/30 flex flex-col gap-2 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" /> Tài Khoản Được Cấp Sẵn:
                </span>
                <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full font-mono">
                  ADMIN QUYỀN CAO NHẤT
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#0c0d10] p-2.5 rounded-xl border border-[#2b251b]">
                <div>
                  <span className="text-zinc-500 text-[10px] block">Tài khoản (User):</span>
                  <span className="text-amber-200 font-bold text-sm">admin123</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] block">Mật khẩu (Pass):</span>
                  <span className="text-amber-200 font-bold text-sm">123456789</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleQuickFillAdmin}
                className="w-full mt-1 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-medium transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Tự động điền tài khoản admin123</span>
              </button>
            </div>

            {/* Error / Success Notifications */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              {isRegisterMode && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    Họ Tên / Biệt Hiệu Nhà Thiết Kế
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="VD: NTK Nguyễn An"
                    className="w-full bg-[#0c0d10] border border-[#272a34] focus:border-amber-500/60 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
                  />
                </div>
              )}

              {/* Username Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Tài Khoản (Username)</span>
                  <span className="text-[10px] text-amber-400 font-mono">admin123</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    placeholder="Nhập admin123"
                    className="w-full bg-[#0c0d10] border border-[#272a34] focus:border-amber-500/60 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none font-mono"
                  />
                  <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Mật Khẩu (Password)</span>
                  <span className="text-[10px] text-amber-400 font-mono">123456789</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="Nhập 123456789"
                    className="w-full bg-[#0c0d10] border border-[#272a34] focus:border-amber-500/60 rounded-xl pl-9 pr-10 py-2.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none font-mono"
                  />
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>Đang xác thực thông tin...</span>
                ) : (
                  <>
                    <span>{isRegisterMode ? 'Đăng Ký Tài Khoản Mới' : 'Đăng Nhập Ngay'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="pt-2 text-center text-xs text-zinc-400">
              {isRegisterMode ? (
                <span>
                  Đã có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => setIsRegisterMode(false)}
                    className="text-amber-400 hover:underline font-semibold"
                  >
                    Đăng nhập bằng admin123
                  </button>
                </span>
              ) : (
                <span>
                  Muốn tạo thêm tài khoản thợ may khác?{' '}
                  <button
                    type="button"
                    onClick={() => setIsRegisterMode(true)}
                    className="text-amber-400 hover:underline font-semibold"
                  >
                    Đăng ký mới
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
