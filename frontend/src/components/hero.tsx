import { Book, GitBranch, Lightbulb, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import Navbar from './navbar';

const AnimatedBackground = () => {
  const [circles, setCircles] = useState<{ id: number; top: string; left: string; size: string; duration: string; delay: string }[]>([]);

  useEffect(() => {
    const getRandomPercent = () => `${Math.floor(Math.random() * 100)}%`;
    const getRandomSize = () => ["w-16 h-16", "w-20 h-20", "w-24 h-24", "w-28 h-28", "w-32 h-32"][Math.floor(Math.random() * 5)];
    const getRandomDuration = () => `${(Math.random() * 6 + 6).toFixed(2)}s`;
    const getRandomDelay = () => `${(Math.random() * 2).toFixed(2)}s`;

    const circlesData = Array.from({ length: 80 }, (_, i) => ({
      id: i,
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
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(60px, -60px) scale(1.1); }
          100% { transform: translate(0, 0) scale(1); }
        }
      `}</style>

      {circles.map((circle) => (
        <div
          key={circle.id}
          style={{
            top: circle.top,
            left: circle.left,
            animation: `floatAround ${circle.duration} ease-in-out infinite`,
            animationDelay: circle.delay,
          }}
          className={`${circle.size} bg-gradient-to-br from-blue-400/20 to-indigo-500/10 rounded-full blur-3xl absolute hidden md:block`}
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
      href: '/generate',
      action: 'Craft Story',
      color: 'from-blue-500 to-indigo-500',
    },
    {
      id: 'coherence',
      title: 'Narrative Coherence',
      description: 'Ensure consistent character development and plot progression.',
      icon: RefreshCw,
      href: '/generate',
      action: 'Analyze Story',
      color: 'from-teal-400 to-cyan-500',
    },
    {
      id: 'plot',
      title: 'Plot Assistance',
      description: 'Get AI suggestions to overcome writer\'s block and explore new directions.',
      icon: Lightbulb,
      href: '/generate',
      action: 'Fix Blocks',
      color: 'from-amber-400 to-orange-500',
    },
    {
      id: 'branching',
      title: 'Creative Branching',
      description: 'Explore multiple storyline possibilities with interactive branching.',
      icon: GitBranch,
      href: '/generate',
      action: 'Branch Story',
      color: 'from-pink-500 to-rose-500',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <AnimatedBackground />
      <Navbar />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <main className="mt-24 max-w-6xl mx-auto text-center">
        <h1
          className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-wide drop-shadow-lg animate-gradient-slow"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          AI Story Management
        </h1>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Craft captivating narratives with AI assistance tailored to your audience and storyline.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 px-4">
            {features.map(({ id, icon: Icon, title, description, href, action, color }) => (
              <div
                key={id}
                className="group relative rounded-2xl bg-slate-800 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                <div className="relative p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-white/10 rounded-xl">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="h-8 w-8 rounded-full border-2 border-white/20 flex items-center justify-center group-hover:border-white/40 transition duration-300">
                      <div className="w-2 h-2 bg-white/40 rounded-full group-hover:bg-white group-hover:scale-125 transition-all duration-300" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>{title}</h3>
                  <p className="text-slate-400 text-sm min-h-[3rem] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{description}</p>
                  <a href={href} className="inline-flex items-center text-white text-sm font-medium group-hover:text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <span className="border-b border-transparent group-hover:border-white transition duration-300">{action}</span>
                    <span className="ml-2 transition-transform transform group-hover:translate-x-1">→</span>
                  </a>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-white/20 transition duration-300" />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-20">
            {['Advanced AI Writing', 'Character Development', 'World Building', 'Export to Multiple Formats'].map((tag, idx) => (
              <div 
                key={idx} 
                className="py-2 px-5 bg-slate-700/80 rounded-full text-slate-300 text-sm backdrop-blur-md"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {tag}
              </div>
            ))}
          </div>
        </main>

        <footer className="w-full p-6 text-center text-slate-600 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
          © {new Date().getFullYear()} StoryAI • AI-Powered Narrative Creation
        </footer>
      </div>
    </div>
  );
}