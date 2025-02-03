'use client';

import React, { useEffect, useRef, useState } from 'react';

interface PlaceholderImageProps {
  name: string;
  width?: number;
  height?: number;
  backgroundColor?: string;
  textColor?: string;
}

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  name,
  width = 100,
  height = 100,
  backgroundColor = '#cccccc',
  textColor = '#ffffff',
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

        // Draw text
        ctx.fillStyle = textColor;
        ctx.font = `${Math.min(width, height) / 3}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Get initials
        const initials = name
          .split(' ')
          .map((part) => part[0])
          .join('')
          .toUpperCase();

        // Draw initials
        ctx.fillText(initials, width / 2, height / 2);

        // Convert canvas to data URL
        setImageUrl(canvas.toDataURL());
      }
    }
  }, [name, width, height, backgroundColor, textColor]);

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
