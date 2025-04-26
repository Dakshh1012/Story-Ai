"use client";

export default function VideoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-4xl font-bold text-white mb-6">Watch the Story</h1>
      <p className="text-white text-lg mb-8 text-center">
        Enjoy this immersive video narration of the story.
      </p>
      <div className="w-full max-w-3xl rounded-xl overflow-hidden shadow-lg">
        <video
          className="w-full h-auto rounded-xl"
          controls
          preload="auto"
        >
          <source src="/AI_story.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}
