import React from 'react';
import { Scissors, Sparkles, BookOpen, Award, User, ShieldCheck, KeyRound } from 'lucide-react';
import { AuthUser } from '../types/fashion';

interface HeaderProps {
  onOpenFabricVault: () => void;
  activeDesignsCount: number;
  currentUser: AuthUser | null;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenFabricVault,
  currentUser,
  onOpenAuth,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0c0d10]/90 backdrop-blur-xl border-b border-[#272a34]">
      {/* Subtle Tailor's measuring tape top accent border */}
      <div
        className="w-full h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 opacity-80"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, #d97706, #d97706 6px, #451a03 6px, #451a03 10px)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 p-[1px] shadow-lg shadow-amber-950/40">
            <div className="w-full h-full bg-[#12141a] rounded-[11px] flex items-center justify-center text-amber-400">
              <Scissors className="w-5 h-5 -rotate-45" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white font-serif uppercase">
                Atelier AI <span className="text-amber-400 font-sans font-light text-xs sm:text-sm">| Master Tailor</span>
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-[10px]">
                <Award className="w-3 h-3" /> Haute Couture & Tech Pack
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 truncate max-w-xs sm:max-w-md">
              Senior Fashion AI Designer & Kỹ Thuật May Mặc Chuẩn Xưởng Sản Xuất
            </p>
          </div>
        </div>

        {/* Right Action buttons & Auth button */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenFabricVault}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#14161b] hover:bg-[#1f232d] border border-[#272a34] text-xs text-zinc-200 transition-all active:scale-95 shadow-sm"
            title="Mở kho dữ liệu vải & quy cách may"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Thư Viện Vải & Phụ Liệu</span>
          </button>

          {/* User Account / Login Button */}
          {currentUser ? (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-amber-600/15 hover:from-amber-500/25 hover:to-amber-600/25 border border-amber-500/40 text-amber-300 transition-all active:scale-95 shadow-md"
              title="Xem thông tin tài khoản Master Tailor"
            >
              <div className="w-5 h-5 rounded-full bg-amber-500 text-zinc-950 font-bold flex items-center justify-center text-[10px] font-mono">
                {currentUser.username.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold leading-none font-mono">
                  {currentUser.username}
                </span>
                <span className="text-[9px] text-amber-400/80 uppercase font-mono tracking-tight leading-none mt-0.5">
                  {currentUser.role}
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 text-xs font-bold transition-all active:scale-95 shadow-md"
              title="Đăng nhập tài khoản admin123"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Đăng Nhập (admin123)</span>
            </button>
          )}

          <div className="hidden lg:flex items-center gap-2 text-xs font-mono bg-[#14161b] px-3 py-1.5 rounded-xl border border-[#272a34]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-400 text-[11px]">SPEC ISO: cm</span>
          </div>
        </div>
      </div>
    </header>
  );
};
