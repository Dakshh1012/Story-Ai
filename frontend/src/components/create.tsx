'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const CreateButton: React.FC = () => {
  const router = useRouter();
  const [emojis, setEmojis] = useState<{id: number, emoji: string, x: number, y: number, direction: {x: number, y: number}}[]>([]);
  
  const handleClick = () => {
    // Create floating emojis that scatter in all directions
    const newEmojis = [];
    const emojiOptions = ['✨', '🌟', '💫', '🦄', '🌈', '🎨', '📚', '💖'];
    
    for (let i = 0; i < 15; i++) {
      const randomEmoji = emojiOptions[Math.floor(Math.random() * emojiOptions.length)];
      
      // Generate random angle and distance for scattering
      const angle = Math.random() * Math.PI * 2; // Random angle in radians (0 to 2π)
      const distance = 50 + Math.random() * 100; // Random distance between 50 and 150
      
      // Calculate x and y direction based on angle
      const directionX = Math.cos(angle) * distance;
      const directionY = Math.sin(angle) * distance;
      
      newEmojis.push({
        id: Date.now() + i,
        emoji: randomEmoji,
        x: 0, // Start at center
        y: 0, // Start at center
        direction: {
          x: directionX,
          y: directionY
        }
      });
    }
    
    setEmojis([...emojis, ...newEmojis]);
    
    // Navigate after a slight delay for emoji effect
    setTimeout(() => {
      router.push('/user-input');
    }, 800); 
  };

  return (
    <div className="py-7 flex items-center justify-center bg-[#598bd9] w-full">
      <div className="relative">
        {emojis.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 1, scale: 1, x: item.x, y: item.y }}
            animate={{
              opacity: 0,
              scale: 0.5,
              x: item.direction.x,
              y: item.direction.y,
              rotate: Math.random() * 360 // Random rotation
            }}
            transition={{
              duration: 1.5,
              ease: "easeOut"
            }}
            className="absolute text-2xl pointer-events-none"
            style={{ left: '50%', top: '50%' }}
            onAnimationComplete={() => {
              setEmojis(current => current.filter(emoji => emoji.id !== item.id));
            }}
          >
            {item.emoji}
          </motion.div>
        ))}
        
        <motion.button
          onClick={handleClick}
          className="relative group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative bg-yellow-300 border-3 border-black rounded-2xl p-3 shadow-lg transform transition-transform duration-200">
            <div className="absolute h-8 w-8 bg-yellow-300 border-r-3 border-b-3 border-black transform rotate-45 -bottom-4 left-10 z-0"></div>
            
            <h2 className="font-bangers text-3xl text-black tracking-wide">Try out your own story!</h2>
            
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="text-purple-600 text-2xl">★</div>
            </div>
            <div className="absolute -bottom-1 -left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="text-blue-600 text-xl">★</div>
            </div>
          </div>
        </motion.button>
      </div>
    </div>
  );
};

export default CreateButton;