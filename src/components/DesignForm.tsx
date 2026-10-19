import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Upload,
  X,
  Wand2,
  Sliders,
  Scissors,
  CheckCircle2,
  ChevronDown,
  Layers,
  ArrowRight,
  Palette,
} from 'lucide-react';

interface DesignFormProps {
  onGenerate: (formData: any) => Promise<void>;
  isLoading: boolean;
}

const RUNWAY_PRESETS = [
  {
    label: 'Quiet Luxury Blazer',
    prompt: 'Áo blazer dạ Cashmere Ý màu Oatmeal dáng suông Relaxed Boxy vai ngang sắc nét, ve áo chữ K nhỏ 6.5cm, 1 khuy giấu, xẻ tà đơn thân sau, túi mổ 2 viền.',
    category: 'blazer',
    style: 'Minimal Luxe & Quiet Luxury',
    fabric: 'Dạ Cashmere pha Lông cừu 320gsm',
  },
  {
    label: 'Modern Linen Áo Dài',
    prompt: 'Áo dài cách tân nữ chất liệu Linen Pháp mộc dệt thưa mềm mại, phom suông hiện đại phối tay raglan loe nhẹ, cổ trụ thấp 2.5cm viền chỉ tơ, xẻ tà cao 2 bên hông kết hợp quần lụa ống suông.',
    category: 'ao_dai',
    style: 'Asian Heritage Contemporary',
    fabric: 'Linen Pháp Bio-wash 240gsm phối lụa Tơ tằm',
  },
  {
    label: 'Cyberpunk Cargo Jacket',
    prompt: 'Áo khoác Utility Jacket dáng Cropped phá cấu trúc, túi hộp 3D đa năng tháo rời, khóa kéo kim loại 2 chiều YKK, chi tiết dây đai phản quang mờ, phom vai rủ dropped shoulder.',
    category: 'jacket',
    style: 'Streetwear Avant-Garde / Techwear',
    fabric: 'Nylon Taslan chống nước phối Cotton Twill',
  },
  {
    label: 'Sculptural Slip Dress',
    prompt: 'Đầm dạ hội dáng suông dài Maxi bằng lụa Satin nặng 22mm, cổ đổ nhẹ (draped cowl neck), khoét lưng chữ U sâu quyến rũ đan dây mảnh, đường xẻ tà đùi cao bất đối xứng sắc sảo.',
    category: 'dress',
    style: 'Haute Couture Minimalist',
    fabric: 'Lụa Mulberry Silk Satin 100% 22mm',
  },
  {
    label: 'Pleated Wide-Leg Pants',
    prompt: 'Quần tây nam nữ ống rộng Wide-leg cạp cao xếp 2 ly sâu (Double Inverted Pleats), đường gập gấu cuff 4cm phong cách Savile Row cổ điển, cạp bản to 5cm cài khuy móc giấu.',
    category: 'pants',
    style: 'Bespoke Vintage Tailoring',
    fabric: 'Wool Gabardine dệt chéo 280gsm',
  },
  {
    label: 'Heavyweight Boxy Hoodie',
    prompt: 'Áo hoodie phom rộng Boxy Streetwear nỉ bông dầy 450gsm, mũ 2 lớp đứng phom không dây rút (clean hood), vai trễ sâu, bo thun gấu và cổ tay bản to 8cm dệt cotton spandex co giãn tốt.',
    category: 'hoodie',
    style: 'Luxury Streetwear',
    fabric: 'Nỉ chân cua Heavy French Terry 100% Cotton 450gsm',
  },
];

