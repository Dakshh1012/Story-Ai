"use client"
import { Book, Menu, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Load fonts
    const playfairFont = document.createElement('link');
    playfairFont.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap';
    playfairFont.rel = 'stylesheet';
    document.head.appendChild(playfairFont);
    
    const interFont = document.createElement('link');
    interFont.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap';
    interFont.rel = 'stylesheet';
    document.head.appendChild(interFont);
    
    return () => {
      document.head.removeChild(playfairFont);
      document.head.removeChild(interFont);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header>
      <nav 
        className={`fixed top-0 w-full z-20 transition-all duration-500 ${
          scrolled 
            ? 'py-4 bg-slate-900/70 backdrop-blur-lg shadow-lg' 
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
                <Book className="w-5 h-5 text-white" />
              </div>
              <div 
                className="font-bold text-2xl sm:text-3xl bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                StoryAI
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#pricing">Pricing</NavLink>
              <NavLink href="#about">About</NavLink>
              <NavLink href="#contact">Contact</NavLink>
              
              <button className="ml-8 px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900" style={{ fontFamily: "'Inter', sans-serif" }}>
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={toggleMobileMenu}
                className="p-2 rounded-full text-slate-200 hover:bg-slate-800 transition-colors duration-300 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden absolute top-full left-0 w-full bg-slate-900/95 backdrop-blur-lg shadow-lg transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
          } overflow-hidden`}
        >
          <div className="px-4 pt-2 pb-6 space-y-2">
            <MobileNavLink href="#features" onClick={toggleMobileMenu}>Features</MobileNavLink>
            <MobileNavLink href="#pricing" onClick={toggleMobileMenu}>Pricing</MobileNavLink>
            <MobileNavLink href="#about" onClick={toggleMobileMenu}>About</MobileNavLink>
            <MobileNavLink href="#contact" onClick={toggleMobileMenu}>Contact</MobileNavLink>
            
            <div className="pt-4">
              <button className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 focus:outline-none" style={{ fontFamily: "'Inter', sans-serif" }}>
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

// Desktop nav link component
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a 
      href={href} 
      className="px-4 py-2 mx-1 text-sm font-medium text-slate-300 hover:text-white rounded-md relative group transition-colors duration-300"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
    </a>
  );
}

// Mobile nav link component
function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <a 
      href={href} 
      onClick={onClick}
      className="block px-4 py-3 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors duration-200"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {children}
    </a>
  );
}