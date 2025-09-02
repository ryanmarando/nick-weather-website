import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-16">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Nick Dunn. All rights reserved.
        </p>

        <div className="flex space-x-6 mt-4 md:mt-0">
          <a
            href="https://www.linkedin.com/in/nicholas-dunn-7335b41a5/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition"
          >
            LinkedIn
          </a>
          <a href="/contact" className="hover:text-blue-400 transition">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
