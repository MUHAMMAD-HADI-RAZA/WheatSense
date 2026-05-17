import React from 'react';
import { BookOpen, Download } from 'lucide-react';

export default function Manual() {
  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            User Guide & Disease Manual
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive guide to wheat diseases, symptoms, and the WheatSense platform.
          </p>
        </div>
        
        <a 
          href="/disease-manual.pdf" 
          download="WheatSense_Disease_Manual.pdf"
          className="btn-primary"
        >
          <Download className="w-4 h-4" /> Download PDF
        </a>
      </div>

      <div className="card h-[800px] p-0 overflow-hidden flex flex-col relative">
        <div className="bg-gray-100 dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <span className="text-sm font-bold text-gray-600 dark:text-gray-300">disease-manual.pdf</span>
        </div>
        
        <div className="flex-1 w-full bg-gray-200 dark:bg-gray-900">
          <object 
            data="/disease-manual.pdf" 
            type="application/pdf" 
            width="100%" 
            height="100%"
            className="w-full h-full"
          >
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Your browser doesn't have a built-in PDF viewer.
              </p>
              <a 
                href="/disease-manual.pdf" 
                className="btn-primary"
                download
              >
                Download the Manual
              </a>
            </div>
          </object>
        </div>
      </div>
    </div>
  );
}
