// "use client"

// import { motion } from "framer-motion"
// import { Lock, Search } from "lucide-react"
// import { useRouter } from "next/navigation"
// import { useEffect, useState } from "react"

// export default function Home() {
//   const router = useRouter()
//   const [isHovering, setIsHovering] = useState<string | null>(null)
//   const [searchText, setSearchText] = useState<string>("")

//   // Add Google Fonts - Bangers and Inter
//   useEffect(() => {
//     // Load Google Fonts
//     const linkBangers = document.createElement('link');
//     linkBangers.href = 'https://fonts.googleapis.com/css2?family=Bangers&display=swap';
//     linkBangers.rel = 'stylesheet';
    
//     const linkInter = document.createElement('link');
//     linkInter.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
//     linkInter.rel = 'stylesheet';
    
//     document.head.appendChild(linkBangers);
//     document.head.appendChild(linkInter);
    
//     return () => {
//       document.head.removeChild(linkBangers);
//       document.head.removeChild(linkInter);
//     };
//   }, []);

//   const handleMarvelClick = () => {
//     router.push("/graph")
//   }

//   // Handle search input change
//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchText(e.target.value)
//   }

//   // CSS for the yellow dot pattern
//   const dotPatternStyle = {
//     backgroundImage: `
//       radial-gradient(#d4af37 2px, transparent 2px), 
//       radial-gradient(#d4af37 2px, transparent 2px)
//     `,
//     backgroundSize: '20px 20px',
//     backgroundPosition: '0 0, 10px 10px',
//     backgroundBlendMode: 'multiply',
//   };

//   // Check if search text contains "marvel" (case insensitive)
//   const isMarvelSearch = searchText.toLowerCase().includes("marvel");

//   return (
//     <main 
//       className="min-h-screen flex justify-center items-center bg-blue-400 overflow-hidden" 
//       style={{ 
//         fontFamily: "'Inter', sans-serif",
//         ...dotPatternStyle,
//         backgroundColor: "#60A5FA",
//         backgroundAttachment: "fixed"
//       }}
//     >
//       <div className="flex h-screen w-full">
//         {/* Header */}
//         <div className="flex-1 flex flex-col style={{ backgroundColor: '#598bd9' }}">
//           <div className="p-4  bg-[#598bd9]">
//           <div className="flex justify-center w-full">
//               <div className="inline-block bg-yellow-300 px-6 py-2 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-2">
//                 <h1 className="text-4xl font-bold text-center text-black" style={{ fontFamily: "'Bangers', cursive" }}>The Multiverse Tracker</h1>
//               </div>
//             </div>
//             <div className="max-w-md mx-auto mt-4">
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <Search className="h-5 w-5 text-gray-500" />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Search..."
//                   value={searchText}
//                   onChange={handleSearchChange}
//                   className="pl-10 pr-10 py-2 w-full border-2 border-black rounded-lg bg-white text-black"
//                 />
//                 {isMarvelSearch && (
//                   <div className="absolute inset-0 border-2 border-yellow-400 rounded-lg pointer-events-none glow"></div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Main content */}
//           <div className="flex-1 p-8 flex flex-col items-center justify-center bg-[#598bd9]">
//             <div className="inline-block bg-yellow-300 px-6 py-2 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
//               <h2 className="text-3xl font-bold text-center text-black" style={{ fontFamily: "'Bangers', cursive" }}>Select Your Universe</h2>
//             </div>
            
//             <div className="flex items-center justify-center gap-4 max-w-6xl w-full mx-auto perspective-1000">
//               {/* Harry Potter Card - Locked */}
//               <motion.div
//                 className="relative w-72 h-96 -rotate-12 transform-gpu"
//                 initial={{ opacity: 0, x: -100, rotateY: 15 }}
//                 animate={{ opacity: 1, x: 0, rotateY: 15 }}
//                 transition={{ duration: 0.5 }}
//                 whileHover={{ scale: 1.03, rotate: -10 }}
//               >
//                 <div className="h-full rounded-lg border-2 border-black bg-blue-100 overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
//                   <div className="bg-blue-300 p-3 border-b-2 border-black">
//                     <h3 className="font-bold text-xl text-center text-black" style={{ fontFamily: "'Bangers', cursive" }}>Harry Potter</h3>
//                   </div>
//                   <div className="p-6 flex flex-col items-center justify-center">
//                     <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-black mb-6 bg-white">
//                       <img
//                         src="/img/hp.jpg"
//                         alt="Harry Potter"
//                         className="w-full h-full object-cover opacity-70"
//                       />
//                     </div>
//                     <p className="text-center text-sm mb-6 font-bold text-black">Wizarding World Character Tracker</p>
//                   </div>
//                 </div>
                
//                 {/* Chains overlay */}
//                 <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 rotate-12 z-20">
//                   <div className="flex flex-col items-center">
//                     <div className="h-24 w-6 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full flex flex-col justify-between overflow-hidden border border-black">
//                       {[...Array(8)].map((_, i) => (
//                         <div key={i} className="h-2 w-full bg-gray-600"></div>
//                       ))}
//                     </div>
//                     <div className="h-12 w-12 bg-gray-400 border-2 border-black rounded-md flex items-center justify-center mt-1">
//                       <Lock className="text-black" size={20} />
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="absolute -top-4 left-3 right-3 h-6 bg-gradient-to-r from-gray-300 to-gray-500 flex items-center border border-black z-10">
//                   {[...Array(10)].map((_, i) => (
//                     <div key={i} className="h-4 w-4 mx-0.5 bg-gray-600 border border-black rounded-full"></div>
//                   ))}
//                 </div>
                
