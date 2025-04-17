import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loadingColor?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  loadingColor = '#4f46e5'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  
  // Only load the image when it's in view
  useEffect(() => {
    if (inView && !imageSrc) {
      // Create low quality placeholder first
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
      img.onerror = () => {
        setError(true);
      };
    }
  }, [inView, src, imageSrc]);
  
  return (
    <div 
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {!isLoaded && !error && (
        <div 
          className="absolute inset-0 bg-gray-800 animate-pulse" 
          style={{ backgroundColor: loadingColor + '20' }} 
        />
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <span className="text-red-500">Failed to load image</span>
        </div>
      )}
      
      {imageSrc && (
        <motion.img
          src={imageSrc}
          alt={alt}
          className={`w-full h-full object-cover ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
};

export default React.memo(OptimizedImage);
