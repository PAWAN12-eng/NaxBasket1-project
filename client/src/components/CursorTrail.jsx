// src/components/CursorTrail.jsx
import React, { useEffect, useRef } from 'react';

const CursorTrail = () => {
    const trailRef = useRef([]);
    const positions = useRef([]);
  
    useEffect(() => {
      const numDots = 12;
      const dots = Array.from({ length: numDots }, () => document.createElement('div'));
  
      dots.forEach((dot, index) => {
        dot.className = 'enhanced-cursor-dot';
        dot.style.transition = `transform ${0.15 + index * 0.02}s ease-out, opacity 0.3s`;
        dot.style.opacity = `${1 - index * 0.07}`;
        document.body.appendChild(dot);
        trailRef.current.push(dot);
        positions.current.push({ x: 0, y: 0 });
      });
  
      const handleMouseMove = (e) => {
        positions.current.unshift({ x: e.clientX, y: e.clientY });
        positions.current = positions.current.slice(0, numDots);
  
        trailRef.current.forEach((dot, index) => {
          const { x, y } = positions.current[index] || positions.current[0];
          dot.style.transform = `translate(${x}px, ${y}px) scale(${1 - index * 0.05})`;
        });
      };
  
      window.addEventListener('mousemove', handleMouseMove);
  
      return () => {
        trailRef.current.forEach(dot => dot.remove());
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }, []);
  
    return null;
  };

export default CursorTrail;