export const DesignForm: React.FC<DesignFormProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState('blazer');
  const [style, setStyle] = useState('Haute Couture & Minimal Luxe');
  const [gender, setGender] = useState('Unisex');
  const [targetAudience, setTargetAudience] = useState('Thời trang ứng dụng cao cấp (Ready-to-Wear)');
  const [fabricPreference, setFabricPreference] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleApplyPreset = (preset: typeof RUNWAY_PRESETS[0]) => {
    setPrompt(preset.prompt);
    setCategory(preset.category);
    setStyle(preset.style);
    setFabricPreference(preset.fabric);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('Vui lòng chọn ảnh dung lượng dưới 8MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() && !imagePreview) {
      alert('Vui lòng nhập mô tả ý tưởng hoặc tải lên bản phác thảo hình ảnh.');
      return;
    }

    onGenerate({
      prompt,
      category,
      style,
      gender,
      targetAudience,
      fabricPreference,
      additionalNotes,
      imageBase64: imagePreview,
      imageMimeType: 'image/jpeg',
    });
  };

  return (
    <div className="bg-[#14161b] border border-[#272a34] rounded-2xl p-6 shadow-2xl flex flex-col gap-6 relative">
      {/* Form Header */}
      <div className="flex items-center justify-between border-b border-[#272a34] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-700/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-100 tracking-wide">
              Khởi Tạo Thiết Kế & Lập Phiếu Kỹ Thuật (Tech Pack)
            </h3>
            <p className="text-xs text-zinc-400">
              Nhập ý tưởng hoặc tải bản phác thảo — AI Master Tailor sẽ hoàn thiện toàn bộ hồ sơ xưởng may
            </p>
          </div>
        </div>
      </div>

      {/* Runway Presets quick bar */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-mono uppercase text-amber-400/90 font-medium flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Gợi ý phong cách Runway hàng đầu:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {RUNWAY_PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="text-xs bg-[#0c0d10] hover:bg-[#1f222e] border border-[#272a34] hover:border-amber-500/40 text-zinc-300 hover:text-amber-300 px-3 py-1.5 rounded-xl transition-all font-medium active:scale-95"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Main Idea Textarea */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Ý Tưởng Thiết Kế & Yêu Cầu May Mặc <span className="text-amber-500">*</span>
            </label>
            <span className="text-[11px] text-zinc-500 font-mono">
              Hỗ trợ tiếng Việt hoặc tiếng Anh
            </span>
          </div>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Ví dụ: Thiết kế áo khoác măng tô dáng dài qua gối phong cách Quiet Luxury tối giản bằng dạ lông cừu màu Taupe, cổ ve xế, đai thắt lưng may cùng chất liệu, 2 túi mổ chéo, xẻ tà đơn thân sau..."
            rows={4}
            className="w-full bg-[#0c0d10] border border-[#272a34] focus:border-amber-500/60 rounded-xl p-3.5 text-xs sm:text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500/40 transition-all leading-relaxed"
          />
        </div>

        {/* Categories & Styles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Garment Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Phân Loại Trang Phục
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="bg-[#0c0d10] border border-[#272a34] rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/60 font-medium"
            >
              <option value="blazer">Áo Blazer / Outerwear</option>
              <option value="jacket">Áo Khoác Bomber / Utility</option>
              <option value="coat">Áo Măng Tô / Trench Coat</option>
              <option value="dress">Đầm Dạ Hội / Váy Maxi</option>
              <option value="shirt">Áo Sơ Mi Kiểu / Blouse</option>
              <option value="pants">Quần Tây / Trousers Wide-leg</option>
              <option value="hoodie">Hoodie / Sweatshirt</option>
              <option value="ao_dai">Áo Dài Cách Tân Hiện Đại</option>
              <option value="skirt">Chân Váy Xếp Ly / Midi</option>
            </select>
          </div>

          {/* Style Direction */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Phong Cách Thiết Kế (Style)
            </label>
            <select
              value={style}
              onChange={e => setStyle(e.target.value)}
              className="bg-[#0c0d10] border border-[#272a34] rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/60 font-medium"
            >
              <option value="Haute Couture & Minimal Luxe">Haute Couture & Minimal Luxe</option>
              <option value="Streetwear Avant-Garde">Streetwear Avant-Garde</option>
              <option value="Quiet Luxury & Power Dressing">Quiet Luxury & Power Dressing</option>
              <option value="Bespoke Classic Savile Row">Bespoke Classic Savile Row</option>
              <option value="Eco-Fashion & Organic Linen">Eco-Fashion & Organic Linen</option>
              <option value="Asian Heritage Contemporary">Asian Heritage Contemporary</option>
              <option value="Y2K Futuristic">Y2K Futuristic / Neo-Punk</option>
            </select>
          </div>

          {/* Gender / Silhouette Target */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Đối Tượng / Giới Tính
            </label>
            <select
              value={gender}
              onChange={e => setGender(e.target.value)}
              className="bg-[#0c0d10] border border-[#272a34] rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/60 font-medium"
            >
              <option value="Unisex">Unisex (Nam & Nữ)</option>
              <option value="Nữ (Womenswear)">Nữ (Womenswear)</option>
              <option value="Nam (Menswear)">Nam (Menswear)</option>
              <option value="Bespoke Tailoring Custom">Bespoke Đo Ni Đóng Giày</option>
            </select>
          </div>
        </div>

        {/* Image Reference Upload & Fabric preference bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fabric preference */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Chất Liệu Ưu Tiên (Tùy chọn)
            </label>
            <input
              type="text"
              value={fabricPreference}
              onChange={e => setFabricPreference(e.target.value)}
              placeholder="VD: Dạ Cashmere 320gsm, Lụa Bảo Lộc, Linen Pháp 240gsm..."
              className="bg-[#0c0d10] border border-[#272a34] rounded-xl px-3.5 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          {/* Reference Image Upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
              <span>Bản Vẽ Phác Thảo / Ảnh Tham Khảo</span>
              {imagePreview && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-rose-400 hover:text-rose-300 text-[10px] flex items-center gap-0.5"
                >
                  <X className="w-3 h-3" /> Xóa ảnh
                </button>
              )}
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {!imagePreview ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-10 bg-[#0c0d10] hover:bg-[#1b1e27] border border-dashed border-[#272a34] hover:border-amber-500/50 rounded-xl px-3 flex items-center justify-center gap-2 text-xs text-zinc-400 hover:text-zinc-200 transition-all"
              >
                <Upload className="w-4 h-4 text-amber-400" />
                <span>Tải ảnh phác thảo / moodboard</span>
              </button>
            ) : (
              <div className="h-10 bg-[#0c0d10] border border-[#272a34] rounded-xl px-3 flex items-center justify-between text-xs text-zinc-200">
                <div className="flex items-center gap-2 truncate">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-6 h-6 object-cover rounded-md border border-zinc-700"
                  />
                  <span className="truncate text-xs text-zinc-300">Đã nạp ảnh tham khảo</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
            )}
          </div>
        </div>

        {/* Advanced tailoring options toggle */}
        <div className="border-t border-[#1e212b] pt-3">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-[11px] font-mono text-zinc-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showAdvanced ? 'Ẩn ghi chú thợ may nâng cao' : 'Thêm ghi chú xưởng may & định dạng phân phối'}</span>
          </button>

          {showAdvanced && (
            <div className="mt-3 p-3.5 bg-[#0c0d10] rounded-xl border border-[#272a34] flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono uppercase text-zinc-400">
                  Ghi Chú Kỹ Thuật Đặc Biệt (Tailor Factory Notes):
                </label>
                <textarea
                  value={additionalNotes}
                  onChange={e => setAdditionalNotes(e.target.value)}
                  placeholder="VD: Cần may lể giấu mũi toàn bộ gấu áo; dùng chỉ may Coats poly-core tex 40; may thêm túi bí mật trong lót áo..."
                  rows={2}
                  className="w-full bg-[#14161b] border border-[#272a34] rounded-lg p-2.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/60"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm tracking-wide uppercase transition-all duration-200 active:scale-[0.99] shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
              <span>Master Tailor Đang Phân Tích & Tạo Rập Kỹ Thuật...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 text-zinc-950 group-hover:rotate-12 transition-transform" />
              <span>Thiết Kế & Tạo Bản Kỹ Thuật Xưởng May (Tech Pack)</span>
              <ArrowRight className="w-4 h-4 text-zinc-950 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
