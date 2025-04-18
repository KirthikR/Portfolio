/**
 * Central performance settings for the entire application
 * These settings can be adjusted based on device capabilities
 */

// Detect device performance capabilities
const detectDeviceCapability = (): 'low' | 'medium' | 'high' => {
  // Check for low-end devices based on memory
  if ((navigator as any).deviceMemory && (navigator as any).deviceMemory <= 2) return 'low';
  
  // Check processor cores if available
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) return 'low';
  
  // Use connection speed as another indicator
  const connection = (navigator as any).connection;
  if (connection) {
    if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
      return 'low';
    }
    if (connection.effectiveType === '3g') return 'medium';
  }
  
  // Check if it's a mobile device
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return 'medium';
  }
  
  return 'high';
};

// Settings that adapt to device capabilities
export const getDeviceOptimizedSettings = () => {
  const deviceCapability = typeof window !== 'undefined' ? detectDeviceCapability() : 'high';
  
  return {
    // Animation settings
    animations: {
      enabled: true, // Master switch for animations
      reduceMotion: deviceCapability === 'low', // Reduce motion on low-end devices
      parallaxEffects: deviceCapability !== 'low', // Disable parallax on low-end devices
      particleCount: deviceCapability === 'low' ? 3 : deviceCapability === 'medium' ? 8 : 12,
      staggerDelay: deviceCapability === 'low' ? 0.02 : 0.05, // Faster staggering on low-end
      transitionDuration: deviceCapability === 'low' ? 0.2 : 0.5, // Shorter animations on low-end
      enableGradients: deviceCapability !== 'low', // Simplified gradients on low-end
    },
    
    // Rendering optimizations
    rendering: {
      enableRasterization: true, // Force hardware acceleration where critical
      simplifyWhenScrolling: true, // Reduce effects during scrolling
      lazyLoadThreshold: 300, // Load content 300px before it enters viewport
      useSimplifiedLayout: deviceCapability === 'low',
      useImagePlaceholders: deviceCapability !== 'high',
      maxRenderBatchSize: deviceCapability === 'low' ? 3 : 10, // Process fewer items at once
    },
    
    // Visual quality settings
    visual: {
      enableBlur: deviceCapability !== 'low', // Disable blur effects on low-end devices
      enableShadows: deviceCapability !== 'low', // Simplified shadows on low-end
      maxParticles: deviceCapability === 'low' ? 5 : 20, // Fewer particles on low-end
      useSimpleGradients: deviceCapability === 'low',
      blurAmount: deviceCapability === 'low' ? 0 : 5,
    }
  };
};

export const performance = {
  // Global performance toggles
  enableMemoryMonitoring: true,
  enablePerformanceMarkers: true,
  enableDynamicOptimizations: true,
  cachingStrategy: 'session', // 'session', 'local', or 'none'
  
  // Component-specific optimization flags
  components: {
    heroSection: {
      enableParticles: true, 
      optimizeAnimations: true
    },
    skillsSection: {
      optimizeRendering: true,
      reduceAnimations: false
    },
    // Add more components as needed
  },
  
  // Get device-specific settings
  device: getDeviceOptimizedSettings()
};

export default performance;
