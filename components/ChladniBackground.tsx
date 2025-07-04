'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  settled: boolean;
  age: number;
}

interface ChladniBackgroundProps {
  patternIndex: number;
  className?: string;
}

export function ChladniBackground({ patternIndex, className = '' }: ChladniBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Enhanced Chladni pattern functions based on real vibrational modes
  const chladniPatterns = [
    // Pattern 1: Fundamental mode - single vertical line
    (x: number, y: number, t: number) => {
      const nx = 1, ny = 0;
      return Math.cos(nx * Math.PI * x) * Math.cos(ny * Math.PI * y) * Math.cos(t * 0.005);
    },
    // Pattern 2: Cross pattern (1,1 mode)
    (x: number, y: number, t: number) => {
      const nx = 1, ny = 1;
      return Math.cos(nx * Math.PI * x) * Math.cos(ny * Math.PI * y) * Math.cos(t * 0.007);
    },
    // Pattern 3: Star pattern (2,1 mode)
    (x: number, y: number, t: number) => {
      const nx = 2, ny = 1;
      return Math.cos(nx * Math.PI * x) * Math.cos(ny * Math.PI * y) * Math.cos(t * 0.006);
    },
    // Pattern 4: Circular mode with radial lines
    (x: number, y: number, t: number) => {
      const centerX = 0.5, centerY = 0.5;
      const r = Math.sqrt((x - centerX) * (x - centerX) + (y - centerY) * (y - centerY));
      const theta = Math.atan2(y - centerY, x - centerX);
      const radialMode = Math.cos(6 * theta); // 6-fold symmetry
      const circularMode = Math.sin(4 * Math.PI * r); // Radial waves
      return radialMode * circularMode * Math.cos(t * 0.008);
    },
    // Pattern 5: Complex rectangular mode (2,2)
    (x: number, y: number, t: number) => {
      const nx = 2, ny = 2;
      return Math.cos(nx * Math.PI * x) * Math.cos(ny * Math.PI * y) * Math.cos(t * 0.009);
    }
  ];

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize particles with mobile optimization
    const isMobile = dimensions.width < 768;
    const baseDensity = isMobile ? 500 : 300; // Reduce density on mobile for performance
    const maxParticles = isMobile ? 1500 : 3000; // Reduce max particles on mobile
    const particleCount = Math.min(maxParticles, Math.floor(dimensions.width * dimensions.height / baseDensity));
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: 0,
      vy: 0,
      settled: false,
      age: 0
    }));

    let time = 0;
    const pattern = chladniPatterns[patternIndex % chladniPatterns.length];

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      // Very subtle background
      ctx.fillStyle = 'rgba(248, 248, 248, 0.5)';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Calculate gradient field for particle movement
      const gridSize = 20;
      const gradientField: { dx: number; dy: number; intensity: number }[][] = [];
      
      for (let i = 0; i <= gridSize; i++) {
        gradientField[i] = [];
        for (let j = 0; j <= gridSize; j++) {
          const x = i / gridSize;
          const y = j / gridSize;
          const intensity = pattern(x, y, time);
          
          // Calculate gradient (direction of steepest increase)
          const dx = 0.01;
          const dy = 0.01;
          const intensityX = pattern(x + dx, y, time);
          const intensityY = pattern(x, y + dy, time);
          
          gradientField[i][j] = {
            dx: (intensityX - intensity) / dx,
            dy: (intensityY - intensity) / dy,
            intensity: intensity
          };
        }
      }

      // Update particles - they move towards nodes (low intensity areas)
      particlesRef.current.forEach(particle => {
        // Sample gradient field at particle position
        const gx = Math.floor(particle.x * gridSize);
        const gy = Math.floor(particle.y * gridSize);
        
        if (gx >= 0 && gx < gridSize && gy >= 0 && gy < gridSize) {
          const field = gradientField[gx][gy];
          const intensity = Math.abs(field.intensity);
          
          // Particles are repelled by high intensity (antinodes) and attracted to low intensity (nodes)
          const repulsionForce = intensity * 0.001;
          const attractionToNodes = (1 - intensity) * 0.0005;
          
          // Move away from high intensity areas
          particle.vx -= field.dx * repulsionForce;
          particle.vy -= field.dy * repulsionForce;
          
          // Add random motion to simulate vibration
          particle.vx += (Math.random() - 0.5) * 0.0002;
          particle.vy += (Math.random() - 0.5) * 0.0002;
          
          // Settle particles near nodes
          if (intensity < 0.3) {
            particle.vx *= 0.8; // Strong damping near nodes
            particle.vy *= 0.8;
            particle.settled = true;
          } else {
            particle.vx *= 0.95; // Light damping elsewhere
            particle.vy *= 0.95;
            particle.settled = false;
          }
        }
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.age++;

        // Boundary conditions with reflection
        if (particle.x < 0) {
          particle.x = 0;
          particle.vx = Math.abs(particle.vx) * 0.5;
        }
        if (particle.x > 1) {
          particle.x = 1;
          particle.vx = -Math.abs(particle.vx) * 0.5;
        }
        if (particle.y < 0) {
          particle.y = 0;
          particle.vy = Math.abs(particle.vy) * 0.5;
        }
        if (particle.y > 1) {
          particle.y = 1;
          particle.vy = -Math.abs(particle.vy) * 0.5;
        }

        // Draw particle
        const screenX = particle.x * dimensions.width;
        const screenY = particle.y * dimensions.height;
        
        // Sample intensity at current position for rendering
        const currentIntensity = Math.abs(pattern(particle.x, particle.y, time));
        
        // Particles are more visible when settled near nodes
        let alpha = particle.settled ? 0.8 : 0.3;
        let size = particle.settled ? 1.5 : 0.8;
        
        // Fade based on intensity (more visible at nodes)
        alpha *= Math.max(0.1, 1 - currentIntensity);
        
        // Age-based opacity for realistic settling
        if (particle.age < 60) {
          alpha *= particle.age / 60;
        }

        ctx.beginPath();
        ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(60, 60, 60, ${alpha})`;
        ctx.fill();
      });

      // Draw faint field lines to enhance pattern visibility
      ctx.strokeStyle = 'rgba(100, 100, 100, 0.1)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const x = i / gridSize;
          const y = j / gridSize;
          const intensity = Math.abs(pattern(x, y, time));
          
          if (intensity < 0.2) { // Draw lines near nodes
            const screenX = x * dimensions.width;
            const screenY = y * dimensions.height;
            
            ctx.beginPath();
            ctx.arc(screenX, screenY, 1, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }

      time += 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, patternIndex]);

  return (
    <motion.div
      className={`fixed inset-0 pointer-events-none ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      key={patternIndex} // Force re-render on pattern change
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
        style={{ 
          filter: 'contrast(1.2)', 
          opacity: 0.6 
        }}
      />
    </motion.div>
  );
}