/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DesignForm } from './components/DesignForm';
import { TechPackView } from './components/TechPackView';
import { TailorChatDrawer } from './components/TailorChatDrawer';
import { FabricVaultModal } from './components/FabricVaultModal';
import { AuthModal } from './components/AuthModal';
import { SAMPLE_INITIAL_DESIGN } from './data/sampleDesign';
import { FashionDesign, FabricItem, AuthUser } from './types/fashion';
import {
  Sparkles,
  Scissors,
  Layers,
  History,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  FileText,
  ShieldCheck,
  KeyRound,
  UserCheck,
} from 'lucide-react';

const STORAGE_KEY = 'atelier_fashion_designs_history_v1';
const AUTH_STORAGE_KEY = 'atelier_auth_user_session_v1';

const DEFAULT_ADMIN_USER: AuthUser = {
  id: 'usr_admin123',
  username: 'admin123',
  displayName: 'Senior Fashion AI Designer & Master Tailor',
  role: 'ADMIN',
  email: 'admin123@atelier.fashion.ai',
  atelierTitle: 'Giám Đốc Kỹ Thuật May & Trưởng Xưởng Rập (Master Tailor)',
};

export default function App() {
  const [currentDesign, setCurrentDesign] = useState<FashionDesign>(SAMPLE_INITIAL_DESIGN);
  const [historyDesigns, setHistoryDesigns] = useState<FashionDesign[]>([SAMPLE_INITIAL_DESIGN]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isTailorChatOpen, setIsTailorChatOpen] = useState(false);
  const [isFabricVaultOpen, setIsFabricVaultOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(DEFAULT_ADMIN_USER);
  const [activeViewMode, setActiveViewMode] = useState<'studio' | 'history'>('studio');

  // Load history and auth session from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistoryDesigns(parsed);
          setCurrentDesign(parsed[0]);
        }
      }

      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && parsedUser.username) {
          setCurrentUser(parsedUser);
        }
      } else {
        // By default set the active session as admin123
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEFAULT_ADMIN_USER));
        setCurrentUser(DEFAULT_ADMIN_USER);
      }
    } catch (e) {
      console.warn('Failed to load storage', e);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (newDesign: FashionDesign) => {
    setHistoryDesigns(prev => {
      const filtered = prev.filter(d => d.id !== newDesign.id);
      const updated = [newDesign, ...filtered].slice(0, 20);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to save to localStorage', err);
      }
      return updated;
    });
  };

  const handleLoginSuccess = (user: AuthUser, token: string) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn(e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
    setIsAuthModalOpen(false);
  };

  const handleGenerateDesign = async (formData: any) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/generate-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || json.details || 'Không thể tạo bản thiết kế');
      }

      const generatedDesign: FashionDesign = {
        id: `design-${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...json.data,
      };

      setCurrentDesign(generatedDesign);
      saveToHistory(generatedDesign);

      // Scroll to tech pack smoothly
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Error generating design:', err);
      setErrorMessage(
        err?.message || 'Có lỗi khi kết nối tới Master Tailor AI. Vui lòng thử lại sau.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAlternative = (conceptText: string) => {
    setIsTailorChatOpen(true);
  };

  const handleUpdateDesign = (updatedDesign: FashionDesign) => {
    setCurrentDesign(updatedDesign);
    saveToHistory(updatedDesign);
  };

  const handleVisualGenerated = (imageUrl: string) => {
    const updated = { ...currentDesign, visualImageUrl: imageUrl };
    setCurrentDesign(updated);
    saveToHistory(updated);
  };

  const handleSelectFabricFromVault = (fabric: FabricItem) => {
    setIsTailorChatOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0d10] text-zinc-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Atelier Header */}
      <Header
        onOpenFabricVault={() => setIsFabricVaultOpen(true)}
        activeDesignsCount={historyDesigns.length}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        {/* Account Confirmation Status Bar */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#171a24] via-[#12151d] to-[#161a22] border border-amber-500/30 shadow-lg flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-100 font-mono tracking-wide">
                  TÀI KHOẢN ADMIN: <span className="text-amber-300">admin123</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-semibold">
                  MẬT KHẨU: 123456789
                </span>
                <span className="hidden md:inline px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[10px]">
                  MASTER TAILOR PRIVILEGES
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Tài khoản đã được tạo và kích hoạt thành công trên hệ thống máy chủ Atelier AI.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#14161b] hover:bg-[#1f222d] border border-[#272a34] text-xs text-amber-300 font-medium transition-all active:scale-95 flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentUser ? 'Quản Lý Tài Khoản' : 'Đăng Nhập admin123'}</span>
            </button>
          </div>
        </div>

        {/* Editorial Sub-hero Banner */}
        <section className="relative rounded-3xl bg-gradient-to-r from-[#171a22] via-[#14161d] to-[#121319] border border-[#272a34] p-6 sm:p-8 overflow-hidden shadow-2xl">
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> SENIOR FASHION AI DESIGNER & MASTER TAILOR
              </span>
              <span className="hidden sm:inline text-xs font-mono text-zinc-400">
                // Runway Trends & Production Ready
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-serif">
              Biến Ý Tưởng Thành Bản Rập & Phiếu Kỹ Thuật May Mặc Chuẩn Xưởng
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-2xl">
              Cung cấp đầy đủ thông số kích thước (Size Chart chuẩn cm), bảng màu kèm mã Hex & Pantone,
              chất liệu vải định lượng GSM, góc nhìn đa chiều và prompt tạo ảnh AI chuyên nghiệp để bạn mang
              trực tiếp đến xưởng may sản xuất ngay lập tức.
            </p>

            {/* Quick Feature stats */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-zinc-400 font-mono">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Bảng size S/M/L/XL/XXL</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Bản vẽ phẳng 2D CAD</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Bảng màu Hex / Pantone</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Midjourney / Imagen Prompt</span>
              </div>
            </div>
          </div>
        </section>

        {/* Global Error Notice if any */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs sm:text-sm text-rose-300 flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs text-rose-400 hover:text-rose-200 underline"
            >
              Đóng
            </button>
          </div>
        )}

        {/* History / Studio Tab Toggle if user has saved multiple designs */}
        {historyDesigns.length > 1 && (
          <div className="flex items-center justify-between border-b border-[#272a34] pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveViewMode('studio')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeViewMode === 'studio'
                    ? 'bg-amber-500 text-zinc-950 shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200 bg-[#14161b]'
                }`}
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>Atelier Studio</span>
              </button>
              <button
                onClick={() => setActiveViewMode('history')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeViewMode === 'history'
                    ? 'bg-amber-500 text-zinc-950 shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200 bg-[#14161b]'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Bộ Sưu Tập Đã Lưu ({historyDesigns.length})</span>
              </button>
            </div>

            <span className="text-[11px] font-mono text-zinc-500">
              Đang xem: <span className="text-zinc-300 font-semibold">{currentDesign.designOverview.name}</span>
            </span>
          </div>
        )}

        {/* Studio View: Design Generator Form + Tech Pack Dossier */}
        {activeViewMode === 'studio' ? (
          <div className="flex flex-col gap-8">
            {/* Top: Creative Design Form */}
            <DesignForm onGenerate={handleGenerateDesign} isLoading={isLoading} />

            {/* Bottom: Comprehensive Tech Pack Dossier */}
            <section id="tech-pack-section" className="flex flex-col gap-4">
              <TechPackView
                design={currentDesign}
                onSelectAlternative={handleSelectAlternative}
                onOpenTailorChat={() => setIsTailorChatOpen(true)}
                onVisualGenerated={handleVisualGenerated}
              />
            </section>
          </div>
        ) : (
          /* History View: Saved Atelier Collection */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {historyDesigns.map(designItem => (
              <div
                key={designItem.id}
                onClick={() => {
                  setCurrentDesign(designItem);
                  setActiveViewMode('studio');
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  designItem.id === currentDesign.id
                    ? 'bg-[#181b24] border-amber-500/60 shadow-lg'
                    : 'bg-[#14161b] border-[#272a34] hover:border-zinc-500'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase text-amber-400 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
                      {designItem.designOverview.category || 'Outerwear'}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {new Date(designItem.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-zinc-100 font-serif line-clamp-1">
                    {designItem.designOverview.name}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                    {designItem.designOverview.style}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#232632] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    {designItem.techPack?.colorPalette?.slice(0, 3).map((c, cIdx) => (
                      <span
                        key={cIdx}
                        className="w-4 h-4 rounded-full border border-black/40 shadow-sm"
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                  <span className="text-amber-400 text-[11px] font-semibold hover:underline">
                    Xem Tech Pack →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Interactive Tailor Revision Drawer */}
      <TailorChatDrawer
        isOpen={isTailorChatOpen}
        onClose={() => setIsTailorChatOpen(false)}
        currentDesign={currentDesign}
        onUpdateDesign={handleUpdateDesign}
      />

      {/* Fabric & Trims Vault Modal */}
      <FabricVaultModal
        isOpen={isFabricVaultOpen}
        onClose={() => setIsFabricVaultOpen(false)}
        onSelectFabric={handleSelectFabricFromVault}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Atelier Footer */}
      <footer className="mt-12 border-t border-[#272a34] bg-[#0c0d10] py-8 text-xs text-zinc-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-zinc-300">
              Atelier AI — Senior Fashion AI Designer & Master Tailor
            </span>
          </div>
          <div>
            <span>Quy chuẩn sản xuất ISO Garment Specs // Tài khoản Admin: admin123</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
