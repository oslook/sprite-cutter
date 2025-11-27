
export type Language = 'en' | 'zh';

export type OutputFormat = 'png' | 'jpg';

export interface SliceConfig {
  rows: number;
  cols: number;
  format: OutputFormat;
  trimX: number;
  trimY: number;
}

export interface SlicedImage {
  id: number;
  url: string;
  blob: Blob;
  fileName: string;
}

export interface Translations {
  title: string;
  subtitle: string;
  uploadTitle: string;
  uploadDesc: string;
  settings: string;
  rows: string;
  cols: string;
  format: string;
  trimSettings: string;
  trimX: string;
  trimY: string;
  slicePreview: string;
  downloadAll: string;
  reset: string;
  processing: string;
  noImage: string;
  generated: string;
  width: string;
  height: string;
  originalSize: string;
  sliceSize: string;
  heroTitle: string;
  heroSubtitle: string;
  howToUse: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  gotIt: string;
  customGrid: string;
  customGridDesc: string;
  smartTrimming: string;
  smartTrimmingDesc: string;
  instantZip: string;
  instantZipDesc: string;
}
