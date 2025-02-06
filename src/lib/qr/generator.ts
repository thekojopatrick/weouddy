import { QRCodeOptions, QRCodeResult } from "./types";

import QRCode from "qrcode";

export async function generateQRCode(
  data: string,
  options: QRCodeOptions = {},
): Promise<QRCodeResult> {
  const {
    size = 1024,
    margin = 4,
    color = {
      dark: "#000000",
      light: "#ffffff",
    },
  } = options;

  // Generate QR code as data URL
  const dataUrl = await QRCode.toDataURL(data, {
    width: size,
    margin,
    color,
    errorCorrectionLevel: "H",
  });

  // Create downloadable URL
  const downloadUrl = dataUrl.replace(
    "data:image/png;base64,",
    "data:image/png;charset=utf-8;base64,",
  );

  // Generate unique filename
  const fileName = `qr-code-${new Date().getTime()}.png`;

  return {
    dataUrl,
    downloadUrl,
    fileName,
  };
}