//                 <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg"></div>
//               </motion.div>

//               {/* Marvel Card - Active */}
//               <motion.div
//                 className={`relative w-80 h-104 transform-gpu z-10 ${isMarvelSearch ? 'scale-105' : ''}`}
//                 initial={{ opacity: 0, y: 50 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.2 }}
//                 whileHover={{ scale: 1.05 }}
//                 onMouseEnter={() => setIsHovering("marvel")}
//                 onMouseLeave={() => setIsHovering(null)}
//                 onClick={handleMarvelClick}
//               >
//                 <div className={`h-full rounded-lg border-2 border-black bg-red-100 overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
//                   isHovering === "marvel" || isMarvelSearch ? "ring-4 ring-yellow-400" : ""
//                 }`}>
//                   <div className="bg-red-400 p-3 border-b-2 border-black">
//                     <h3 className="font-bold text-xl text-center text-black" style={{ fontFamily: "'Bangers', cursive" }}>Marvel Universe</h3>
//                   </div>
//                   <div className="p-6 flex flex-col items-center justify-center cursor-pointer">
//                     <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-black mb-6 bg-white">
//                       <img
//                         src="/img/m.jpg"
//                         alt="Marvel"
//                         className="w-[200px] h-[150px] object-cover"
//                       />
//                     </div>
//                     <p className="text-center mb-8 font-bold text-black">MCU Character Universe Tracker</p>
//                     <button 
//                       className="px-6 py-3 bg-yellow-300 text-black font-bold rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
//                       style={{ 
//                         textShadow: "2px 2px 0px rgba(0,0,0,0.2)",
//                       }}
//                     >
//                       Explore Universe
//                     </button>
                    
//                     {/* Glow effect on hover or marvel search */}
//                     {(isHovering === "marvel" || isMarvelSearch) && (
//                       <div className="absolute inset-0 bg-yellow-300 rounded-lg filter blur-xl opacity-20 animate-pulse" />
//                     )}
//                   </div>
//                 </div>
//               </motion.div>

//               {/* Game of Thrones Card - Locked */}
//               <motion.div
//                 className="relative w-72 h-96 rotate-12 transform-gpu"
//                 initial={{ opacity: 0, x: 100, rotateY: -15 }}
//                 animate={{ opacity: 1, x: 0, rotateY: -15 }}
//                 transition={{ duration: 0.5 }}
//                 whileHover={{ scale: 1.03, rotate: 10 }}
//               >
//                 <div className="h-full rounded-lg border-2 border-black bg-gray-200 overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
//                   <div className="bg-gray-400 p-3 border-b-2 border-black">
//                     <h3 className="font-bold text-xl text-center text-black" style={{ fontFamily: "'Bangers', cursive" }}>Game of Thrones</h3>
//                   </div>
//                   <div className="p-6 flex flex-col items-center justify-center">
//                     <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-black mb-6 bg-white">
//                       <img
//                         src="/img/got.jpg"
//                         alt="Game of Thrones"
//                         className="w-full h-full object-cover opacity-70"
//                       />
//                     </div>
//                     <p className="text-center text-sm mb-6 font-bold text-black">Westeros Character Tracker</p>
//                   </div>
//                 </div>
                
//                 {/* Chains overlay */}
//                 <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 -rotate-12 z-20">
//                   <div className="flex flex-col items-center">
//                     <div className="h-24 w-6 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full flex flex-col justify-between overflow-hidden border border-black">
//                       {[...Array(8)].map((_, i) => (
//                         <div key={i} className="h-2 w-full bg-gray-600"></div>
//                       ))}
//                     </div>
//                     <div className="h-12 w-12 bg-gray-400 border-2 border-black rounded-md flex items-center justify-center mt-1">
//                       <Lock className="text-black" size={20} />
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="absolute -top-4 left-3 right-3 h-6 bg-gradient-to-r from-gray-300 to-gray-500 flex items-center border border-black z-10">
//                   {[...Array(10)].map((_, i) => (
//                     <div key={i} className="h-4 w-4 mx-0.5 bg-gray-600 border border-black rounded-full"></div>
//                   ))}
//                 </div>
                
//                 <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg"></div>
//               </motion.div>
//             </div>

//             {/* Description box */}
//             <div className="mt-16 max-w-2xl mx-auto bg-yellow-300 p-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
//               <h3 className="font-bold text-xl mb-2 text-black" style={{ fontFamily: "'Bangers', cursive" }}>Year: 2025</h3>
//               <p className="font-bold text-black">Active Universes: 1</p>
//               <p className="mt-4 text-black">Select a universe above to begin exploring characters, timelines, and events!</p>
//             </div>
//           </div>
          
//           {/* Footer */}
//           <div className="p-4 border-t-2 border-black bg-[#ffed91]">
//             <p className="text-center text-sm text-black">© 2025 Fictional Writer Toolkit - Data from MCU Wiki</p>
//           </div>
//         </div>
//       </div>

//       {/* Add global styles */}
//       <style jsx global>{`
//         .glow {
//           animation: glow 1.5s ease-in-out infinite alternate;
//         }
        
//         @keyframes glow {
//           from {
//             box-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #e6b800, 0 0 20px #e6b800;
//           }
//           to {
//             box-shadow: 0 0 10px #fff, 0 0 15px #ffed4a, 0 0 20px #ffed4a, 0 0 25px #ffed4a;
//           }
//         }
//       `}</style>
//     </main>
//   )
// }