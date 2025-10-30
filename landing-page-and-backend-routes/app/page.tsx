"use client"

import { Canvas } from "@react-three/fiber";
import { useState, useRef } from "react";
import GrainyGradient from "@/components/GrainyGradient";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";

interface Ripple {
  id: number;
  x: number;
  y: number;
  startTime: number;
}

export default function App() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const rippleIdRef = useRef(0);

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple: Ripple = {
      id: rippleIdRef.current++,
      x,
      y,
      startTime: currentTime,
    };

    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 2000);
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      {/* Full-screen shader background */}
      <div
        ref={containerRef}
        className="fixed inset-0 w-full h-full cursor-pointer"
        onClick={handleClick}
      >
        <Canvas
          camera={{ position: [0, 0, 1] }}
          gl={{ preserveDrawingBuffer: true }}
          style={{ width: '100%', height: '100%' }}
        >
          <GrainyGradient ripples={ripples} onTimeUpdate={handleTimeUpdate} />
        </Canvas>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <Navigation />
        </div>
        <div className="pointer-events-auto">
          <Hero />
        </div>
        <div className="pointer-events-auto">
          <HowItWorks />
        </div>
        <div className="pointer-events-auto">
          <Features />
        </div>
      </div>
    </div>
  );
}