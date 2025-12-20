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
            <span className="text-sm">Back to Main Portfolio</span>
          </Link>
          
          <div className="text-sm font-medium text-gray-900">
            Satyam Singh - ML Researcher
          </div>
        </div>
      </div>
    </nav>
  );
}