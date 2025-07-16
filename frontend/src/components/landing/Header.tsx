"use client";

import React, { useState } from "react";
import Link from "next/link";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">م+</span>
              </div>
              <span className="text-2xl font-bold text-primary">معلم+</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            <Link 
              href="#features" 
              className="text-gray-700 hover:text-primary transition-colors duration-200"
            >
              المميزات
            </Link>
            <Link 
              href="#how-it-works" 
              className="text-gray-700 hover:text-primary transition-colors duration-200"
            >
              كيف يعمل
            </Link>
            <Link 
              href="#pricing" 
              className="text-gray-700 hover:text-primary transition-colors duration-200"
            >
              الأسعار
            </Link>
            <Link 
              href="#contact" 
              className="text-gray-700 hover:text-primary transition-colors duration-200"
            >
              اتصل بنا
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-primary hover:text-primary/80 transition-colors duration-200"
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/register"
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200"
            >
              ابدأ الآن
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <Link
                href="#features"
                className="block px-3 py-2 text-gray-700 hover:text-primary transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                المميزات
              </Link>
              <Link
                href="#how-it-works"
                className="block px-3 py-2 text-gray-700 hover:text-primary transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                كيف يعمل
              </Link>
              <Link
                href="#pricing"
                className="block px-3 py-2 text-gray-700 hover:text-primary transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                الأسعار
              </Link>
              <Link
                href="#contact"
                className="block px-3 py-2 text-gray-700 hover:text-primary transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                اتصل بنا
              </Link>
              <div className="pt-4 space-y-2">
                <Link
                  href="/login"
                  className="block px-3 py-2 text-primary hover:text-primary/80 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ابدأ الآن
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;