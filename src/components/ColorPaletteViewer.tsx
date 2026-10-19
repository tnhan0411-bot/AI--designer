import React, { useState } from 'react';
import { Palette, Copy, Check, Sparkles } from 'lucide-react';
import { ColorSwatch } from '../types/fashion';

interface ColorPaletteViewerProps {
  colorPalette: ColorSwatch[];
}

export const ColorPaletteViewer: React.FC<ColorPaletteViewerProps> = ({ colorPalette }) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="bg-[#14161b] border border-[#272a34] rounded-2xl p-5 shadow-xl flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-[#272a34] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-200">
              Bảng Màu Chủ Đạo (Color Palette & Swatches)
            </h4>
            <p className="text-xs text-zinc-400">
              Mã màu Hex & Pantone TCX quy chuẩn dệt nhuộm quốc tế
            </p>
          </div>
        </div>
        <div className="text-[11px] font-mono text-zinc-500">
          {colorPalette?.length || 0} Tông màu
        </div>
      </div>

      {/* Color Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {colorPalette?.map((swatch, idx) => (
          <div
            key={idx}
            className="group relative bg-[#0c0d10] border border-[#272a34] hover:border-amber-500/40 rounded-xl overflow-hidden transition-all duration-200 shadow-md flex flex-col"
          >
            {/* Swatch Color Bar */}
            <div
              className="w-full h-24 relative flex items-end p-2 transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundColor: swatch.hex }}
            >
              {/* Copy Hex pill button on hover */}
              <button
                onClick={() => handleCopy(swatch.hex)}
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 hover:bg-black backdrop-blur-md text-white text-[10px] font-mono px-2 py-1 rounded-md flex items-center gap-1 shadow-lg ml-auto"
                title="Sao chép mã HEX"
              >
                {copiedHex === swatch.hex ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>{swatch.hex}</span>
                  </>
                )}
              </button>
            </div>

            {/* Info details */}
            <div className="p-3 flex flex-col gap-1.5 flex-1 justify-between">
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="font-semibold text-xs text-zinc-100 group-hover:text-amber-300 transition-colors truncate">
                    {swatch.name}
                  </span>
                  <span className="font-mono text-[10px] text-zinc-400 shrink-0">
                    {swatch.hex}
                  </span>
                </div>
                {swatch.pantoneCode && (
                  <span className="text-[10px] font-mono text-zinc-500 block truncate">
                    {swatch.pantoneCode}
                  </span>
                )}
              </div>

              {/* Usage Role badge */}
              <div className="pt-2 border-t border-[#1f222d] flex items-center justify-between">
                <span className="text-[10px] text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full font-medium truncate max-w-full">
                  {swatch.usageRole}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
