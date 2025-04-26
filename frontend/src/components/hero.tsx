"use client";

import { Book, GitBranch, Lightbulb, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
// Background animation component
const AnimatedBackground = () => {
  const [circles, setCircles] = useState([]);
  
  useEffect(() => {
    const linkPlayfair = document.createElement('link');
    linkPlayfair.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&display=swap';
    linkPlayfair.rel = 'stylesheet';
    document.head.appendChild(linkPlayfair);
    
    return () => {
        document.head.removeChild(linkPlayfair);
    };
  }, []);

  useEffect(() => {
    const getRandomPercent = () => `${Math.floor(Math.random() * 100)}%`;
    const getRandomSize = () => {
      const sizes = ["w-16 h-16", "w-20 h-20", "w-24 h-24", "w-28 h-28", "w-32 h-32"];
      return sizes[Math.floor(Math.random() * sizes.length)];
    };
    const getRandomDuration = () => `${Math.random() * 5 + 5}s`;
    const getRandomDelay = () => `${Math.random() * 2}s`;

    const circlesData = Array.from({ length: 100 }, (_, index) => ({
      id: index,
      top: getRandomPercent(),
      left: getRandomPercent(),
      size: getRandomSize(),
      duration: getRandomDuration(),
      delay: getRandomDelay(),
    }));
    
    setCircles(circlesData);
  }, []);

  return (
    <>
      <style jsx global>{`
       
        @keyframes floatAround {
            0% { transform: translate(0, 0); }
            25% { transform: translate(100px, -100px); }
            50% { transform: translate(-100px, 100px); }
            75% { transform: translate(100px, 50px); }
            100% { transform: translate(0, 0); }
        }

      `}</style>
      {circles.map((circle) => (
        <div
          key={circle.id}
          style={{
            position: 'absolute',
            top: circle.top,
            left: circle.left,
            animation: `floatAround ${circle.duration} ease-in-out infinite`,
            animationDelay: circle.delay,
          }}
          className={`${circle.size} bg-blue-300 rounded-full opacity-10 blur-2xl hidden md:block`}
        ></div>
      ))}
    </>
  );
};

export default function Hero() {

  const features = [
    {
      id: 'audience',
      title: 'Audience-Tailored',
      description: 'Generate chapters with vocabulary matched to your target audience.',
      icon: Book,
      href: '/audience-tailoring',
      action: 'Craft Story',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'coherence',
      title: 'Narrative Coherence',
      description: 'Ensure consistent character development and plot progression.',
      icon: RefreshCw,
      href: '/coherence-tools',
      action: 'Analyze Story',
      color: 'from-teal-400 to-cyan-500'
    },
    {
      id: 'plot',
      title: 'Plot Assistance',
      description: 'Get AI suggestions to overcome writer\'s block and explore new directions.',
      icon: Lightbulb,
      href: '/plot-assistance',
      action: 'Fix Blocks',
      color: 'from-amber-400 to-orange-500'
    },
    {
      id: 'branching',
      title: 'Creative Branching',
      description: 'Explore multiple storyline possibilities with interactive branching.',
      icon: GitBranch,
      href: '/story-branching',
      action: 'Branch Story',
      color: 'from-pink-500 to-rose-500'
    }
  ];

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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <AnimatedBackground />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <nav className={`fixed top-0 w-full z-20 p-6 flex justify-between items-center transition-all duration-300 ${
          scrolled 
          ? 'bg-slate-900/10 backdrop-blur-md' 
          : 'bg-slate-900'
        }`}>
          <div className="font-bold text-4xl text-blue-400" style={{ fontFamily: "'Playfair Display', serif" }}>StoryAI</div>
          <div className="flex space-x-6">
            <a href="#" className="text-white hover:text-blue-400 transition-colors">Features</a>
            <a href="#" className="text-white hover:text-blue-400 transition-colors">Pricing</a>
            <a href="#" className="text-white hover:text-blue-400 transition-colors">Contact</a>
          </div>
        </nav>

        <main className="mt-32 max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent" style={{ fontFamily: "'Playfair Display', serif" }}>
            {/* <TypingAnimation /> */}
            AI Story Management
          </h1>
          <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
            Craft captivating narratives with AI assistance tailored to your audience and storyline.
          </p>

          <div className="w-full max-w-7xl mx-auto mb-20 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={feature.id}
                    className="group relative bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                    <div className="relative p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/10 rounded-xl">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="h-8 w-8 rounded-full border-2 border-white/20 flex items-center justify-center group-hover:border-white/40 transition-colors duration-300">
                          <div className="w-2 h-2 bg-white/40 rounded-full group-hover:bg-white group-hover:scale-125 transition-all duration-300" />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed mb-6 min-h-[3rem]">
                        {feature.description}
                      </p>
                      <a 
                        href={feature.href}
                        className="inline-flex items-center text-white text-sm font-medium group-hover:text-white"
                      >
                        <span className="border-b border-transparent group-hover:border-white transition-colors duration-300">{feature.action}</span>
                        <span className="ml-2 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </a>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-white/20 transition-colors duration-300" />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 items-center mb-20">
            {["Advanced AI Writing", "Character Development", "World Building", "Export to Multiple Formats"].map((tag, idx) => (
              <div key={idx} className="py-2 px-4 bg-slate-700 rounded-full text-slate-300 text-sm">
                {tag}
              </div>
            ))}
          </div>
        </main>

        <footer className="w-full p-6 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} StoryAI • AI-Powered Narrative Creation</p>
        </footer>
      </div>
    </div>
  );
}
