import { performance as performanceConfig } from '../config/performanceSettings';

/**
 * Service to handle various performance optimizations throughout the application
 */
class PerformanceService {
  private scrollTicking = false;
  private resizeTicking = false;
  private idleCallbacks: {id: number, priority: number}[] = [];
  private memoryWarningIssued = false;
  private fpsMonitor: { lastFrameTime: number, frameCount: number, fps: number } = { 
    lastFrameTime: 0, 
    frameCount: 0, 
    fps: 60 
  };
  
  // Initialize performance monitoring and optimizations
  init() {
    if (typeof window === 'undefined') return;
    
    // Optimize scroll event handling
    this.optimizeScrollHandling();
    
    // Optimize resize event handling
    this.optimizeResizeHandling();
    
    // Monitor FPS when needed
    if (performanceConfig.enablePerformanceMarkers) {
      this.startMonitoringFPS();
    }
    
    // Check browser memory usage periodically
    if (performanceConfig.enableMemoryMonitoring) {
      this.monitorMemoryUsage();
    }
    
    // Register to browser performance events
    this.registerPerformanceObserver();
    
    console.log('Performance service initialized with config:', 
      performanceConfig.device.animations.reduceMotion ? 'reduced animations' : 'full animations');
  }
  
  // Throttle scroll events to prevent excessive function calls
  optimizeScrollHandling() {
    window.addEventListener('scroll', () => {
      if (!this.scrollTicking) {
        window.requestAnimationFrame(() => {
          // Trigger a custom event that components can listen to
          window.dispatchEvent(new CustomEvent('optimized-scroll'));
          this.scrollTicking = false;
        });
        this.scrollTicking = true;
      }
    }, { passive: true });
  }
  
  // Similar throttling for resize events
  optimizeResizeHandling() {
    window.addEventListener('resize', () => {
      if (!this.resizeTicking) {
        window.requestAnimationFrame(() => {
          window.dispatchEvent(new CustomEvent('optimized-resize'));
          this.resizeTicking = false;
        });
        this.resizeTicking = true;
      }
    });
  }
  
  // Schedule non-critical work during idle time
  scheduleIdleWork(callback: () => void, priority: number = 0): number {
    if (!('requestIdleCallback' in window)) {
      // Fallback for browsers without requestIdleCallback
      const timeoutId = setTimeout(callback, 1);
      return timeoutId as unknown as number;
    }
    
    const id = window.requestIdleCallback((deadline) => {
      if (deadline.timeRemaining() > 0 || deadline.didTimeout) {
        callback();
      } else {
        // Reschedule if we ran out of time
        this.scheduleIdleWork(callback, priority);
      }
    }, { timeout: priority > 1 ? 2000 : 1000 });
    
    this.idleCallbacks.push({ id, priority });
    return id;
  }
  
  // Cancel scheduled idle work
  cancelIdleWork(id: number) {
    if ('cancelIdleCallback' in window) {
      window.cancelIdleCallback(id);
    } else {
      clearTimeout(id);
    }
    
    this.idleCallbacks = this.idleCallbacks.filter(item => item.id !== id);
  }
  
  // Monitor FPS to detect performance issues
  startMonitoringFPS() {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const checkFPS = () => {
      const currentTime = performance.now();
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        this.fpsMonitor.fps = Math.round(frameCount * 1000 / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;
        
        // Take action if FPS is consistently low
        if (this.fpsMonitor.fps < 30) {
          this.handleLowFPS();
        }
      }
      
      requestAnimationFrame(checkFPS);
    };
    
    requestAnimationFrame(checkFPS);
  }
  
  // React to sustained low FPS
  handleLowFPS() {
    // Reduce visual complexity when FPS is low
    document.body.classList.add('low-fps-mode');
    
    // Notify the performance context to reduce animations
    window.dispatchEvent(new CustomEvent('reduce-visual-complexity'));
  }
  
  // Monitor memory usage if available
  monitorMemoryUsage() {
    if (!(performance as any).memory) return;
    
    const checkMemory = () => {
      const memory = (performance as any).memory;
      
      if (memory && memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.7 && !this.memoryWarningIssued) {
        console.warn('High memory usage detected - optimizing...');
        this.memoryWarningIssued = true;
        
        // Take steps to reduce memory usage
        window.dispatchEvent(new CustomEvent('reduce-memory-usage'));
        
        // Clear image caches or other large objects
        if ('caches' in window) {
          window.caches.delete('image-cache').catch(() => {});
        }
      }
    };
    
    // Check periodically
    setInterval(checkMemory, 10000);
  }
  
  // Watch for long tasks that might cause jank
  registerPerformanceObserver() {
    if (!('PerformanceObserver' in window)) return;
    
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) {
            console.warn(`Long task detected: ${Math.round(entry.duration)}ms`);
            // Report long task to analytics or take action
          }
        });
      });
      
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      console.log('PerformanceObserver not supported for longtask');
    }
  }
  
  // Get current FPS
  getCurrentFPS(): number {
    return this.fpsMonitor.fps;
  }
  
  // Check if the browser tab is currently visible
  isPageVisible(): boolean {
    return document.visibilityState === 'visible';
  }
  
  // Detect if animations should be reduced (either by user preference or for performance)
  shouldReduceAnimations(): boolean {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return prefersReducedMotion || performanceConfig.device.animations.reduceMotion;
  }
}

// Export as singleton
export default new PerformanceService();
