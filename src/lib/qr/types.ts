export interface QRCodeOptions {
  size?: number;
  quality?: number;
  margin?: number;
  color?: {
    dark: string;
    light: string;
  };
}

export interface QRCodeResult {
  dataUrl: string;
  downloadUrl: string;
  fileName: string;
}

export interface QRCodeType {
  dataUrl: string;
  downloadUrl: string;
  fileName: string;
  publicUrl: string;
}
