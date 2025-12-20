'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AcademicNav() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Portfolio</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link 
              href="/satyam#research" 
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Research
            </Link>
            <Link 
              href="/satyam#projects" 
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Projects
            </Link>
            <Link 
              href="/satyam#education" 
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Education
            </Link>
            <Link 
              href="mailto:satyamsinghpx@gmail.com" 
              className="text-sm bg-red-800 text-white px-3 py-1 rounded hover:bg-red-900 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}