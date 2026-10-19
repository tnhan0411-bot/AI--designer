export interface SizeMeasurement {
  pointOfMeasure: string;
  s: string;
  m: string;
  l: string;
  xl: string;
  xxl?: string;
  tolerance: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
  pantoneCode?: string;
  usageRole: string;
}

export interface FabricsAndTrims {
  mainFabric: string;
  liningFabric?: string;
  trimsAndHardware: string[];
  sewingSpecifications: string[];
  seamAllowance?: string;
}

export interface MultiAngleDetails {
  frontView: string;
  backView: string;
  sideAndDetailView: string;
}

export interface DesignOverview {
  name: string;
  style: string;
  category?: string;
  targetGender?: string;
  inspirationAndTrend: string;
  silhouette: string;
  season?: string;
  keyAesthetics?: string[];
}

export interface TechPack {
  fitSummary: string;
  garmentCategoryKey: 'blazer' | 'jacket' | 'coat' | 'hoodie' | 'shirt' | 'dress' | 'pants' | 'tshirt' | 'vest' | 'skirt' | 'ao_dai' | string;
  sizeChart: SizeMeasurement[];
  colorPalette: ColorSwatch[];
  fabricsAndTrims: FabricsAndTrims;
  multiAngleDetails: MultiAngleDetails;
}

export interface ImagePromptData {
  promptText: string;
  aspectRatio?: string;
  lightingAndAtmosphere?: string;
  negativePrompt?: string;
}

export interface AlternativeVersion {
  name: string;
  concept: string;
  modifications: string[];
}

export interface StylingTip {
  category: string;
  recommendation: string;
}

export interface StylistRecommendations {
  alternativeVersions: AlternativeVersion[];
  stylingTips: StylingTip[];
}

export interface FashionDesign {
  id: string;
  createdAt: string;
  fullMarkdown: string;
  designOverview: DesignOverview;
  techPack: TechPack;
  imagePrompt: ImagePromptData;
  stylistRecommendations: StylistRecommendations;
  visualImageUrl?: string;
}

export interface FabricItem {
  id: string;
  name: string;
  vietnameseName: string;
  composition: string;
  gsm: number;
  drape: 'Rủ mềm' | 'Đứng phom vừa' | 'Cứng cáp' | 'Mềm mượt' | string;
  stretch: 'Không co giãn' | 'Co giãn nhẹ 2 chiều' | 'Co giãn 4 chiều' | string;
  needleSize: string;
  ironTemp: string;
  bestFor: string;
  tailorNotes: string;
  colorPreview: string;
}
