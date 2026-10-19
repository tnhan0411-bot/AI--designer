import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Copy,
  Check,
  Scissors,
  Sparkles,
  Layers,
  Info,
  Maximize2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { FashionDesign } from '../types/fashion';
import { FlatSketchViewer } from './FlatSketchViewer';
import { SizeChartTable } from './SizeChartTable';
import { ColorPaletteViewer } from './ColorPaletteViewer';
import { ImagePromptCard } from './ImagePromptCard';
import { StylistCard } from './StylistCard';

interface TechPackViewProps {
  design: FashionDesign;
  onSelectAlternative?: (concept: string) => void;
  onOpenTailorChat?: () => void;
  onVisualGenerated?: (url: string) => void;
}

export const TechPackView: React.FC<TechPackViewProps> = ({
  design,
  onSelectAlternative,
  onOpenTailorChat,
  onVisualGenerated,
}) => {
  const [activeTab, setActiveTab] = useState<'visual_dossier' | 'raw_markdown'>('visual_dossier');
  const [copiedMd, setCopiedMd] = useState(false);
  const [activeAngleTab, setActiveAngleTab] = useState<'front' | 'back' | 'side'>('front');

  const { designOverview, techPack, imagePrompt, stylistRecommendations, fullMarkdown } = design;

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(fullMarkdown);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Action & Mode Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#14161b] p-3 rounded-2xl border border-[#272a34] shadow-lg">
        {/* Dossier Tabs */}
        <div className="flex items-center gap-1 bg-[#0c0d10] p-1 rounded-xl border border-[#272a34]">
          <button
            onClick={() => setActiveTab('visual_dossier')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'visual_dossier'
                ? 'bg-amber-500 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Hồ Sơ Kỹ Thuật (Tech Pack Dossier)</span>
          </button>
          <button
            onClick={() => setActiveTab('raw_markdown')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'raw_markdown'
                ? 'bg-amber-500 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Văn Bản Chuẩn 4 Phần (Markdown)</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onOpenTailorChat && (
            <button
              onClick={onOpenTailorChat}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 border border-amber-500/40 text-amber-300 text-xs font-medium transition-all active:scale-95 shadow-md"
              title="Mở bảng hiệu chỉnh rập & may đo với Master Tailor"
            >
              <Scissors className="w-3.5 h-3.5 text-amber-400" />
              <span>Chỉnh Sửa May Đo (Tailor Chat)</span>
            </button>
          )}

          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0c0d10] hover:bg-[#1f222d] border border-[#272a34] text-xs text-zinc-300 transition-all active:scale-95"
            title="Sao chép toàn bộ văn bản thiết kế"
          >
            {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
            <span className="hidden sm:inline">{copiedMd ? 'Đã chép' : 'Sao chép văn bản'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0c0d10] hover:bg-[#1f222d] border border-[#272a34] text-xs text-zinc-300 transition-all active:scale-95"
            title="In hoặc xuất PDF phiếu kỹ thuật cho xưởng may"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">In Phiếu Xưởng May</span>
          </button>
        </div>
      </div>

      {activeTab === 'raw_markdown' ? (
        /* RAW MARKDOWN FORMAT AS REQUESTED */
        <div className="bg-[#14161b] border border-[#272a34] rounded-2xl p-6 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#272a34] pb-3">
            <span className="text-xs font-mono uppercase text-zinc-400">
              Cấu trúc phản hồi chuẩn mực Senior Fashion AI Designer & Master Tailor
            </span>
            <span className="text-[11px] font-mono text-amber-400">ISO-TechPack Compatible</span>
          </div>
          <pre className="p-4 bg-[#0c0d10] rounded-xl border border-[#272a34] font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed overflow-x-auto select-all">
            {fullMarkdown}
          </pre>
        </div>
      ) : (
        /* RICH VISUAL TECH PACK DOSSIER */
        <div className="flex flex-col gap-6 printable-techpack">
          {/* 1. TỔNG QUAN THIẾT KẾ (DESIGN OVERVIEW) */}
          <div className="bg-[#14161b] border border-[#272a34] rounded-2xl p-6 shadow-xl flex flex-col gap-4 relative overflow-hidden">
            {/* Atelier accent background glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-[10px] font-semibold uppercase tracking-wider">
                    PHẦN 1 // DESIGN OVERVIEW
                  </span>
                  <span className="text-zinc-500 text-xs">•</span>
                  <span className="text-xs text-zinc-400 font-mono">
                    {designOverview?.category || 'Ready-to-Wear / Atelier'}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-serif">
                  {designOverview?.name}
                </h2>
                <p className="text-xs font-medium text-amber-400/90 mt-1 uppercase tracking-wider font-mono">
                  Phong cách: {designOverview?.style}
                </p>
              </div>

              {/* Target / Silhouette Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {designOverview?.season && (
                  <div className="bg-[#0c0d10] border border-[#272a34] px-3 py-1.5 rounded-xl text-xs text-zinc-300">
                    <span className="text-zinc-500 text-[10px] uppercase font-mono block">Mùa vụ</span>
                    <span className="font-semibold text-amber-200">{designOverview.season}</span>
                  </div>
                )}
                {designOverview?.targetGender && (
                  <div className="bg-[#0c0d10] border border-[#272a34] px-3 py-1.5 rounded-xl text-xs text-zinc-300">
                    <span className="text-zinc-500 text-[10px] uppercase font-mono block">Đối tượng</span>
                    <span className="font-semibold">{designOverview.targetGender}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Inspiration & Trend description */}
            <div className="bg-[#0c0d10] border border-[#272a34] rounded-xl p-4 flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Cảm Hứng & Xu Hướng (Inspiration & Trend Context):
              </span>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {designOverview?.inspirationAndTrend}
              </p>
              {designOverview?.silhouette && (
                <div className="mt-1 pt-2 border-t border-[#1e212b] text-xs text-zinc-400 flex items-center gap-2">
                  <span className="font-semibold text-zinc-300">Phom dáng chủ đạo (Silhouette):</span>
                  <span>{designOverview.silhouette}</span>
                </div>
              )}
            </div>

            {/* Aesthetic tags */}
            {designOverview?.keyAesthetics && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {designOverview.keyAesthetics.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 py-1 rounded-lg bg-[#181b22] border border-[#272a34] text-[11px] text-zinc-300 font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 2. BẢN THIẾT KẾ KỸ THUẬT DÀNH CHO XƯỞNG MAY (TECH PACK DETAILS) */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-[10px] font-semibold uppercase tracking-wider">
                PHẦN 2 // TECH PACK DETAILS
              </span>
              <h3 className="text-lg font-bold text-zinc-100 tracking-wide">
                Hồ Sơ Kỹ Thuật May Đo & Rập (Pattern & Factory Specs)
              </h3>
            </div>

            {/* 2A: Interactive 2D Flat Technical Sketch */}
            <FlatSketchViewer
              categoryKey={techPack?.garmentCategoryKey || 'blazer'}
              garmentName={designOverview?.name}
              sizeChart={techPack?.sizeChart}
              primaryColorHex={techPack?.colorPalette?.[0]?.hex}
              frontDescription={techPack?.multiAngleDetails?.frontView}
              backDescription={techPack?.multiAngleDetails?.backView}
            />

            {/* 2B: Size Chart Table */}
            <SizeChartTable
              sizeChart={techPack?.sizeChart}
              fitSummary={techPack?.fitSummary}
            />

            {/* 2C: Color Palette Swatches */}
            <ColorPaletteViewer colorPalette={techPack?.colorPalette} />

            {/* 2D: Fabrics & Trims Specification Card */}
            <div className="bg-[#14161b] border border-[#272a34] rounded-2xl p-5 shadow-xl flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-[#272a34] pb-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Scissors className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-200">
                    Chất Liệu Vải & Phụ Liệu Gợi Ý (Fabric & Trims Specifications)
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Định lượng GSM, vải lót, phụ liệu dập nổi & tiêu chuẩn mũi may
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Main & Lining Fabric */}
                <div className="bg-[#0c0d10] border border-[#272a34] rounded-xl p-4 flex flex-col gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold block mb-1">
                      Vải Chính (Shell Fabric)
                    </span>
                    <p className="text-xs text-zinc-200 font-medium leading-relaxed">
                      {techPack?.fabricsAndTrims?.mainFabric}
                    </p>
                  </div>

                  {techPack?.fabricsAndTrims?.liningFabric && (
                    <div className="pt-3 border-t border-[#1e212b]">
                      <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold block mb-1">
                        Vải Lót & Dựng Keo (Lining & Interlining)
                      </span>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {techPack.fabricsAndTrims.liningFabric}
                      </p>
                    </div>
                  )}

                  {techPack?.fabricsAndTrims?.seamAllowance && (
                    <div className="pt-3 border-t border-[#1e212b]">
                      <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold block mb-1">
                        Quy Cách Chừa Đường May (Seam Allowance)
                      </span>
                      <p className="text-xs font-mono text-zinc-300">
                        {techPack.fabricsAndTrims.seamAllowance}
                      </p>
                    </div>
                  )}
                </div>

                {/* Trims & Hardware + Sewing Specifications */}
                <div className="bg-[#0c0d10] border border-[#272a34] rounded-xl p-4 flex flex-col gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold block mb-2">
                      Phụ Liệu May (Trims & Hardware)
                    </span>
                    <ul className="space-y-1.5">
                      {techPack?.fabricsAndTrims?.trimsAndHardware?.map((trim, tIdx) => (
                        <li key={tIdx} className="text-xs text-zinc-300 flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{trim}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {techPack?.fabricsAndTrims?.sewingSpecifications && (
                    <div className="pt-3 border-t border-[#1e212b]">
                      <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold block mb-2">
                        Tiêu Chuẩn Đường May (Stitching Techniques)
                      </span>
                      <ul className="space-y-1.5">
                        {techPack.fabricsAndTrims.sewingSpecifications.map((stitch, sIdx) => (
                          <li key={sIdx} className="text-xs text-zinc-300 flex items-start gap-1.5">
                            <span className="text-zinc-500 font-mono text-[10px]">[{sIdx + 1}]</span>
                            <span>{stitch}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2E: Multi-angle Views Detail */}
            <div className="bg-[#14161b] border border-[#272a34] rounded-2xl p-5 shadow-xl flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#272a34] pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-200">
                      Mô Tả Các Góc Nhìn Kỹ Thuật (Multi-angle Details)
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Chi tiết mặt trước, mặt sau và góc nghiêng cho thợ cắt may
                    </p>
                  </div>
                </div>

                {/* Sub tabs for views */}
                <div className="flex items-center bg-[#0c0d10] p-1 rounded-xl border border-[#272a34] text-xs">
                  <button
                    onClick={() => setActiveAngleTab('front')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      activeAngleTab === 'front'
                        ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Mặt Trước
                  </button>
                  <button
                    onClick={() => setActiveAngleTab('back')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      activeAngleTab === 'back'
                        ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Mặt Sau
                  </button>
                  <button
                    onClick={() => setActiveAngleTab('side')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      activeAngleTab === 'side'
                        ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Góc Nghiêng & Chi Tiết
                  </button>
                </div>
              </div>

              {/* View Content Tab */}
              <div className="bg-[#0c0d10] border border-[#272a34] rounded-xl p-4">
                {activeAngleTab === 'front' && (
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider font-mono">
                      Mặt Trước (Front View Specification):
                    </span>
                    <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                      {techPack?.multiAngleDetails?.frontView}
                    </p>
                  </div>
                )}
                {activeAngleTab === 'back' && (
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider font-mono">
                      Mặt Sau (Back View Specification):
                    </span>
                    <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                      {techPack?.multiAngleDetails?.backView}
                    </p>
                  </div>
                )}
                {activeAngleTab === 'side' && (
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider font-mono">
                      Góc Nghiêng / Chi Tiết Đặc Biệt (Side & Detail View):
                    </span>
                    <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                      {techPack?.multiAngleDetails?.sideAndDetailView}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. PROMPT TẠO HÌNH ẢNH (IMAGE GENERATION PROMPT) */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-[10px] font-semibold uppercase tracking-wider">
                PHẦN 3 // IMAGE PROMPT
              </span>
              <h3 className="text-lg font-bold text-zinc-100 tracking-wide">
                Prompt Trực Quan Hóa AI (AI Visualizer)
              </h3>
            </div>
            <ImagePromptCard
              imagePrompt={imagePrompt}
              garmentName={designOverview?.name}
              visualImageUrl={design.visualImageUrl}
              onVisualGenerated={onVisualGenerated}
            />
          </div>

          {/* 4. ĐỀ XUẤT TỪ TRỢ LÝ THỜI TRANG (AI STYLIST RECOMMENDATIONS) */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-[10px] font-semibold uppercase tracking-wider">
                PHẦN 4 // STYLIST RECOMMENDATIONS
              </span>
              <h3 className="text-lg font-bold text-zinc-100 tracking-wide">
                Tư Vấn Biến Thể Xu Hướng & Phối Đồ Trọn Gói
              </h3>
            </div>
            <StylistCard
              recommendations={stylistRecommendations}
              onSelectAlternative={onSelectAlternative}
            />
          </div>
        </div>
      )}
    </div>
  );
};
