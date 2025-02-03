'use client';
import React, { useEffect, useRef, useState } from 'react';

interface PlaceholderImageProps {
  title: string;
  name: string;
  width?: number;
  height?: number;
  backgroundColor?: string;
  textColor?: string;
  logoUrl?: string;
  onImageGenerated?: (imageUrl: string) => void;
}

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  title,
  name,
  width = 100,
  height = 100,
  backgroundColor = '#cccccc',
  textColor = '#ffffff',
  logoUrl,
  onImageGenerated,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw background
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);

        // Get initials
        const initials = name.toUpperCase();

        const titleText = title.toUpperCase();

        // Text properties
        const baseFontSize = Math.min(width, height) / 18; // Base font size
        const spacing = 16; // Spacing between text elements
        const wordSpacing = '16';

        // Draw "Title" (3x size, bold)
        ctx.font = `bold ${baseFontSize * 2}px Inter`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = textColor;
        ctx.letterSpacing = wordSpacing;
        ctx.fillText(titleText, width / 2, height / 2 - spacing * 3);

        // Draw "x" (1x size, medium)
        ctx.font = `${baseFontSize}px Inter`;
        ctx.fillText('X', width / 2, height / 2 + spacing);

        // Draw initials (2x size, medium)
        ctx.font = `${baseFontSize * 1.5}px Inter`;
        ctx.fillText(initials, width / 2, height / 2 + spacing * 5);

        // Draw logo if provided
        if (logoUrl) {
          const logo = new Image();
          logo.src = logoUrl;
          logo.onload = () => {
            // Logo dimensions (adjust as needed)
            const logoWidth = 100; // Width of the logo
            const logoHeight = 32; // Height of the logo

            // Position the logo at the bottom right corner
            const logoX = width - logoWidth - 16; // 16px from the right
            const logoY = height - logoHeight - 20; // 20px from the bottom

            // Draw the logo
            ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);

            // Convert canvas to data URL
            const generatedImageUrl = canvas.toDataURL();
            setImageUrl(generatedImageUrl);

            // Call the callback if provided
            if (onImageGenerated) {
              onImageGenerated(generatedImageUrl);
            }
          };
        } else {
          // Convert canvas to data URL if no logo
          const generatedImageUrl = canvas.toDataURL();
          setImageUrl(generatedImageUrl);

          // Call the callback if provided
          if (onImageGenerated) {
            onImageGenerated(generatedImageUrl);
          }
        }
      }
    }
  }, [
    name,
    width,
    height,
    backgroundColor,
    textColor,
    logoUrl,
    onImageGenerated,
  ]);

  return (
    <div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {imageUrl && (
        <img src={imageUrl} alt={`Placeholder for ${name}`} />
      )}
    </div>
  );
};

export default PlaceholderImage;
