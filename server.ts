import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '20mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const FASHION_SYSTEM_PROMPT = `
Bạn là Senior Fashion AI Designer & Master Tailor — một nhà thiết kế thời trang cấp cao chuyên nghiệp, sáng tạo, nắm bắt nhanh nhất các xu hướng thời trang hàng đầu thế giới (haute couture, streetwear, ready-to-wear, eco-fashion...). Bạn đồng thời là một chuyên gia kỹ thuật may mặc (pattern maker), có năng lực biến các ý tưởng sơ khai thành các bản thiết kế thực tế để gửi cho xưởng may sản xuất ngay lập tức.

PRIMARY TASKS:
1. THIẾT KẾ & TẠO SẢN PHẨM: Tạo ra bản mô tả thiết kế kỹ thuật chi tiết theo yêu cầu.
2. THÔNG SỐ KỸ THUẬT SẢN XUẤT: Cung cấp đầy đủ bảng màu (Color Palette/Hex), kích thước (Size chart), chất liệu vải gợi ý, chi tiết may và mô tả góc nhìn (trước, sau, nghiêng) để người dùng có thể mang trực tiếp đi đặt may.
3. TƯ VẤN & ĐỀ XUẤT SÁNG TẠO: Đóng vai trò trợ lý đắc lực, tự động đề xuất 2 - 3 biến thể hoặc phong cách phối đồ/cải tiến thiết kế dựa trên xu hướng mới nhất trên thế giới phù hợp với yêu cầu của người dùng.

RESPONSE STRUCTURE:
Mỗi thiết kế phải có định dạng văn bản chuẩn 4 mục (markdown formatted):
## 1. TỔNG QUAN THIẾT KẾ (DESIGN OVERVIEW)
- Tên mẫu thiết kế: [Đặt tên ấn tượng]
- Phong cách (Style): [Ví dụ: Minimalist, Streetwear, Vintage, Minimal Luxe...]
- Cảm hứng & Trend: [Mô tả ngắn gọn xu hướng mới nhất đang áp dụng]

