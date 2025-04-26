"use client"

import { useEffect, useState } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <div>
      <nav className={`fixed top-0 w-full z-20 p-6 flex justify-between items-center transition-all duration-300 ${
        scrolled 
        ? 'bg-slate-900/10 backdrop-blur-md' 
        : 'bg-slate-900'
      }`}>
        <div className="font-bold text-4xl text-blue-400" style={{ fontFamily: "'Playfair Display', serif" }}>
          StoryAI
        </div>
        <div className="flex space-x-8"> {/* Adjusted spacing between items */}
          <a href="#" className="text-white hover:text-blue-400 transition-colors">Features</a>
          <a href="#" className="text-white hover:text-blue-400 transition-colors">Pricing</a>
          <a href="#" className="text-white hover:text-blue-400 transition-colors">Contact</a>
        </div>
      </nav>
    </div>
  );
}
