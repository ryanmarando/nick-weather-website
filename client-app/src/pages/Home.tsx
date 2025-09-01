import { useState } from "react";

export default function HomePage() {
  // Example: you can add state here
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 via-blue-800 to-gray-900 text-white flex items-center justify-center">
      <section className="w-full max-w-[1200px] flex flex-col lg:flex-row items-center justify-center text-center lg:text-left px-6 lg:px-20 py-20 gap-12">

        {/* Left Content */}
        <div className="flex-1">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Nick Dunn
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 mb-6">
            Broadcast Meteorologist | Weather Enthusiast | Another?
          </p>
          <p className="text-gray-300 max-w-lg mb-8">
            Passionate about delivering accurate forecasts and bringing weather science to life. 
            Dedicated to innovating the weather broadcasting field to maintain the largest audience.
          </p>
          <a
            href="#resume"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
          >
            View My Resume
          </a>
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col items-center lg:items-end gap-6">
          <img
            src="/headshot.jpg"
            alt="Nick Dunn Headshot"
            className="w-48 h-48 lg:w-64 lg:h-64 rounded-full border-4 border-blue-400 shadow-lg object-cover"
          />
          <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg overflow-hidden lg:max-w-lg">
            <iframe
              className="w-full aspect-video"
              src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
              title="Intro Video"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>

      </section>
    </div>
  );
}
