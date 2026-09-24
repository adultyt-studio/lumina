import React, { useState } from 'react';

interface WebPImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
}

export const WebPImage: React.FC<WebPImageProps> = ({
  src,
  alt,
  className = '',
  width = '100%',
  height = 'auto',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{ width, height }}
    >
      {/* Blurred Low-Resolution Loading Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse backdrop-blur-md flex items-center justify-center">
          <span className="text-xs text-slate-400 font-medium">Loading WebP...</span>
        </div>
      )}
      <picture>
        <source srcSet={src} type="image/webp" />
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </picture>
    </div>
  );
};
