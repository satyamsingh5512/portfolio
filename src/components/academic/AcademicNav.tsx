'use client';

import Link from 'next/link';
import { ArrowLeft, Brain, Code, Target, Award } from 'lucide-react';

export default function AcademicNav() {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Main Portfolio</span>
          </Link>
          
          <div className="flex items-center space-x-8">
            <Link 
              href="#about" 
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Brain className="w-3 h-3" />
              <span>About</span>
            </Link>
            <Link 
              href="#skills" 
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Code className="w-3 h-3" />
              <span>Skills</span>
            </Link>
            <Link 
              href="#research" 
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Target className="w-3 h-3" />
              <span>Research</span>
            </Link>
            <Link 
              href="#projects" 
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Code className="w-3 h-3" />
              <span>Projects</span>
            </Link>
            <Link 
              href="#achievements" 
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Award className="w-3 h-3" />
              <span>Awards</span>
            </Link>
            <Link 
              href="mailto:satyamsinghpx@gmail.com" 
              className="text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}