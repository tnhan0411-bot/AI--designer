import React, { useState } from 'react';
import { Sparkles, Copy, Check, Camera, Image as ImageIcon, Loader2, ExternalLink } from 'lucide-react';
import { ImagePromptData } from '../types/fashion';

interface ImagePromptCardProps {
  imagePrompt: ImagePromptData;
  garmentName: string;
  visualImageUrl?: string;
  onVisualGenerated?: (url: string) => void;
}

export const ImagePromptCard: React.FC<ImagePromptCardProps> = ({
  imagePrompt,
  garmentName,
  visualImageUrl,
  onVisualGenerated,
}) => {
  const [copied, setCopied] = useState(false);
  const [isGeneratingVisual, setIsGeneratingVisual] = useState(false);
  const [visualError, setVisualError] = useState<string | null>(null);
  const [localVisualUrl, setLocalVisualUrl] = useState<string | null>(visualImageUrl || null);
  const [activeEngine, setActiveEngine] = useState<'midjourney' | 'imagen' | 'dalle'>('midjourney');

  const getEngineFormattedPrompt = () => {
    let p = imagePrompt.promptText || '';
    if (activeEngine === 'midjourney') {
      if (!p.includes('--ar')) {
        p += ` --ar ${imagePrompt.aspectRatio?.replace(':', ':') || '3:4'} --v 6.1 --style raw`;
      }
    } else if (activeEngine === 'dalle') {
      p = `Hyper-detailed fashion editorial lookbook photography: ${p}. Shot on 85mm f/1.4 lens, clean luxury studio backdrop.`;
    } else if (activeEngine === 'imagen') {
      p = `Studio lookbook photography of ${p}. Master fashion tailoring, sharp focus on fabric weave.`;
    }
    return p;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getEngineFormattedPrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateVisual = async () => {
    setIsGeneratingVisual(true);
    setVisualError(null);
    try {
      const res = await fetch('/api/generate-visual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${garmentName}: ${imagePrompt.promptText}`,
          aspectRatio: '3:4',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || data.details || 'Không thể tạo hình ảnh');
      }

      setLocalVisualUrl(data.imageUrl);
      if (onVisualGenerated) {
        onVisualGenerated(data.imageUrl);
      }
    } catch (err: any) {
      console.warn('Visual generation error:', err);
      setVisualError(
        'Không thể gọi mô hình tạo ảnh trực tiếp (yêu cầu cấu hình GEMINI_API_KEY). Bạn có thể copy prompt tiếng Anh bên dưới để dán vào Midjourney / Imagen.'
      );
    } finally {
      setIsGeneratingVisual(false);
    }
  };

  return (
    <div className="bg-[#14161b] border border-[#272a34] rounded-2xl p-5 shadow-xl flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#272a34] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-200">
              Prompt Tạo Hình Ảnh (Image Generation Prompt)
            </h4>
            <p className="text-xs text-zinc-400">
              Chuẩn hóa cho Midjourney v6.1 / DALL-E 3 / Google Imagen 3
            </p>
          </div>
        </div>

        {/* Engine switcher */}
        <div className="flex items-center bg-[#0c0d10] p-1 rounded-xl border border-[#272a34] text-xs">
          <button
            onClick={() => setActiveEngine('midjourney')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              activeEngine === 'midjourney'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Midjourney
          </button>
          <button
            onClick={() => setActiveEngine('imagen')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              activeEngine === 'imagen'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Google Imagen
          </button>
          <button
            onClick={() => setActiveEngine('dalle')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              activeEngine === 'dalle'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            DALL-E 3
          </button>
        </div>
      </div>

      {/* Main Prompt Textbox */}
      <div className="relative bg-[#0c0d10] border border-[#272a34] rounded-xl p-4 group">
        <p className="text-xs font-mono text-zinc-300 leading-relaxed break-words select-all">
          {getEngineFormattedPrompt()}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#1e212b]">
          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
            <span className="bg-[#171922] px-2 py-0.5 rounded border border-[#272a34] font-mono">
              AR: {imagePrompt.aspectRatio || '3:4'}
            </span>
            <span className="bg-[#171922] px-2 py-0.5 rounded border border-[#272a34] font-mono">
              Style: Editorial Runway 8K
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs transition-all active:scale-95 shadow-md"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã sao chép!' : 'Sao Chép Prompt'}</span>
            </button>

            <button
              onClick={handleGenerateVisual}
              disabled={isGeneratingVisual}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1f232e] hover:bg-[#2b303e] text-zinc-200 text-xs border border-[#353a4b] transition-all active:scale-95 disabled:opacity-50"
              title="Tạo hình ảnh Lookbook tức thì với AI"
            >
              {isGeneratingVisual ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  <span>Đang dựng ảnh...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Dựng Ảnh AI</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Visual Error Message if any */}
      {visualError && (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
          {visualError}
        </div>
      )}

      {/* Generated Visual Preview Card */}
      {localVisualUrl && (
        <div className="rounded-xl overflow-hidden border border-[#272a34] bg-[#0c0d10] p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
              Bản Dựng Trực Quan Runway AI (Lookbook Visualization)
            </span>
            <a
              href={localVisualUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
            >
              Xem ảnh gốc <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="relative aspect-[3/4] max-h-[460px] w-full rounded-lg overflow-hidden bg-black flex items-center justify-center">
            <img
              src={localVisualUrl}
              alt={garmentName}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Extra Technical Photography Notes */}
      {imagePrompt.lightingAndAtmosphere && (
        <div className="text-[11px] text-zinc-400 bg-[#0c0d10] p-3 rounded-lg border border-[#272a34] flex flex-col gap-1">
          <span className="text-zinc-300 font-semibold">💡 Bối cảnh & Ánh sáng gợi ý:</span>
          <span>{imagePrompt.lightingAndAtmosphere}</span>
          {imagePrompt.negativePrompt && (
            <span className="text-zinc-500 mt-1">
              <span className="text-zinc-400">Negative Prompt:</span> {imagePrompt.negativePrompt}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