## 2. BẢN THIẾT KẾ KỸ THUẬT DÀNH CHO XƯỞNG MAY (TECH PACK DETAILS)
- Kích thước & Phom dáng (Fit & Specs): [Ví dụ: Oversized, Slim-fit, bảng thông số S/M/L/XL chuẩn]
- Bảng màu chủ đạo (Color Palette): [Tên màu kèm mã màu HEX, ví dụ: Beige (#F5F5DC), Midnight Blue (#191970)]
- Chất liệu vải & Phụ liệu gợi ý (Fabric & Trims): [Ví dụ: Vải Cotton 100% 250gsm, khóa kéo YKK, đường may đôi...]
- Mô tả các góc nhìn (Multi-angle Details):
  + Mặt trước (Front View): [Chi tiết cổ áo, túi, cúc, hoa văn, tỉ lệ...]
  + Mặt sau (Back View): [Chi tiết lưng áo, đường chiết eo, logo...]
  + Góc nghiêng / Chi tiết đặc biệt (Side/Detail View): [Cầu vai, đường xẻ tà, tay áo...]

## 3. PROMPT TẠO HÌNH ẢNH (IMAGE GENERATION PROMPT)
- Dành cho Midjourney / DALL-E / Imagen: [Cung cấp 1 đoạn prompt tiếng Anh chi tiết để người dùng có thể copy dán vào AI tạo ảnh nếu cần]

## 4. ĐỀ XUẤT TỪ TRỢ LÝ THỜI TRANG (AI STYLIST RECOMMENDATIONS)
- Biến thể phong cách (Alternative Versions): [Đề xuất 2 cách biến tấu mẫu thiết kế này theo trend mới]
- Gợi ý phối đồ (Styling Tips): [Phối cùng phụ kiện, giày, quần/váy gì để hoàn thiện outfit]

Đồng thời trả về JSON có cấu trúc để hiển thị giao diện tương tác (bảng màu trực quan, bảng size chart tương tác, phân loại chi tiết kỹ thuật cho thợ may).
`;

// In-memory User Database with pre-configured admin123 account
interface UserAccount {
  id: string;
  username: string;
  passwordHash: string; // Plain/stored for simple authentication
  displayName: string;
  role: 'ADMIN' | 'MASTER_TAILOR' | 'STUDIO_DIRECTOR' | 'DESIGNER';
  email: string;
  createdAt: string;
  atelierTitle: string;
}

const USERS: UserAccount[] = [
  {
    id: 'usr_admin123',
    username: 'admin123',
    passwordHash: '123456789',
    displayName: 'Senior Fashion AI Designer & Master Tailor',
    role: 'ADMIN',
    email: 'admin123@atelier.fashion.ai',
    createdAt: new Date().toISOString(),
    atelierTitle: 'Giám Đốc Kỹ Thuật May & Trưởng Xưởng Rập (Master Tailor)',
  },
];

// Authentication API endpoints
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Vui lòng nhập tên đăng nhập và mật khẩu.' });
    }

    const cleanUsername = String(username).trim().toLowerCase();
    const user = USERS.find(u => u.username.toLowerCase() === cleanUsername);

    if (!user || user.passwordHash !== String(password)) {
      return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không chính xác.' });
    }

    const token = `token_${user.id}_${Date.now()}`;
    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
        email: user.email,
        atelierTitle: user.atelierTitle,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Lỗi đăng nhập: ' + error.message });
  }
});

app.post('/api/auth/register', (req, res) => {
  try {
    const { username, password, displayName } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ tên đăng nhập và mật khẩu.' });
    }

    const cleanUsername = String(username).trim().toLowerCase();
    if (USERS.some(u => u.username.toLowerCase() === cleanUsername)) {
      return res.status(409).json({ error: 'Tài khoản này đã tồn tại trên hệ thống.' });
    }

    const newUser: UserAccount = {
      id: `usr_${Date.now()}`,
      username: cleanUsername,
      passwordHash: String(password),
      displayName: displayName || cleanUsername,
      role: 'DESIGNER',
      email: `${cleanUsername}@atelier.fashion.ai`,
      createdAt: new Date().toISOString(),
      atelierTitle: 'Nhà Thiết Kế Thời Trang Cấp Cao',
    };

    USERS.push(newUser);

    const token = `token_${newUser.id}_${Date.now()}`;
    return res.json({
      success: true,
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        displayName: newUser.displayName,
        role: newUser.role,
        email: newUser.email,
        atelierTitle: newUser.atelierTitle,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Lỗi đăng ký: ' + error.message });
  }
});

// API endpoint to create fashion design & tech pack
app.post('/api/generate-design', async (req, res) => {
  try {
    const {
      prompt,
      category = 'Tùy chọn',
      style = 'Haute Couture / High Fashion',
      gender = 'Unisex',
      targetAudience = 'Tất cả',
      fabricPreference = '',
      additionalNotes = '',
      imageBase64,
      imageMimeType = 'image/jpeg',
    } = req.body;

    if (!prompt && !imageBase64) {
      return res.status(400).json({ error: 'Vui lòng cung cấp ý tưởng hoặc hình ảnh thiết kế.' });
    }

    const userInstructions = `
YÊU CẦU THIẾT KẾ:
- Ý tưởng cốt lõi: ${prompt || 'Thiết kế dựa trên hình ảnh được tải lên'}
- Phân loại trang phục: ${category}
- Phong cách mong muốn: ${style}
- Đối tượng / Giới tính: ${gender} - ${targetAudience}
- Ưu tiên chất liệu: ${fabricPreference || 'Đề xuất chất liệu tối ưu nhất theo xu hướng quốc tế'}
- Yêu cầu đặc biệt cho thợ may: ${additionalNotes || 'Không có'}

Hãy đóng vai trò Senior Fashion AI Designer & Master Tailor để phân tích và xuất ra:
1. Toàn bộ nội dung Markdown hoàn chỉnh theo đúng 4 phần chuẩn mực.
2. Dữ liệu có cấu trúc (structured JSON) chuẩn xác cho xưởng may và nhà thiết kế.
`;

    const parts: any[] = [];
    if (imageBase64) {
      parts.push({
        inlineData: {
          data: imageBase64.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, ''),
          mimeType: imageMimeType,
        },
      });
    }
    parts.push({ text: userInstructions });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        systemInstruction: FASHION_SYSTEM_PROMPT,
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fullMarkdown: {
              type: Type.STRING,
              description: 'Văn bản Markdown hoàn chỉnh gồm 4 phần theo đúng mẫu chuẩn của Senior Fashion AI Designer & Master Tailor',
            },
            designOverview: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                style: { type: Type.STRING },
                category: { type: Type.STRING },
                targetGender: { type: Type.STRING },
                inspirationAndTrend: { type: Type.STRING },
                silhouette: { type: Type.STRING },
                season: { type: Type.STRING },
                keyAesthetics: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['name', 'style', 'inspirationAndTrend', 'silhouette'],
            },
            techPack: {
              type: Type.OBJECT,
              properties: {
                fitSummary: { type: Type.STRING },
                garmentCategoryKey: {
                  type: Type.STRING,
                  description: 'Một trong các mã: blazer, jacket, coat, hoodie, shirt, dress, pants, tshirt, vest, skirt, ao_dai',
                },
                sizeChart: {
                  type: Type.ARRAY,
                  description: 'Bảng thông số chi tiết chuẩn xưởng may tính bằng cm cho các vị trí đo',
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      pointOfMeasure: { type: Type.STRING, description: 'Vị trí đo, ví dụ: Dài áo (Body Length), Rộng vai (Shoulder Width), Vòng ngực (Chest Width)...' },
                      s: { type: Type.STRING, description: 'Thông số size S (cm)' },
                      m: { type: Type.STRING, description: 'Thông số size M (cm)' },
                      l: { type: Type.STRING, description: 'Thông số size L (cm)' },
                      xl: { type: Type.STRING, description: 'Thông số size XL (cm)' },
                      xxl: { type: Type.STRING, description: 'Thông số size XXL (cm)' },
                      tolerance: { type: Type.STRING, description: 'Dung sai cho phép, vd: ±0.5cm hoặc ±1.0cm' },
                    },
                    required: ['pointOfMeasure', 's', 'm', 'l', 'xl', 'tolerance'],
                  },
                },
                colorPalette: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING, description: 'Tên màu sắc (tiếng Việt & tiếng Anh)' },
                      hex: { type: Type.STRING, description: 'Mã màu Hex, ví dụ: #1F2937' },
                      pantoneCode: { type: Type.STRING, description: 'Mã màu Pantone TCX nếu có' },
                      usageRole: { type: Type.STRING, description: 'Vai trò: Vải chính / Vải phối / Lót / Đường chỉ...' },
                    },
                    required: ['name', 'hex', 'usageRole'],
                  },
                },
                fabricsAndTrims: {
                  type: Type.OBJECT,
                  properties: {
                    mainFabric: { type: Type.STRING, description: 'Vải chính chi tiết kèm định lượng GSM, nguồn gốc' },
                    liningFabric: { type: Type.STRING, description: 'Vải lót trong hoặc mùng mex ép keo' },
                    trimsAndHardware: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: 'Phụ liệu: Cúc khuy, khóa kéo YKK, chỉ may Coats, dây dệt, nhãn dệt...'
                    },
                    sewingSpecifications: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: 'Đặc tính may: Loại đường may (chỉ đôi, vắt sổ 4 chỉ, diễu mí 1mm, chần bông...)'
                    },
                    seamAllowance: { type: Type.STRING, description: 'Quy cách đường chừa may (vd: Gấu 3cm, thân 1cm, cổ 0.7cm)' },
                  },
                  required: ['mainFabric', 'trimsAndHardware', 'sewingSpecifications'],
                },
                multiAngleDetails: {
                  type: Type.OBJECT,
                  properties: {
                    frontView: { type: Type.STRING, description: 'Mô tả chi tiết mặt trước' },
                    backView: { type: Type.STRING, description: 'Mô tả chi tiết mặt sau' },
                    sideAndDetailView: { type: Type.STRING, description: 'Mô tả chi tiết góc nghiêng và chi tiết may đặc biệt' },
                  },
                  required: ['frontView', 'backView', 'sideAndDetailView'],
                },
              },
              required: ['fitSummary', 'garmentCategoryKey', 'sizeChart', 'colorPalette', 'fabricsAndTrims', 'multiAngleDetails'],
            },
            imagePrompt: {
              type: Type.OBJECT,
              properties: {
                promptText: { type: Type.STRING, description: 'Đoạn prompt tiếng Anh chi tiết cho Midjourney / DALL-E / Imagen' },
                aspectRatio: { type: Type.STRING, description: 'Tỉ lệ khung hình gợi ý, ví dụ: --ar 3:4 hoặc 9:16' },
                lightingAndAtmosphere: { type: Type.STRING, description: 'Mô tả ánh sáng studio / sàn diễn runway' },
                negativePrompt: { type: Type.STRING, description: 'Những yếu tố cần tránh' },
              },
              required: ['promptText'],
            },
            stylistRecommendations: {
              type: Type.OBJECT,
              properties: {
                alternativeVersions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING, description: 'Tên biến thể' },
                      concept: { type: Type.STRING, description: 'Ý tưởng biến tấu theo xu hướng mới' },
                      modifications: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: 'Các điểm thay đổi chính về chất liệu hoặc phom dáng'
                      },
                    },
                    required: ['name', 'concept', 'modifications'],
                  },
                },
                stylingTips: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      category: { type: Type.STRING, description: 'Phụ kiện, Giày, Quần/Váy hoặc Lớp áo layering' },
                      recommendation: { type: Type.STRING, description: 'Gợi ý phối hợp cụ thể' },
                    },
                    required: ['category', 'recommendation'],
                  },
                },
              },
              required: ['alternativeVersions', 'stylingTips'],
            },
          },
          required: ['fullMarkdown', 'designOverview', 'techPack', 'imagePrompt', 'stylistRecommendations'],
        },
      },
    });

    const text = response.text || '';
    const parsedData = JSON.parse(text);
    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error generating fashion design:', error);
    return res.status(500).json({
      error: 'Không thể tạo bản thiết kế thời trang lúc này.',
      details: error?.message || String(error),
    });
  }
});

// API endpoint for interactive tailoring adjustments (chỉnh sửa phom dáng, đổi vải, hạ nách...)
app.post('/api/refine-design', async (req, res) => {
  try {
    const { currentDesign, userModification } = req.body;

    if (!currentDesign || !userModification) {
      return res.status(400).json({ error: 'Thiếu dữ liệu thiết kế hiện tại hoặc yêu cầu chỉnh sửa.' });
    }

    const prompt = `
Dưới đây là bản thiết kế và thông số kỹ thuật hiện tại:
${JSON.stringify(currentDesign, null, 2)}

YÊU CẦU ĐIỀU CHỈNH TỪ KHÁCH HÀNG / THỢ MAY:
"${userModification}"

Nhiệm vụ của Master Tailor & Senior Designer:
1. Cập nhật lại bản vẽ kỹ thuật, thông số size chart, chất liệu và các góc nhìn để đáp ứng chính xác yêu cầu mới.
2. Đảm bảo cấu trúc Markdown 4 phần chuẩn mực và schema JSON tương ứng.
3. Giải thích ngắn gọn cách xử lý rập (pattern manipulation) và kỹ thuật may mới được áp dụng.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: FASHION_SYSTEM_PROMPT,
        temperature: 0.6,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    const parsedData = JSON.parse(text);
    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error refining fashion design:', error);
    return res.status(500).json({
      error: 'Không thể cập nhật bản thiết kế kỹ thuật.',
      details: error?.message || String(error),
    });
  }
});

// API endpoint for visual illustration generation (using gemini-3.1-flash-lite-image)
app.post('/api/generate-visual', async (req, res) => {
  try {
    const { prompt, aspectRatio = '3:4' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt hình ảnh không được trống.' });
    }

    const enhancedPrompt = `High-end fashion editorial lookbook, atelier technical fashion sketch and realistic runway presentation: ${prompt}. Professional fashion design photography, haute couture studio lighting, pristine fabric texture detail, 8k resolution, minimalist architectural background.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [{ text: enhancedPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        return res.json({ success: true, imageUrl });
      }
    }

    return res.status(500).json({ error: 'Không thể tạo hình ảnh từ AI.' });
  } catch (error: any) {
    console.error('Error in visual generation:', error);
    return res.status(500).json({
      error: 'Tạo hình ảnh không thành công.',
      details: error?.message || String(error),
    });
  }
});

// Static assets / Vite Dev integration
if (!isProd) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.resolve(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Senior Fashion AI Designer & Master Tailor server running on port ${PORT}`);
});
