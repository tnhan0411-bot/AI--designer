import React, { useState } from 'react';
import { X, Send, Scissors, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { FashionDesign } from '../types/fashion';

interface TailorChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentDesign: FashionDesign;
  onUpdateDesign: (newDesign: FashionDesign) => void;
}

export const TailorChatDrawer: React.FC<TailorChatDrawerProps> = ({
  isOpen,
  onClose,
  currentDesign,
  onUpdateDesign,
}) => {
  const [modificationText, setModificationText] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'tailor'; text: string }>>([
    {
      role: 'tailor',
      text: `Xin chào! Tôi là Master Tailor phụ trách rập và kỹ thuật sản xuất cho mẫu "${currentDesign.designOverview.name}". Bạn cần tôi điều chỉnh điểm đo nào (dài áo, hạ vai, nới ngực), thay đổi phụ liệu (khuy, khóa kéo YKK) hay điều chỉnh kết cấu rập không?`,
    },
  ]);

  if (!isOpen) return null;

  const quickPrompts = [
    'Hạ vai thêm 2cm và chuyển sang phom Boxy Oversized',
    'Chuyển từ 1 khuy giấu sang 2 hàng khuy kim loại Double-Breasted',
    'Đổi chất liệu sang Linen Pháp mộc 240gsm không lót',
    'Thêm xẻ tà đôi 2 bên hông (Dual Side Vents)',
  ];

  const handleSendModification = async (textToSend?: string) => {
    const text = textToSend || modificationText;
    if (!text.trim() || isRefining) return;

    const userMsg = text.trim();
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setModificationText('');
    setIsRefining(true);

    try {
      const res = await fetch('/api/refine-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentDesign,
          userModification: userMsg,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Lỗi khi cập nhật thiết kế');
      }

      const updated = {
        ...currentDesign,
        ...json.data,
      };

      onUpdateDesign(updated);

      setChatHistory(prev => [
        ...prev,
        {
          role: 'tailor',
          text: `Đã hiệu chỉnh xong hồ sơ kỹ thuật theo yêu cầu: "${userMsg}". Bản vẽ phẳng, bảng size chart và thông số may đã được đồng bộ lại.`,
        },
      ]);
    } catch (err: any) {
      setChatHistory(prev => [
        ...prev,
        {
          role: 'tailor',
          text: `Rất tiếc, đã có lỗi xảy ra trong quá trình xử lý rập: ${err.message || 'Vui lòng thử lại sau.'}`,
        },
      ]);
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-[#14161b] border-l border-[#272a34] h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-[#272a34] flex items-center justify-between bg-[#101217]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wide">
                Trợ Lý Master Tailor & Pattern Maker
              </h3>
              <p className="text-[11px] text-zinc-400">
                Hiệu chỉnh thông số kỹ thuật & kết cấu rập
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

        {/* Current design badge */}
        <div className="px-4 py-2 bg-[#0c0d10] border-b border-[#272a34] text-xs text-zinc-400 flex items-center justify-between">
          <span className="truncate text-zinc-300 font-medium">
            Mẫu: {currentDesign.designOverview.name}
          </span>
          <span className="font-mono text-[10px] text-amber-400">Live Editor</span>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-amber-500 text-zinc-950 font-medium rounded-tr-none'
                    : 'bg-[#1e212b] text-zinc-200 border border-[#2e3240] rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isRefining && (
            <div className="flex items-center gap-2 text-xs text-amber-400 font-mono bg-[#1a1c24] p-3 rounded-xl border border-amber-500/20">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Master Tailor đang tính toán phân rập và cập nhật Tech Pack...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts Suggestions */}
        <div className="p-3 bg-[#0c0d10] border-t border-[#272a34] flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-zinc-500 uppercase">Yêu cầu nhanh:</span>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((qp, qIdx) => (
              <button
                key={qIdx}
                disabled={isRefining}
                onClick={() => handleSendModification(qp)}
                className="text-[11px] bg-[#171922] hover:bg-[#232734] border border-[#272a34] text-zinc-300 hover:text-amber-300 px-2.5 py-1 rounded-lg transition-all text-left truncate max-w-full"
              >
                {qp}
              </button>
            ))}
          </div>
        </div>

        {/* Input box */}
        <div className="p-4 bg-[#101217] border-t border-[#272a34] flex items-center gap-2">
          <input
            type="text"
            value={modificationText}
            onChange={e => setModificationText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendModification()}
            placeholder="VD: Tăng dài áo thêm 4cm, nới ngực 2cm..."
            disabled={isRefining}
            className="flex-1 bg-[#0c0d10] border border-[#272a34] focus:border-amber-500/60 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none placeholder:text-zinc-600"
          />
          <button
            onClick={() => handleSendModification()}
            disabled={isRefining || !modificationText.trim()}
            className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
