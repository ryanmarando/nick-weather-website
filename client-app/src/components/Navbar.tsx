import React, { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Build a path that removes "admin." from the hostname but keeps port
  const buildPath = (path: string) => {
    const { protocol, hostname, port } = window.location;
    console.log(window.location);
    const cleanHost = hostname.replace(/^admin\./, "");
    const portPart = port ? `:${port}` : "";
    return `${protocol}//${cleanHost}${portPart}${path}`;
  };

  const links = [
    { name: "Home", path: "/" },
    { name: "Blogs", path: "/blog" },
    { name: "Resume", path: "/resume" },
    { name: "Broadcasting", path: "/broadcasting" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600">
          <a href={buildPath("/")}>Nick Dunn</a>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-8 text-gray-700 font-semibold">
          {links.map((link) => (
            <li key={link.path}>
              <a
                href={buildPath(link.path)}
                className="hover:text-blue-600 transition"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700" onClick={toggleMenu}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <ul className="flex flex-col space-y-4 px-6 py-4 text-gray-700 font-semibold">
            {links.map((link) => (
              <li key={link.path}>
                <a href={buildPath(link.path)} onClick={toggleMenu}>
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
