import React from 'react';
import { Github, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
          <div className="mb-4 md:mb-0">
            <p>&copy; 2025 Developed by <span className="font-medium text-gray-900">Utkarsh Apoorv</span></p>
          </div>
          <div className="flex items-center space-x-6">
            <a 
              href="mailto:utkarshapoorv2003@gmail.com" 
              className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>utkarshapoorv2003@gmail.com</span>
            </a>
            <a 
              href="https://github.com/MrApoorv" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;