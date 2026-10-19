import React, { useState } from 'react';
import { Ruler, Copy, Check, SlidersHorizontal } from 'lucide-react';
import { SizeMeasurement } from '../types/fashion';

interface SizeChartTableProps {
  sizeChart: SizeMeasurement[];
  fitSummary?: string;
}

export const SizeChartTable: React.FC<SizeChartTableProps> = ({ sizeChart, fitSummary }) => {
  const [unit, setUnit] = useState<'cm' | 'inch'>('cm');
  const [copied, setCopied] = useState(false);
  const [highlightedSize, setHighlightedSize] = useState<'s' | 'm' | 'l' | 'xl' | 'xxl' | null>('m');

  const convertVal = (valStr: string | undefined): string => {
    if (!valStr) return '-';
    const num = parseFloat(valStr);
    if (isNaN(num)) return valStr;
    if (unit === 'inch') {
      return (num / 2.54).toFixed(1);
    }
    return num.toFixed(1);
  };

  const copyToClipboard = () => {
    let md = `| Vị trí đo (Point of Measure) | S | M | L | XL | XXL | Dung sai |\n|---|---|---|---|---|---|---|\n`;
    sizeChart.forEach(row => {
      md += `| ${row.pointOfMeasure} | ${row.s} | ${row.m} | ${row.l} | ${row.xl} | ${row.xxl || '-'} | ${row.tolerance} |\n`;
    });
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#14161b] border border-[#272a34] rounded-2xl p-5 shadow-xl flex flex-col gap-4">
      {/* Title & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#272a34] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Ruler className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-200">
              Bảng Thông Số Kích Thước (Size Chart & Grading Specs)
            </h4>
            <p className="text-xs text-zinc-400">
              {fitSummary || 'Quy chuẩn may đo chuẩn xưởng sản xuất (Garment Measurements)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Unit Toggle */}
          <div className="flex items-center bg-[#0c0d10] p-1 rounded-xl border border-[#272a34] text-xs">
            <button
              onClick={() => setUnit('cm')}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all ${
                unit === 'cm'
                  ? 'bg-amber-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              CM
            </button>
            <button
              onClick={() => setUnit('inch')}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all ${
                unit === 'inch'
                  ? 'bg-amber-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              INCH
            </button>
          </div>

          {/* Copy Table Markdown */}
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0c0d10] hover:bg-[#1a1d25] border border-[#272a34] text-xs text-zinc-300 transition-all active:scale-95"
            title="Sao chép bảng thông số dạng Markdown"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
            <span className="hidden sm:inline">{copied ? 'Đã sao chép' : 'Copy Bảng'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Size Filter Chips */}
      <div className="flex items-center gap-1.5 text-xs text-zinc-400 overflow-x-auto pb-1">
        <span className="text-[11px] font-mono uppercase text-zinc-500 flex items-center gap-1">
          <SlidersHorizontal className="w-3 h-3" /> Focus Size:
        </span>
        {(['s', 'm', 'l', 'xl', 'xxl'] as const).map(size => (
          <button
            key={size}
            onClick={() => setHighlightedSize(highlightedSize === size ? null : size)}
            className={`px-2.5 py-0.5 rounded-md font-mono text-[11px] uppercase transition-all ${
              highlightedSize === size
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'bg-[#0c0d10] border border-[#272a34] text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Size {size}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-[#272a34] bg-[#0c0d10]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#181a22] text-zinc-300 border-b border-[#272a34]">
              <th className="py-3 px-3.5 font-medium tracking-wide">Vị Trí Đo (Point of Measure)</th>
              <th
                className={`py-3 px-3 text-center font-mono transition-all ${
                  highlightedSize === 's' ? 'bg-amber-500/20 text-amber-300 font-bold' : ''
                }`}
              >
                S
              </th>
              <th
                className={`py-3 px-3 text-center font-mono transition-all ${
                  highlightedSize === 'm' ? 'bg-amber-500/20 text-amber-300 font-bold' : ''
                }`}
              >
                M (Sample)
              </th>
              <th
                className={`py-3 px-3 text-center font-mono transition-all ${
                  highlightedSize === 'l' ? 'bg-amber-500/20 text-amber-300 font-bold' : ''
                }`}
              >
                L
              </th>
              <th
                className={`py-3 px-3 text-center font-mono transition-all ${
                  highlightedSize === 'xl' ? 'bg-amber-500/20 text-amber-300 font-bold' : ''
                }`}
              >
                XL
              </th>
              <th
                className={`py-3 px-3 text-center font-mono transition-all ${
                  highlightedSize === 'xxl' ? 'bg-amber-500/20 text-amber-300 font-bold' : ''
                }`}
              >
                XXL
              </th>
              <th className="py-3 px-3 text-right font-mono text-zinc-400">Dung Sai</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e212b]">
            {sizeChart && sizeChart.length > 0 ? (
              sizeChart.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-[#151720] transition-colors group"
                >
                  <td className="py-2.5 px-3.5 text-zinc-200 font-medium group-hover:text-amber-200 transition-colors">
                    {row.pointOfMeasure}
                  </td>
                  <td
                    className={`py-2.5 px-3 text-center font-mono text-zinc-300 ${
                      highlightedSize === 's' ? 'bg-amber-500/10 text-amber-200 font-semibold' : ''
                    }`}
                  >
                    {convertVal(row.s)}
                  </td>
                  <td
                    className={`py-2.5 px-3 text-center font-mono text-zinc-300 ${
                      highlightedSize === 'm' ? 'bg-amber-500/10 text-amber-200 font-semibold' : ''
                    }`}
                  >
                    {convertVal(row.m)}
                  </td>
                  <td
                    className={`py-2.5 px-3 text-center font-mono text-zinc-300 ${
                      highlightedSize === 'l' ? 'bg-amber-500/10 text-amber-200 font-semibold' : ''
                    }`}
                  >
                    {convertVal(row.l)}
                  </td>
                  <td
                    className={`py-2.5 px-3 text-center font-mono text-zinc-300 ${
                      highlightedSize === 'xl' ? 'bg-amber-500/10 text-amber-200 font-semibold' : ''
                    }`}
                  >
                    {convertVal(row.xl)}
                  </td>
                  <td
                    className={`py-2.5 px-3 text-center font-mono text-zinc-300 ${
                      highlightedSize === 'xxl' ? 'bg-amber-500/10 text-amber-200 font-semibold' : ''
                    }`}
                  >
                    {convertVal(row.xxl) || '-'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-zinc-400 text-[11px]">
                    {row.tolerance || '±0.5cm'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-4 text-center text-zinc-500">
                  Chưa có thông số kích thước cụ thể.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
        <span>* Kích thước tính thành phẩm sau khi ủi hơi nước định hình.</span>
        <span>Đơn vị: {unit.toUpperCase()}</span>
      </div>
    </div>
  );
};
