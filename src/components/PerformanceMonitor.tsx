import React, { useState, useEffect } from 'react';

interface PerformanceMetrics {
  fps: number;
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
  };
  load: number;
}

const PerformanceMonitor: React.FC<{ visible?: boolean }> = ({ visible = true }) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    load: 0
  });
  
  useEffect(() => {
    if (!visible) return;
    
    let frameCount = 0;
    let lastTime = performance.now();
    let frameTimes: number[] = [];
    const maxFrameTimes = 30; // Track last 30 frames
    
    const calculateMetrics = (timestamp: number) => {
      // Calculate FPS
      const elapsed = timestamp - lastTime;
      frameTimes.push(elapsed);
      if (frameTimes.length > maxFrameTimes) {
        frameTimes.shift();
      }
      
      const averageFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
      const fps = Math.round(1000 / averageFrameTime);
      
      // Calculate CPU load (approximation)
      const frameDelay = elapsed - 16.67; // Assuming 60fps as ideal
      const load = Math.min(100, Math.max(0, Math.round(frameDelay / 16.67 * 100)));
      
      // Update metrics every 10 frames
      frameCount++;
      if (frameCount >= 10) {
        frameCount = 0;
        
        const metrics: PerformanceMetrics = { fps, load };
        
        // Add memory info if available
        if (performance && (performance as any).memory) {
          metrics.memory = {
            usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
            totalJSHeapSize: (performance as any).memory.totalJSHeapSize
          };
        }
        
        setMetrics(metrics);
      }
      
      lastTime = timestamp;
      requestAnimationFrame(calculateMetrics);
    };
    
    const frameId = requestAnimationFrame(calculateMetrics);
    
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [visible]);
  
  if (!visible) return null;
  
  const getStatusColor = (value: number, type: 'fps' | 'memory' | 'load') => {
    if (type === 'fps') {
      if (value >= 55) return 'text-green-500';
      if (value >= 40) return 'text-yellow-500';
      return 'text-red-500';
    } else if (type === 'load') {
      if (value <= 20) return 'text-green-500';
      if (value <= 50) return 'text-yellow-500';
      return 'text-red-500';
    }
    return '';
  };
  
  return (
    <div className="fixed bottom-4 left-4 z-50 bg-black bg-opacity-70 p-2 rounded-lg text-xs font-mono">
      <div className={getStatusColor(metrics.fps, 'fps')}>
        FPS: {metrics.fps}
      </div>
      <div className={getStatusColor(metrics.load, 'load')}>
        LOAD: {metrics.load}%
      </div>
      {metrics.memory && (
        <div className="text-gray-400">
          MEM: {Math.round(metrics.memory.usedJSHeapSize / 1048576)}MB / 
          {Math.round(metrics.memory.totalJSHeapSize / 1048576)}MB
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor;
