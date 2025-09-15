import { useState, useEffect } from "react";
import { fetchAPI } from "../functions/api";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { SiX } from "react-icons/si";
import FacebookEmbed from "../components/Facebook";

export default function HomePage() {
  const [youtubeVideoURL, setYoutubeVideoURL] = useState<string>("");
  const [latestBlog, setLatestBlog] = useState<any>(null);

  const getLatestBlog = async () => {
    try {
      const res: any = await fetchAPI("/blog");

      if (res.blogs && res.blogs.length > 0) {
        // Sort newest → oldest by createdAt
        const sorted = res.blogs.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setLatestBlog(sorted[0]);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const getFrontYouTubePageVideo = async () => {
    try {
      const allVideos: any = await fetchAPI("/youtube");

      // Find the frontpage video
      const frontpageVideo = allVideos.find((video: any) => video.onFrontpage);

      // Set the URL if a frontpage video exists
      if (frontpageVideo) {
        try {
          const url = new URL(frontpageVideo.url);
          const videoId = url.searchParams.get("v");
          if (videoId) {
            setYoutubeVideoURL(
              `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`
            );
          } else {
            console.warn("Video URL is not a watch URL:", frontpageVideo.url);
          }
        } catch (err) {
          console.error("Invalid video URL:", frontpageVideo.url, err);
        }
      } else {
        console.warn("No frontpage video found.");
        setYoutubeVideoURL(""); // or a default
      }
    } catch (error) {
      console.error("Error fetching YouTube videos:", error);
    }
  };

  useEffect(() => {
    getLatestBlog();
    getFrontYouTubePageVideo();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 via-blue-800 to-gray-900 text-white">
      {/* Hero Section */}
      <section className="w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-center text-center lg:text-left px-6 lg:px-20 py-20 gap-12">
        {/* Left Content */}
        <div className="flex-1 max-w-lg flex flex-col items-center lg:items-start">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Nick Dunn
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 mb-6">
            Broadcast Meteorologist | Weather Enthusiast | NWA Digital Seal
            Holder
          </p>
          <p className="text-gray-300 max-w-lg mb-8">
            Passionate about delivering accurate forecasts and bringing weather
            science to life. Dedicated to innovating the weather broadcasting
            field to maintain the largest audience.
          </p>
          <a
            href="/resume"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
          >
            View My Resume
          </a>

          {/* Social Media Icons */}
          <div className="flex mt-6 space-x-4 justify-center lg:justify-start">
            <a
              href="https://facebook.com/nickdunnwx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-400 transition text-2xl"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://instagram.com/ndunn_whio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-pink-500 transition text-2xl"
            >
              <FaInstagram />
            </a>
            <a
              href="https://x.com/NickDunn_WX"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-300 transition text-2xl"
            >
              <SiX />
            </a>
            <a
              href="https://www.youtube.com/@NickDunnWX"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-red-600 transition text-2xl"
            >
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col items-center lg:items-end gap-6">
          <img
            src="/images/nick_headshot.jpeg"
            alt="Nick Dunn Headshot"
            className="w-48 h-48 lg:w-64 lg:h-64 rounded-full border-4 border-blue-400 shadow-lg object-cover"
          />

          <div className="w-full max-w-md lg:max-w-lg bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <iframe
              className="w-full aspect-video"
              src={youtubeVideoURL}
              title="Intro Video"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Facebook */}
        <div className="flex-1 w-full max-w-md lg:max-w-lg mt-6 lg:mt-0">
          <FacebookEmbed />
        </div>
      </section>

      {/* Latest Blog */}
      {latestBlog && (
        <div className="w-full bg-gray-800 text-white py-8 px-6 lg:px-20">
          <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6">
            {/* Blog text */}
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Latest Post
              </h2>
              <h3 className="text-xl font-semibold text-blue-400 mb-2">
                {latestBlog.title}
              </h3>
              <p className="text-gray-300 mb-4 line-clamp-3">
                {latestBlog.content.slice(0, 150)}...
              </p>
              <div className="flex space-x-4">
                <a
                  href={`/blog/${latestBlog.id}`}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition"
                >
                  Read More
                </a>
                <a
                  href="/blog"
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition"
                >
                  All Blogs
                </a>
              </div>
            </div>

            {/* Blog image */}
            {latestBlog.images && latestBlog.images.length > 0 && (
              <img
                src={latestBlog.images[0].url}
                alt={latestBlog.title}
                className="w-full max-w-sm rounded-lg shadow-md object-cover"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
