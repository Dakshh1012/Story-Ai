"use client"
import Navbar from "@/components/navbar";

export default function Adults() {
  const features = [
    {
      id: 'characters',
      title: 'Characters',
      description: 'Explore the characters of the story.',
      href: '/adult-characters',
      action: 'See Characters',
      color: 'from-rose-500 to-pink-500'
    },
    {
      id: 'read-aloud',
      title: 'Read Aloud',
      description: 'Listen to the story by an AI narrator.',
      href: '/adult-read',
      action: 'Listen Now',
      color: 'from-sky-400 to-blue-500'
    },
    {
      id: 'questions',
      title: 'Questions',
      description: 'Navigate through a series of questions to guide your content creation.',
      href: '/adult-questions',
      action: 'Start Answering',
      color: 'from-emerald-400 to-green-500'
    },
    {
      id: 'graph',
      title: 'Graph',
      description: 'Visualize data and content in graph form for better understanding.',
      href: '/adult-graph',
      action: 'View Graph',
      color: 'from-violet-500 to-fuchsia-500'
    },
    {
      id: 'story',
      title: 'Story',
      description: 'Create content with different paths and outcomes based on choices.',
      href: '/adult-story',
      action: 'Create Branches',
      color: 'from-yellow-400 to-amber-500'
    },
    {
      id: 'comics',
      title: 'Comics',
      description: 'Generate content in comic format with engaging visuals and storylines.',
      href: '/adult-comics',
      action: 'Create Comics',
      color: 'from-cyan-400 to-teal-500'
    }
  ];
  
      
  
    return (
    <>
    <Navbar />
    <div className="mt-20 flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white px-4">
        <div className="w-full max-w-4xl mx-auto mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
            {features.map((feature) => (
              <div 
                key={feature.id}
                className="group relative bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 w-full max-w-sm"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                <div className="relative p-6">
                  <div className="flex items-center justify-end mb-4">
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
                    <span className="border-b border-transparent group-hover:border-white transition-colors duration-300">
                      {feature.action}
                    </span>
                    <span className="ml-2 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">
                      →
                    </span>
                  </a>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-white/20 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
      
    );
  }
  