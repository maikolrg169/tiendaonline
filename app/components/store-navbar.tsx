'use client';

import React from 'react';
import { useTheme } from './theme-provider';

export default function StoreNavbar({ 
  cartItemCount, 
  onCartClick, 
  config 
}: { 
  cartItemCount: number, 
  onCartClick: () => void,
  config?: any 
}) {
  const { theme, toggleTheme } = useTheme();
  
  // Use config primary color for text if no logo
  const primaryColor = config?.PrimaryColor || '#6366f1'; 

  return (
    <nav className="bg-white/70 dark:bg-gray-950/70 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {config?.LogoURL ? (
              <img src={config.LogoURL} alt={config.StoreName || 'Logo'} className="h-8 object-contain" />
            ) : (
              <span 
                className="text-2xl font-black tracking-tight" 
                style={{ color: primaryColor }}
              >
                {config?.StoreName || 'MiTienda'}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              )}
            </button>

            <button 
              onClick={onCartClick}
              className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full shadow-md">
                  {cartItemCount}
                </span>
              )}
            </button>
            <a href="/admin/login" className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors hidden sm:block">
              Admin
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
