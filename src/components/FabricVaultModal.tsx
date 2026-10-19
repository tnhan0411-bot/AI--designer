import React, { useState } from 'react';
import { X, Search, Check, Info, Sparkles, SlidersHorizontal, BookOpen } from 'lucide-react';
import { LUXURY_FABRIC_LIBRARY } from '../data/fabricLibrary';
import { FabricItem } from '../types/fashion';

interface FabricVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFabric: (fabric: FabricItem) => void;
}

export const FabricVaultModal: React.FC<FabricVaultModalProps> = ({
  isOpen,
  onClose,
  onSelectFabric,
}) => {
  const [search, setSearch] = useState('');
  const [selectedFabric, setSelectedFabric] = useState<FabricItem | null>(LUXURY_FABRIC_LIBRARY[0]);

  if (!isOpen) return null;

  const filteredFabrics = LUXURY_FABRIC_LIBRARY.filter(
    f =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.vietnameseName.toLowerCase().includes(search.toLowerCase()) ||
      f.composition.toLowerCase().includes(search.toLowerCase()) ||
      f.bestFor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fadeIn">
      <div className="w-full max-w-4xl bg-[#14161b] border border-[#272a34] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#272a34] flex items-center justify-between bg-[#101217]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100 uppercase tracking-wide">
                Thư Viện Vải & Tiêu Chuẩn Kỹ Thuật (Fabric & Trims Vault)
              </h3>
              <p className="text-xs text-zinc-400">
                Thông số định lượng GSM, độ rủ, cỡ kim may & nhiệt độ ủi chuẩn xưởng may
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

        {/* Search Bar */}
        <div className="p-4 bg-[#0c0d10] border-b border-[#272a34] flex items-center gap-2">
          <Search className="w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm theo tên vải, định lượng GSM, lụa, linen, cashmere, denim..."
            className="w-full bg-transparent text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
          />
        </div>

        {/* Content Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          {/* Fabric List */}
          <div className="md:col-span-5 border-r border-[#272a34] overflow-y-auto divide-y divide-[#1e212b] max-h-[55vh] md:max-h-[60vh]">
            {filteredFabrics.map(fabric => (
              <div
                key={fabric.id}
                onClick={() => setSelectedFabric(fabric)}
                className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                  selectedFabric?.id === fabric.id
                    ? 'bg-[#1e222e] border-l-4 border-amber-500'
                    : 'hover:bg-[#111318]'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-lg shrink-0 border border-zinc-700 shadow-inner flex items-end justify-end p-1"
                  style={{ backgroundColor: fabric.colorPreview }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-xs text-zinc-200 truncate">
                      {fabric.vietnameseName}
                    </span>
                    <span className="font-mono text-[10px] text-amber-400 shrink-0">
                      {fabric.gsm} GSM
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                    {fabric.composition}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Fabric Details & Technical Tailoring specs */}
          <div className="md:col-span-7 p-5 overflow-y-auto max-h-[55vh] md:max-h-[60vh] flex flex-col gap-4 bg-[#0e1014]">
            {selectedFabric ? (
              <>
                <div className="flex items-start justify-between gap-3 border-b border-[#272a34] pb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-amber-400">
                      {selectedFabric.name}
                    </span>
                    <h4 className="text-lg font-bold text-zinc-100 font-serif">
                      {selectedFabric.vietnameseName}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      {selectedFabric.composition}
                    </p>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-[#14161b] border border-[#272a34] text-center">
                    <span className="text-[10px] uppercase font-mono text-zinc-500 block">Định lượng</span>
                    <span className="font-mono text-sm font-bold text-amber-300">{selectedFabric.gsm} GSM</span>
                  </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#14161b] p-3 rounded-xl border border-[#272a34]">
                    <span className="text-[10px] uppercase font-mono text-zinc-500 block">Độ rủ (Drape)</span>
                    <span className="text-zinc-200 font-medium">{selectedFabric.drape}</span>
                  </div>
                  <div className="bg-[#14161b] p-3 rounded-xl border border-[#272a34]">
                    <span className="text-[10px] uppercase font-mono text-zinc-500 block">Độ co giãn</span>
                    <span className="text-zinc-200 font-medium">{selectedFabric.stretch}</span>
                  </div>
                  <div className="bg-[#14161b] p-3 rounded-xl border border-[#272a34]">
                    <span className="text-[10px] uppercase font-mono text-zinc-500 block">Cỡ kim may gợi ý</span>
                    <span className="text-zinc-200 font-mono font-medium">{selectedFabric.needleSize}</span>
                  </div>
                  <div className="bg-[#14161b] p-3 rounded-xl border border-[#272a34]">
                    <span className="text-[10px] uppercase font-mono text-zinc-500 block">Nhiệt độ bàn ủi</span>
                    <span className="text-zinc-200 font-mono font-medium">{selectedFabric.ironTemp}</span>
                  </div>
                </div>

                {/* Best for */}
                <div className="bg-[#14161b] p-3.5 rounded-xl border border-[#272a34]">
                  <span className="text-[10px] uppercase font-mono text-amber-400 font-semibold block mb-1">
                    Thích Hợp Nhất Cho Dáng Áo
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {selectedFabric.bestFor}
                  </p>
                </div>

                {/* Tailor Workshop Notes */}
                <div className="bg-[#1a1815] border border-amber-500/20 p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-mono text-amber-400 font-semibold block mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Ghi Chú Kỹ Thuật Cho Xưởng May (Tailor Master Note)
                  </span>
                  <p className="text-xs text-amber-200/90 leading-relaxed">
                    {selectedFabric.tailorNotes}
                  </p>
                </div>

                {/* Select button */}
                <button
                  onClick={() => {
                    onSelectFabric(selectedFabric);
                    onClose();
                  }}
                  className="mt-2 w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Chọn Loại Vải Này Cho Thiết Kế</span>
                </button>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-500 text-xs">
                Chọn một loại vải để xem chi tiết kỹ thuật
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
