import React, { useState } from 'react';
import { Layers, Eye, Ruler, ZoomIn, ZoomOut } from 'lucide-react';
import { SizeMeasurement } from '../types/fashion';

interface FlatSketchViewerProps {
  categoryKey: string;
  garmentName: string;
  sizeChart: SizeMeasurement[];
  primaryColorHex?: string;
  frontDescription?: string;
  backDescription?: string;
}

export const FlatSketchViewer: React.FC<FlatSketchViewerProps> = ({
  categoryKey = 'blazer',
  garmentName,
  sizeChart,
  primaryColorHex = '#E6DFD5',
  frontDescription,
  backDescription,
}) => {
  const [view, setView] = useState<'front' | 'back'>('front');
  const [showMeasurements, setShowMeasurements] = useState(true);
  const [showStitchLines, setShowStitchLines] = useState(true);
  const [activeSizeIndex, setActiveSizeIndex] = useState<'s' | 'm' | 'l' | 'xl'>('m');

  const normalizedCategory = categoryKey.toLowerCase();

  // Helper to retrieve measurement for active size
  const getMeasurementVal = (query: string): string => {
    const item = sizeChart?.find(m => m.pointOfMeasure.toLowerCase().includes(query.toLowerCase()));
    if (!item) return '';
    return item[activeSizeIndex] ? `${item[activeSizeIndex]} cm` : '';
  };

  const bodyLength = getMeasurementVal('dài') || getMeasurementVal('length') || '74 cm';
  const shoulderWidth = getMeasurementVal('vai') || getMeasurementVal('shoulder') || '45 cm';
  const chestWidth = getMeasurementVal('ngực') || getMeasurementVal('chest') || '108 cm';
  const sleeveLength = getMeasurementVal('tay') || getMeasurementVal('sleeve') || '61.5 cm';

  return (
    <div className="bg-[#14161b] border border-[#272a34] rounded-2xl p-5 shadow-xl flex flex-col gap-4">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#272a34] pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-wide uppercase text-zinc-200">
              Bản Vẽ Phẳng Kỹ Thuật (Flat Technical CAD)
            </h4>
            <p className="text-xs text-zinc-400">
              Quy chuẩn rập xưởng may & tỷ lệ đo thực tế
            </p>
          </div>
        </div>

        {/* View Switcher: Front vs Back */}
        <div className="flex items-center gap-1.5 bg-[#0c0d10] p-1 rounded-xl border border-[#272a34]">
          <button
            onClick={() => setView('front')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              view === 'front'
                ? 'bg-zinc-200 text-zinc-950 font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Mặt Trước (Front)
          </button>
          <button
            onClick={() => setView('back')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              view === 'back'
                ? 'bg-zinc-200 text-zinc-950 font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Mặt Sau (Back)
          </button>
        </div>

        {/* Measurement Toggles & Active Size */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#0c0d10] px-2 py-1 rounded-lg border border-[#272a34] text-xs">
            <span className="text-zinc-500 text-[11px] font-mono mr-1">SIZE:</span>
            {(['s', 'm', 'l', 'xl'] as const).map(size => (
              <button
                key={size}
                onClick={() => setActiveSizeIndex(size)}
                className={`w-6 h-6 rounded flex items-center justify-center font-mono uppercase text-[11px] transition-all ${
                  activeSizeIndex === size
                    ? 'bg-amber-500 text-zinc-950 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowMeasurements(!showMeasurements)}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
              showMeasurements
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-[#0c0d10] text-zinc-400 border-[#272a34] hover:text-zinc-200'
            }`}
            title="Bật/Tắt đường gióng thông số đo"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden sm:inline">Thước đo</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-[#181a20] to-[#101115] border border-[#272a34] rounded-xl flex items-center justify-center overflow-hidden p-4 group">
        {/* Subtle atelier cutting grid background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #71717a 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Watermark brand tag */}
        <div className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-widest text-zinc-500 pointer-events-none">
          TECH CAD // SPEC v2026 // {categoryKey.toUpperCase()}
        </div>

        {/* Garment SVG Drawing */}
        <svg
          viewBox="0 0 500 440"
          className="w-full h-full max-h-[380px] drop-shadow-xl transition-all duration-300"
          style={{ strokeLinejoin: 'round', strokeLinecap: 'round' }}
        >
          {/* DEFINITIONS & STYLES */}
          <defs>
            <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.4" />
            </filter>
            <linearGradient id="garmentFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#252833" />
              <stop offset="100%" stopColor="#1c1e27" />
            </linearGradient>
          </defs>

          {/* RENDER GARMENT CATEGORY BASED ON KEY */}
          {normalizedCategory.includes('pants') || normalizedCategory.includes('trousers') ? (
            /* PANTS CAD SKETCH */
            <g id="pants-cad" filter="url(#softShadow)">
              {view === 'front' ? (
                <>
                  {/* Left & Right Legs Outline */}
                  <path
                    d="M 180,60 L 320,60 L 335,75 L 345,130 L 325,400 L 265,400 L 250,150 L 235,400 L 175,400 L 155,130 L 165,75 Z"
                    fill="url(#garmentFill)"
                    stroke="#e4e4e7"
                    strokeWidth="2.2"
                  />
                  {/* Waistband */}
                  <path d="M 180,60 L 320,60 L 320,78 L 180,78 Z" fill="#2d313e" stroke="#e4e4e7" strokeWidth="1.8" />
                  {/* Fly zipper placket */}
                  <path d="M 250,78 L 250,140 C 250,152 262,152 264,152" fill="none" stroke="#e4e4e7" strokeWidth="1.5" />
                  {/* Front Double Pleats */}
                  <path d="M 215,78 L 210,180" fill="none" stroke="#e4e4e7" strokeWidth="1.2" strokeDasharray={showStitchLines ? 'none' : '2,2'} />
                  <path d="M 230,78 L 227,150" fill="none" stroke="#71717a" strokeWidth="1" strokeDasharray="3,3" />
                  <path d="M 285,78 L 290,180" fill="none" stroke="#e4e4e7" strokeWidth="1.2" strokeDasharray={showStitchLines ? 'none' : '2,2'} />
                  <path d="M 270,78 L 273,150" fill="none" stroke="#71717a" strokeWidth="1" strokeDasharray="3,3" />
                  {/* Slant Pockets */}
                  <path d="M 178,78 L 160,135" fill="none" stroke="#e4e4e7" strokeWidth="1.5" />
                  <path d="M 322,78 L 340,135" fill="none" stroke="#e4e4e7" strokeWidth="1.5" />
                  {/* Hem Cuff Cuffs */}
                  <line x1="175" y1="385" x2="235" y2="385" stroke="#71717a" strokeWidth="1" strokeDasharray="2,2" />
                  <line x1="265" y1="385" x2="325" y2="385" stroke="#71717a" strokeWidth="1" strokeDasharray="2,2" />
                </>
              ) : (
                /* BACK VIEW PANTS */
                <>
                  <path
                    d="M 175,55 L 325,55 L 335,75 L 345,130 L 325,400 L 265,400 L 250,165 L 235,400 L 175,400 L 155,130 L 165,75 Z"
                    fill="url(#garmentFill)"
                    stroke="#e4e4e7"
                    strokeWidth="2.2"
                  />
                  {/* Back Rise Seam */}
                  <path d="M 250,55 L 250,165" fill="none" stroke="#e4e4e7" strokeWidth="1.8" />
                  {/* Back Darts */}
                  <line x1="215" y1="75" x2="215" y2="110" stroke="#71717a" strokeWidth="1.2" strokeDasharray="2,2" />
                  <line x1="285" y1="75" x2="285" y2="110" stroke="#71717a" strokeWidth="1.2" strokeDasharray="2,2" />
                  {/* Double Welt Back Pockets */}
                  <rect x="195" y="105" width="40" height="8" rx="1" fill="#1f222c" stroke="#e4e4e7" strokeWidth="1.4" />
                  <circle cx="215" cy="120" r="2.5" fill="#e4e4e7" />
                  <rect x="265" y="105" width="40" height="8" rx="1" fill="#1f222c" stroke="#e4e4e7" strokeWidth="1.4" />
                  <circle cx="285" cy="120" r="2.5" fill="#e4e4e7" />
                </>
              )}
            </g>
          ) : normalizedCategory.includes('dress') || normalizedCategory.includes('ao_dai') || normalizedCategory.includes('skirt') ? (
            /* DRESS / AO DAI CAD SKETCH */
            <g id="dress-cad" filter="url(#softShadow)">
              {view === 'front' ? (
                <>
                  {/* Bodice & Flowing Skirt */}
                  <path
                    d="M 215,50 C 230,65 270,65 285,50 L 325,70 L 310,140 C 300,165 285,190 290,240 L 360,400 L 140,400 L 210,240 C 215,190 200,165 190,140 L 175,70 Z"
                    fill="url(#garmentFill)"
                    stroke="#e4e4e7"
                    strokeWidth="2.2"
                  />
                  {/* Neckline */}
                  <path d="M 215,50 C 235,70 265,70 285,50" fill="none" stroke="#e4e4e7" strokeWidth="2" />
                  {/* Bust Darts / Princess seams */}
                  <path d="M 205,120 Q 230,170 230,230" fill="none" stroke="#71717a" strokeWidth="1.2" strokeDasharray="3,3" />
                  <path d="M 295,120 Q 270,170 270,230" fill="none" stroke="#71717a" strokeWidth="1.2" strokeDasharray="3,3" />
                  {/* High Side Slit */}
                  <line x1="295" y1="280" x2="330" y2="400" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,2" />
                  <circle cx="295" cy="280" r="3" fill="#f59e0b" />
                  <text x="305" y="285" fill="#f59e0b" fontSize="10" fontFamily="monospace">Xẻ tà cao 55cm</text>
                  {/* Hem topstitch */}
                  <path d="M 145,392 C 220,385 280,385 355,392" fill="none" stroke="#71717a" strokeWidth="1" strokeDasharray="2,2" />
                </>
              ) : (
                /* BACK VIEW DRESS */
                <>
                  <path
                    d="M 215,50 C 230,55 270,55 285,50 L 325,70 L 310,140 C 300,165 285,190 290,240 L 360,400 L 140,400 L 210,240 C 215,190 200,165 190,140 L 175,70 Z"
                    fill="url(#garmentFill)"
                    stroke="#e4e4e7"
                    strokeWidth="2.2"
                  />
                  {/* Invisible Back Zipper */}
                  <line x1="250" y1="55" x2="250" y2="250" stroke="#f59e0b" strokeWidth="1.5" />
                  <circle cx="250" cy="55" r="3" fill="#f59e0b" />
                  <text x="258" y="70" fill="#f59e0b" fontSize="10" fontFamily="monospace">Khóa YKK ẩn 45cm</text>
                  {/* Back contour waist darts */}
                  <line x1="230" y1="170" x2="230" y2="240" stroke="#71717a" strokeWidth="1.2" strokeDasharray="2,2" />
                  <line x1="270" y1="170" x2="270" y2="240" stroke="#71717a" strokeWidth="1.2" strokeDasharray="2,2" />
                </>
              )}
            </g>
          ) : normalizedCategory.includes('hoodie') ? (
            /* HOODIE CAD SKETCH */
            <g id="hoodie-cad" filter="url(#softShadow)">
              {view === 'front' ? (
                <>
                  {/* Sleeves Dropped Shoulder */}
                  <path d="M 155,75 L 70,220 L 105,235 L 165,160 Z" fill="url(#garmentFill)" stroke="#e4e4e7" strokeWidth="2" />
                  <path d="M 345,75 L 430,220 L 395,235 L 335,160 Z" fill="url(#garmentFill)" stroke="#e4e4e7" strokeWidth="2" />
                  {/* Ribbed Cuffs */}
                  <polygon points="70,220 55,235 90,250 105,235" fill="#2d313e" stroke="#e4e4e7" strokeWidth="1.5" />
                  <polygon points="430,220 445,235 410,250 395,235" fill="#2d313e" stroke="#e4e4e7" strokeWidth="1.5" />
                  {/* Body */}
                  <path d="M 155,75 L 345,75 L 335,320 L 165,320 Z" fill="url(#garmentFill)" stroke="#e4e4e7" strokeWidth="2.2" />
                  {/* Ribbed Hem Bottom */}
                  <rect x="165" y="320" width="170" height="25" fill="#2d313e" stroke="#e4e4e7" strokeWidth="1.8" />
                  {/* Kangaroo Pocket */}
                  <path d="M 190,230 L 310,230 L 325,305 L 175,305 Z" fill="#242733" stroke="#e4e4e7" strokeWidth="1.5" />
                  <path d="M 190,230 L 175,275 L 175,305" fill="none" stroke="#e4e4e7" strokeWidth="1.5" />
                  <path d="M 310,230 L 325,275 L 325,305" fill="none" stroke="#e4e4e7" strokeWidth="1.5" />
                  {/* Hood Double Layer */}
                  <path d="M 195,75 C 190,30 230,15 250,15 C 270,15 310,30 305,75 C 290,95 210,95 195,75 Z" fill="#2d313e" stroke="#e4e4e7" strokeWidth="2" />
                  <path d="M 235,85 L 235,140" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                  <path d="M 265,85 L 265,140" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                </>
              ) : (
                /* BACK VIEW HOODIE */
                <>
                  <path d="M 155,75 L 70,220 L 105,235 L 165,160 Z" fill="url(#garmentFill)" stroke="#e4e4e7" strokeWidth="2" />
                  <path d="M 345,75 L 430,220 L 395,235 L 335,160 Z" fill="url(#garmentFill)" stroke="#e4e4e7" strokeWidth="2" />
                  <polygon points="70,220 55,235 90,250 105,235" fill="#2d313e" stroke="#e4e4e7" strokeWidth="1.5" />
                  <polygon points="430,220 445,235 410,250 395,235" fill="#2d313e" stroke="#e4e4e7" strokeWidth="1.5" />
                  <path d="M 155,75 L 345,75 L 335,320 L 165,320 Z" fill="url(#garmentFill)" stroke="#e4e4e7" strokeWidth="2.2" />
                  <rect x="165" y="320" width="170" height="25" fill="#2d313e" stroke="#e4e4e7" strokeWidth="1.8" />
                  {/* Resting Hood draped on back */}
                  <path d="M 190,75 C 185,120 220,150 250,150 C 280,150 315,120 310,75 Z" fill="#272a37" stroke="#e4e4e7" strokeWidth="1.8" />
                </>
              )}
            </g>
          ) : (
            /* DEFAULT / BLAZER / SUIT / JACKET CAD SKETCH */
            <g id="blazer-cad" filter="url(#softShadow)">
              {view === 'front' ? (
                <>
                  {/* Sleeves */}
                  <path d="M 140,75 L 65,240 L 105,250 L 160,155 Z" fill="url(#garmentFill)" stroke="#e4e4e7" strokeWidth="2" />
                  <path d="M 360,75 L 435,240 L 395,250 L 340,155 Z" fill="url(#garmentFill)" stroke="#e4e4e7" strokeWidth="2" />

                  {/* Sleeve Cuffs & 3 buttons */}
                  <circle cx="95" cy="242" r="2.2" fill="#d4d4d8" />
                  <circle cx="87" cy="240" r="2.2" fill="#d4d4d8" />
                  <circle cx="79" cy="238" r="2.2" fill="#d4d4d8" />
                  <circle cx="405" cy="242" r="2.2" fill="#d4d4d8" />
                  <circle cx="413" cy="240" r="2.2" fill="#d4d4d8" />
                  <circle cx="421" cy="238" r="2.2" fill="#d4d4d8" />

                  {/* Main Jacket Torso */}
                  <path
                    d="M 140,75 L 210,50 L 290,50 L 360,75 L 350,335 C 320,342 180,342 150,335 Z"
                    fill="url(#garmentFill)"
                    stroke="#e4e4e7"
                    strokeWidth="2.2"
                  />

                  {/* Lapel Notch (Ve K) & Collar */}
                  <path d="M 210,50 L 250,55 L 290,50 L 275,85 L 288,110 L 250,210 L 212,110 L 225,85 Z" fill="#282b36" stroke="#e4e4e7" strokeWidth="1.8" />
                  {/* Lapel Roll Line & Edge Stitch */}
                  <path d="M 210,50 L 225,85 L 212,110 L 250,225" fill="none" stroke="#e4e4e7" strokeWidth="1.5" />
                  <path d="M 290,50 L 275,85 L 288,110 L 250,225" fill="none" stroke="#e4e4e7" strokeWidth="1.5" />

                  {/* Center Front Placket & Concealed Button */}
                  <line x1="250" y1="225" x2="250" y2="338" stroke="#e4e4e7" strokeWidth="1.6" />
                  <circle cx="250" cy="238" r="4.5" fill="#f59e0b" stroke="#181a20" strokeWidth="1.5" />
                  <text x="260" y="242" fill="#f59e0b" fontSize="9" fontFamily="monospace">Khuy sừng 24mm</text>

                  {/* Left Breast Welt Pocket (Túi cơi nghiêng 1.5cm) */}
                  <polygon points="185,128 220,125 220,135 185,138" fill="#1c1e27" stroke="#e4e4e7" strokeWidth="1.4" />

                  {/* Lower Flap Pockets (Hai túi mổ có nắp) */}
                  <rect x="160" y="240" width="50" height="15" rx="1.5" fill="#242733" stroke="#e4e4e7" strokeWidth="1.4" />
                  <line x1="160" y1="240" x2="210" y2="240" stroke="#71717a" strokeWidth="1" strokeDasharray="2,2" />

                  <rect x="290" y="240" width="50" height="15" rx="1.5" fill="#242733" stroke="#e4e4e7" strokeWidth="1.4" />
                  <line x1="290" y1="240" x2="340" y2="240" stroke="#71717a" strokeWidth="1" strokeDasharray="2,2" />

                  {/* Structured Shoulders Pad guideline */}
                  <line x1="140" y1="75" x2="165" y2="70" stroke="#71717a" strokeWidth="1.5" strokeDasharray="3,2" />
                  <line x1="360" y1="75" x2="335" y2="70" stroke="#71717a" strokeWidth="1.5" strokeDasharray="3,2" />
                </>
              ) : (
                /* BACK VIEW BLAZER */
                <>
                  <path d="M 140,75 L 65,240 L 105,250 L 160,155 Z" fill="url(#garmentFill)" stroke="#e4e4e7" strokeWidth="2" />
                  <path d="M 360,75 L 435,240 L 395,250 L 340,155 Z" fill="url(#garmentFill)" stroke="#e4e4e7" strokeWidth="2" />
                  <circle cx="95" cy="242" r="2.2" fill="#d4d4d8" />
                  <circle cx="87" cy="240" r="2.2" fill="#d4d4d8" />
                  <circle cx="79" cy="238" r="2.2" fill="#d4d4d8" />
                  <circle cx="405" cy="242" r="2.2" fill="#d4d4d8" />
                  <circle cx="413" cy="240" r="2.2" fill="#d4d4d8" />
                  <circle cx="421" cy="238" r="2.2" fill="#d4d4d8" />

                  <path
                    d="M 140,75 L 210,50 L 290,50 L 360,75 L 350,335 C 320,342 180,342 150,335 Z"
                    fill="url(#garmentFill)"
                    stroke="#e4e4e7"
                    strokeWidth="2.2"
                  />

                  {/* Back Collar */}
                  <path d="M 210,50 C 235,60 265,60 290,50 L 285,68 C 265,75 235,75 215,68 Z" fill="#2d313e" stroke="#e4e4e7" strokeWidth="1.8" />

                  {/* Center Back Seam (Đường sống lưng) */}
                  <path d="M 250,68 L 250,265" fill="none" stroke="#e4e4e7" strokeWidth="1.8" />

                  {/* Center Back Single Vent (Xẻ tà 24cm) */}
                  <polygon points="250,265 258,265 258,340 250,340" fill="#2d313e" stroke="#f59e0b" strokeWidth="1.6" />
                  <line x1="250" y1="265" x2="265" y2="265" stroke="#f59e0b" strokeWidth="1.5" />
                  <text x="265" y="285" fill="#f59e0b" fontSize="9" fontFamily="monospace">Xẻ tà đơn 24cm</text>

                  {/* Side Back Princess lines */}
                  <path d="M 185,100 Q 195,180 190,260" fill="none" stroke="#71717a" strokeWidth="1.2" strokeDasharray="3,3" />
                  <path d="M 315,100 Q 305,180 310,260" fill="none" stroke="#71717a" strokeWidth="1.2" strokeDasharray="3,3" />
                </>
              )}
            </g>
          )}

          {/* MEASUREMENT GUIDELINES OVERLAY (Ruler callouts) */}
          {showMeasurements && (
            <g id="measurement-overlay" className="animate-fadeIn">
              {/* Shoulder Width Marker */}
              <line x1="140" y1="35" x2="360" y2="35" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="140" y1="28" x2="140" y2="42" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="360" y1="28" x2="360" y2="42" stroke="#38bdf8" strokeWidth="1.5" />
              <rect x="215" y="24" width="70" height="18" rx="4" fill="#0369a1" />
              <text x="250" y="37" fill="#f0f9ff" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                VAI {shoulderWidth}
              </text>

              {/* Chest Width Marker */}
              <line x1="150" y1="170" x2="350" y2="170" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="4,3" />
              <line x1="150" y1="165" x2="150" y2="175" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="350" y1="165" x2="350" y2="175" stroke="#38bdf8" strokeWidth="1.5" />
              <rect x="215" y="160" width="70" height="18" rx="4" fill="#0c4a6e" />
              <text x="250" y="173" fill="#bae6fd" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                NGỰC {chestWidth}
              </text>

              {/* Body Length Marker (Vertical) */}
              <line x1="455" y1="50" x2="455" y2="335" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="448" y1="50" x2="462" y2="50" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="448" y1="335" x2="462" y2="335" stroke="#38bdf8" strokeWidth="1.5" />
              <rect x="420" y="185" width="70" height="18" rx="4" fill="#0369a1" />
              <text x="455" y="198" fill="#f0f9ff" fontSize="9.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                DÀI {bodyLength}
              </text>

              {/* Sleeve Length Guideline */}
              <line x1="40" y1="75" x2="40" y2="250" stroke="#a855f7" strokeWidth="1.2" strokeDasharray="3,2" />
              <line x1="35" y1="75" x2="45" y2="75" stroke="#a855f7" strokeWidth="1.5" />
              <line x1="35" y1="250" x2="45" y2="250" stroke="#a855f7" strokeWidth="1.5" />
              <rect x="10" y="150" width="60" height="18" rx="4" fill="#6b21a8" />
              <text x="40" y="163" fill="#f3e8ff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                TAY {sleeveLength}
              </text>
            </g>
          )}
        </svg>

        {/* View Angle Description callout at bottom */}
        <div className="absolute bottom-2.5 left-3 right-3 bg-[#0c0d10]/90 backdrop-blur-md border border-[#272a34] rounded-lg px-3 py-2 text-xs text-zinc-300 flex items-start gap-2 shadow-lg">
          <Eye className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <div className="line-clamp-2 text-[11px] leading-relaxed">
            <span className="font-semibold text-amber-300">
              {view === 'front' ? 'Mặt trước (Front View): ' : 'Mặt sau (Back View): '}
            </span>
            {view === 'front' ? frontDescription : backDescription}
          </div>
        </div>
      </div>

      {/* Sewing pattern callouts pill tags */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="bg-[#0e1014] border border-[#272a34] p-2 rounded-lg">
          <span className="text-[10px] text-zinc-500 uppercase block font-mono">Dung sai may</span>
          <span className="text-zinc-200 font-medium">±0.5cm - 1.0cm</span>
        </div>
        <div className="bg-[#0e1014] border border-[#272a34] p-2 rounded-lg">
          <span className="text-[10px] text-zinc-500 uppercase block font-mono">Đường diễu mí</span>
          <span className="text-zinc-200 font-medium">1.0mm ve cổ & túi</span>
        </div>
        <div className="bg-[#0e1014] border border-[#272a34] p-2 rounded-lg">
          <span className="text-[10px] text-zinc-500 uppercase block font-mono">Gấu áo (Hem)</span>
          <span className="text-zinc-200 font-medium">Gập 4.0cm may lể</span>
        </div>
        <div className="bg-[#0e1014] border border-[#272a34] p-2 rounded-lg">
          <span className="text-[10px] text-zinc-500 uppercase block font-mono">Vải chính</span>
          <span className="text-amber-300 font-medium truncate block">{primaryColorHex}</span>
        </div>
      </div>
    </div>
  );
};
