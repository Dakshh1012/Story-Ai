import { useEffect, useState } from 'react';

const TypingAnimation = () => {
  const [typedText, setTypedText] = useState('');
  const text = 'AI StoryLine Management';
  let index = 0;

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (index < text.length) {
        setTypedText((prev) => prev + text[index]);
        index++;
      }
    }, 100); // Adjust typing speed here

    // Clear interval after 3 seconds
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
    }, text.length * 100 + 1000); // 3 seconds + a bit of padding time

    // Cleanup on unmount
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <h1
      className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent"
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      {typedText}
    </h1>
  );
};

export default TypingAnimation;
