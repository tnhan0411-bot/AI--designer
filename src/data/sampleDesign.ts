import { FashionDesign } from '../types/fashion';

export const SAMPLE_INITIAL_DESIGN: FashionDesign = {
  id: 'atelier-design-001',
  createdAt: new Date().toISOString(),
  fullMarkdown: `## 1. TỔNG QUAN THIẾT KẾ (DESIGN OVERVIEW)
- Tên mẫu thiết kế: L'Ombre Minimalist Sculptural Blazer
- Phong cách (Style): Minimal Luxe & Deconstructed Tailoring (Phong cách Tối giản Cao cấp & Phá cấu trúc nhẹ)
- Cảm hứng & Trend: Cảm hứng từ chủ nghĩa kiến trúc đương đại kết hợp cùng xu hướng Quiet Luxury & Power Dressing 2026. Thiết kế tập trung vào đường cắt vai sắc nét (razor-sharp shoulder) nhưng loại bỏ độ cứng nhắc truyền thống, tôn vinh phom dáng thả lỏng tự nhiên (relaxed architectural draping).

## 2. BẢN THIẾT KỸ THUẬT DÀNH CHO XƯỞNG MAY (TECH PACK DETAILS)
- Kích thước & Phom dáng (Fit & Specs): Relaxed Boxy Fit kết hợp vai ngang có đệm mỏng 0.8cm. Cổ áo ve chữ K bản nhỏ 6.5cm. Bảng thông số đo chuẩn cm:
  + Size S: Dài áo 72cm | Rộng vai 43cm | Ngực 104cm | Eo 98cm | Dài tay 60cm
  + Size M: Dài áo 74cm | Rộng vai 45cm | Ngực 108cm | Eo 102cm | Dài tay 61.5cm
  + Size L: Dài áo 76cm | Rộng vai 47cm | Ngực 112cm | Eo 106cm | Dài tay 63cm
  + Size XL: Dài áo 78cm | Rộng vai 49cm | Ngực 116cm | Eo 110cm | Dài tay 64.5cm
  + Dung sai xưởng may: ±0.5cm
- Bảng màu chủ đạo (Color Palette):
  + Oatmeal Cashmere (#E6DFD5) - Màu chủ đạo thân áo
  + Espresso Umber (#362820) - Màu khuy sừng tự nhiên & viền chỉ lót
  + Pearl Alabaster (#F4F1EA) - Màu lót lụa Cupro bên trong
  + Slate Charcoal (#2C2F36) - Màu phối ve áo hoặc đường may giấu
- Chất liệu vải & Phụ liệu gợi ý (Fabric & Trims):
  + Vải chính: Vải Dạ Cashmere pha Lông cừu Úc Virgin Wool định lượng 320gsm, dệt chéo bề mặt mịn màng mờ lì.
  + Vải lót: Vải lụa Cupro Bemberg 100% 75gsm thoáng khí, chống tích điện cao cấp.
  + Mùng mex: Mex dựng mềm chuyên dụng cho áo Vest ép nhiệt nhiệt độ 130°C trong 12 giây.
  + Khuy cúc: Khuy sừng trâu tự nhiên dập mờ đường kính 24mm (thân) và 15mm (cửa tay).
  + Chỉ may: Chỉ may Coats Poly-core tex 40 độ bền cao, màu tiệp với vải chính.
  + Quy cách may: Đường diễu mí 1mm sắc sảo quanh ve cổ và nắp túi; gấu áo gập 4cm may giấu mũi bằng máy khâu lể chuyên dụng.
- Mô tả các góc nhìn (Multi-angle Details):
  + Mặt trước (Front View): Cổ ve K sắc nét ve nhỏ 6.5cm; ngực áo cài 1 khuy giấu (concealed single horn button) tạo sự liền mạch tuyệt đối; hai bên thân có túi mổ 2 viền (double-welt pockets) kèm nắp túi có thể giấu vào trong; túi cơi ngực trái nghiêng nhẹ 1.5cm tạo điểm nhấn lịch lãm.
  + Mặt sau (Back View): Thân sau cắt sống lưng 2 mảnh định hình độ rủ; xẻ tà đơn chính giữa cao 24cm tạo sự thoải mái tối đa khi cử động và ngồi; không sử dụng đường chiết eo bó sát nhằm giữ đúng tinh thần Boxy Minimalist.
  + Góc nghiêng / Chi tiết đặc biệt (Side/Detail View): Cầu vai ngang vươn rộng nhẹ 1.5cm so với điểm mút vai thật; tay áo 2 mang uốn cong công thái học nhẹ nhàng; cửa tay có 3 khuy đơm giả đè mí 1/3; đường nẹp ve nách được viền bọc piping lụa Cupro sạch sẽ đạt tiêu chuẩn may đo Bespoke Savile Row.

## 3. PROMPT TẠO HÌNH ẢNH (IMAGE GENERATION PROMPT)
- Dành cho Midjourney / DALL-E / Imagen:
"Editorial high-fashion runway lookbook photograph of an architectural minimalist relaxed boxy blazer in luxurious oatmeal cashmere wool fabric, sharp structured shoulders, subtle concealed horn button, double-welt pockets, draped effortlessly on an elegant fashion model, neutral studio concrete background, soft diffused natural daylight, hyper-detailed textile texture, cinematic editorial composition, vogue magazine style, 8k resolution, shot on Hasselblad H6D-100c --ar 3:4 --v 6.1 --style raw"

## 4. ĐỀ XUẤT TỪ TRỢ LÝ THỜI TRANG (AI STYLIST RECOMMENDATIONS)
- Biến thể phong cách (Alternative Versions):
  + Biến thể 1 - "Avant-Garde Belted Cut": Thêm đai thắt vải bản to 5cm may từ cùng chất liệu cashmere có khóa kim loại titan mờ để tạo điểm nhấn chiết eo theo phong cách New Silhouette.
  + Biến thể 2 - "Summer Resort Linen Edition": Chuyển đổi chất liệu sang Linen Pháp mộc 260gsm không lót thân sau (half-lined), giữ nguyên đường nét nhưng tạo cảm giác phóng khoáng, thoáng khí cho mùa Hè Địa Trung Hải.
- Gợi ý phối đồ (Styling Tips):
  + Quần phối cùng: Quần tây ống rộng xếp 2 ly (Double Pleated Wide-leg Trousers) đồng màu tone-sur-tone hoặc màu kem sáng tạo cảm giác chân dài miên man.
  + Áo lót trong: Áo thun cổ lọ len Merino dệt kim siêu mỏng hoặc áo ba lỗ tank top gân cotton pima màu trắng ngà.
  + Giày & Phụ kiện: Giày da Loafers mũi vuông bằng da bê bóng hoặc Chunky Derby; túi xách da cầm tay hình học tối giản và kính râm gọng kim loại titan.`,
  designOverview: {
    name: "L'Ombre Minimalist Sculptural Blazer",
    style: "Minimal Luxe & Deconstructed Tailoring",
    category: "Áo Blazer / Outerwear",
    targetGender: "Unisex / Haute Tailoring",
    inspirationAndTrend: "Lấy cảm hứng từ chủ nghĩa kiến trúc đương đại kết hợp cùng xu hướng Quiet Luxury & Power Dressing 2026. Phom dáng thả lỏng với cầu vai sắc nét và đường cắt ve áo tối giản.",
    silhouette: "Relaxed Boxy Fit với cầu vai ngang vươn nhẹ",
    season: "Thu / Đông 2026",
    keyAesthetics: ["Quiet Luxury", "Architectural Tailoring", "Minimalist", "Bespoke Details"],
  },
  techPack: {
    fitSummary: "Phom dáng suông rộng nhẹ (Relaxed Boxy), vai ngang có đệm 0.8cm, thân trước cài 1 khuy giấu, xẻ tà đơn thân sau.",
    garmentCategoryKey: "blazer",
    sizeChart: [
      { pointOfMeasure: "Dài áo thân sau (Center Back Length)", s: "72.0", m: "74.0", l: "76.0", xl: "78.0", xxl: "80.0", tolerance: "±0.5cm" },
      { pointOfMeasure: "Rộng vai qua sống (Across Shoulder)", s: "43.5", m: "45.0", l: "47.0", xl: "49.0", xxl: "51.0", tolerance: "±0.5cm" },
      { pointOfMeasure: "Vòng ngực áo (Chest 2.5cm below armhole)", s: "104.0", m: "108.0", l: "112.0", xl: "116.0", xxl: "120.0", tolerance: "±1.0cm" },
      { pointOfMeasure: "Vòng eo áo (Waist Width)", s: "98.0", m: "102.0", l: "106.0", xl: "110.0", xxl: "114.0", tolerance: "±1.0cm" },
      { pointOfMeasure: "Dài tay áo (Sleeve Length from shoulder)", s: "60.0", m: "61.5", l: "63.0", xl: "64.5", xxl: "65.5", tolerance: "±0.5cm" },
      { pointOfMeasure: "Rộng cửa tay (Sleeve Opening)", s: "14.5", m: "15.0", l: "15.5", xl: "16.0", xxl: "16.5", tolerance: "±0.3cm" },
      { pointOfMeasure: "Hạ nách cong (Armhole Depth curve)", s: "25.0", m: "26.0", l: "27.0", xl: "28.0", xxl: "29.0", tolerance: "±0.5cm" },
      { pointOfMeasure: "Rộng gấu áo (Bottom Sweep)", s: "108.0", m: "112.0", l: "116.0", xl: "120.0", xxl: "124.0", tolerance: "±1.0cm" },
    ],
    colorPalette: [
      { name: "Oatmeal Cashmere (Beige)", hex: "#E6DFD5", pantoneCode: "Pantone 12-0104 TCX", usageRole: "Vải chính toàn bộ thân áo" },
      { name: "Espresso Umber", hex: "#362820", pantoneCode: "Pantone 19-1218 TCX", usageRole: "Khuy sừng trâu tự nhiên & diễu chỉ" },
      { name: "Pearl Alabaster", hex: "#F4F1EA", pantoneCode: "Pantone 11-0601 TCX", usageRole: "Vải lót lụa Cupro bên trong" },
      { name: "Slate Charcoal", hex: "#2C2F36", pantoneCode: "Pantone 19-3908 TCX", usageRole: "Ve áo phụ hoặc phối đường may giấu" },
    ],
    fabricsAndTrims: {
      mainFabric: "Dạ Cashmere pha Lông cừu Úc (Virgin Wool 85%, Cashmere 15%) định lượng 320gsm, dệt chéo mịn lì mờ sang trọng.",
      liningFabric: "Lụa Cupro Bemberg 100% 75gsm thoáng mát tự nhiên, chống nhăn và chống tĩnh điện.",
      trimsAndHardware: [
        "1 Khuy sừng trâu 24mm (khuy giấu thân trước)",
        "6 Khuy sừng trâu 15mm (3 khuy mỗi cửa tay đè mí)",
        "Đệm vai mỏng bọc lụa 0.8cm định hình góc vai sắc nét",
        "Mex ép nhiệt chuyên dụng cho đồ Bespoke (nhiệt độ 130°C, lực ép 3.5 bar)",
        "Chỉ may Coats Poly-core tex 40 đồng màu",
      ],
      sewingSpecifications: [
        "Đường may chắp thân vắt sổ 4 chỉ sạch sẽ, ủi rẽ đường may (open seam press).",
        "Đường diễu mí ve cổ và nắp túi cách mép chuẩn xác 1.0mm.",
        "Gấu áo và cửa tay gập 4.0cm, khâu lể mũi giấu tay/máy chuyên dụng không lộ chỉ mặt phải.",
        "Túi mổ 2 viền bản 0.6cm cẩn thận, chặn góc tam giác gia cố chắc chắn.",
      ],
      seamAllowance: "Đường chắp thân: 1.0cm | Vòng cổ và ve: 0.7cm | Gấu áo & Gấu tay: 4.0cm | Vòng nách: 1.0cm",
    },
    multiAngleDetails: {
      frontView: "Cổ ve K sắc nét bản nhỏ 6.5cm. Cài 1 khuy giấu phía trong tạo mặt tiền liền khối sang trọng. Hai túi mổ 2 viền kèm nắp túi có thể lật giấu vào trong. Túi cơi ngực trái nghiêng 1.5cm chuẩn phong thái Bespoke cổ điển.",
      backView: "Thân sau chia làm 2 mảnh sống lưng uốn theo đường cột sống tự nhiên. Xẻ tà đơn chính giữa cao 24cm giúp cử động thoải mái. Không chiết eo bó, duy trì dáng suông kiến trúc hiện đại.",
      sideAndDetailView: "Cầu vai phẳng vươn nhẹ 1.5cm qua đỉnh xương vai. Tay áo 2 mang có độ cong nhẹ ôm theo tư thế tự nhiên của cánh tay. Cửa tay có 3 khuy đơm xẻ giả. Toàn bộ nẹp nách được bọc viền bias lụa Cupro sạch sẽ.",
    },
  },
  imagePrompt: {
    promptText: "Editorial high-fashion runway lookbook photograph of an architectural minimalist relaxed boxy blazer in luxurious oatmeal cashmere wool fabric, sharp structured shoulders, subtle concealed horn button, double-welt pockets, draped effortlessly on an elegant fashion model, neutral studio concrete background, soft diffused natural daylight, hyper-detailed textile texture, cinematic editorial composition, vogue magazine style, 8k resolution, shot on Hasselblad H6D-100c --ar 3:4 --v 6.1 --style raw",
    aspectRatio: "3:4",
    lightingAndAtmosphere: "Ánh sáng tự nhiên khuếch tán mềm (diffused natural daylight) kết hợp đèn viền studio làm nổi bật từng thớ sợi cashmere.",
    negativePrompt: "low quality, blurry, distorted anatomy, cheap plastic buttons, cartoon, oversaturated, messy sewing lines",
  },
  stylistRecommendations: {
    alternativeVersions: [
      {
        name: "Avant-Garde Belted Cut",
        concept: "Thêm thắt lưng bản to 5.0cm có khóa kim loại titan mờ tạo điểm nhấn eo bất đối xứng.",
        modifications: [
          "Bổ sung đai vải cashmere cùng chất liệu kèm khóa trượt titan.",
          "Chuyển ve áo thành ve nhọn bản lớn 8.5cm tạo vẻ ngoài quyền lực.",
        ],
      },
      {
        name: "Mediterranean Summer Linen Edition",
        concept: "Phiên bản mùa Hè Địa Trung Hải bằng vải Linen Pháp mộc 260gsm không lót thân sau (unlined/half-lined).",
        modifications: [
          "Thay dạ cashmere bằng Linen 100% màu Sand Beige.",
          "Bỏ đệm vai, cấu trúc hoàn toàn mềm mại tự nhiên (soft deconstructed shoulder).",
          "Viền toàn bộ đường may bên trong bằng kỹ thuật may cuốn viền Pháp (French seam piping).",
        ],
      },
    ],
    stylingTips: [
      {
        category: "Quần & Váy phối cùng",
        recommendation: "Quần tây ống rộng xếp 2 ly (Double Pleated Wide-leg) cùng chất liệu Oatmeal hoặc váy lụa satin maxi dài chấm gót tạo tương phản chất liệu.",
      },
      {
        category: "Áo lót trong (Inner Layer)",
        recommendation: "Áo thun len Merino cổ lọ siêu mỏng dệt kim hoặc áo tank top cotton pima màu ngà tinh khiết.",
      },
      {
        category: "Giày & Túi xách",
        recommendation: "Giày da Loafers da bê đen bóng gót thấp hoặc bốt mũi vuông; túi da cầm tay clutch hình khối chữ nhật tối giản.",
      },
      {
        category: "Phụ kiện trang sức",
        recommendation: "Khuyên tai bạc nguyên khối hình giọt nước hoặc vòng tay bản to tối giản bằng vàng mờ.",
      },
    ],
  },
};
