export interface QRCodeOptions {
	size?: number;
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
