import React from 'react';
import { Sparkles, Compass, Shirt, ArrowRight } from 'lucide-react';
import { StylistRecommendations } from '../types/fashion';

interface StylistCardProps {
  recommendations: StylistRecommendations;
  onSelectAlternative?: (concept: string) => void;
}

export const StylistCard: React.FC<StylistCardProps> = ({
  recommendations,
  onSelectAlternative,
}) => {
  return (
    <div className="bg-[#14161b] border border-[#272a34] rounded-2xl p-5 shadow-xl flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#272a34] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-200">
              Đề Xuất Từ Trợ Lý Thời Trang (AI Stylist Recommendations)
            </h4>
            <p className="text-xs text-zinc-400">
              Biến thể phong cách bắt trend & gợi ý phối đồ toàn diện
            </p>
          </div>
        </div>
      </div>

      {/* 1. Alternative Versions */}
      <div className="flex flex-col gap-3">
        <h5 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Biến Thể Phong Cách (Alternative Versions)
        </h5>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommendations?.alternativeVersions?.map((alt, idx) => (
            <div
              key={idx}
              className="bg-[#0c0d10] border border-[#272a34] hover:border-amber-500/40 rounded-xl p-4 flex flex-col justify-between gap-3 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-semibold text-xs text-zinc-100 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    {alt.name}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {alt.concept}
                </p>

                {alt.modifications && alt.modifications.length > 0 && (
                  <ul className="mt-3 space-y-1 border-t border-[#1e212b] pt-2.5">
                    {alt.modifications.map((mod, mIdx) => (
                      <li key={mIdx} className="text-[11px] text-zinc-400 flex items-start gap-1.5">
                        <span className="text-amber-500 mt-0.5">•</span>
                        <span>{mod}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {onSelectAlternative && (
                <button
                  onClick={() => onSelectAlternative(`${alt.name}: ${alt.concept}`)}
                  className="mt-2 text-[11px] font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1 self-start group/btn"
                >
                  <span>Chuyển mẫu sang biến thể này</span>
                  <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Styling Tips */}
      <div className="flex flex-col gap-3 pt-3 border-t border-[#272a34]">
        <h5 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <Shirt className="w-3.5 h-3.5" /> Gợi Ý Phối Đồ & Phụ Kiện (Styling Tips)
        </h5>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {recommendations?.stylingTips?.map((tip, idx) => (
            <div
              key={idx}
              className="bg-[#0c0d10] border border-[#272a34] rounded-xl p-3 flex flex-col gap-1"
            >
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/90 font-medium">
                {tip.category}
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {tip.recommendation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
