'use client';

import { Bell, Search, User, Sun, Moon, AlertTriangle } from 'lucide-react';
import { useTheme } from '@/app/components/theme-provider';
import { useState, useEffect } from 'react';

export default function TopNav() {
  const { theme, toggleTheme } = useTheme();
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    async function fetchLowStock() {
      try {
        const response = await fetch('/api/products?all=true');
        const data = await response.json();
        if (Array.isArray(data)) {
          const alerts = data.filter(p => parseInt(p.Stock) <= parseInt(p.Alerta_Stock || 5));
          setLowStockProducts(alerts);
        }
      } catch (error) {
        console.error('Error fetching low stock:', error);
      }
    }
    fetchLowStock();
  }, []);

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
      <div className="h-full px-6 flex items-center justify-between">
        
        {/* Left Side: Global Search */}
        <div className="flex-1 max-w-md">
          <div className="relative group hidden sm:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text"
              placeholder="Buscar..."
              className="w-full bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-white rounded-full pl-10 pr-4 py-2 border-none focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
            />
          </div>
        </div>

        {/* Right Side: Actions & Profile */}
        <div className="flex items-center gap-4 ml-auto">
          <button 
            onClick={toggleTheme}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative"
            aria-label="Alternar Modo Oscuro"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          
          
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-full transition-colors relative ${showNotifications ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <Bell className="w-5 h-5" />
              {lowStockProducts.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-white dark:ring-gray-900">
                  {lowStockProducts.length}
                </span>
              )}
            </button>
            
            {/* Notificaciones Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Alertas de Stock</h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                    {lowStockProducts.length}
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {lowStockProducts.length > 0 ? (
                    lowStockProducts.map(product => (
                      <div key={product.ID} className="px-4 py-3 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-start gap-3">
                        <div className="p-2 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-lg shrink-0">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">{product.Nombre}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Quedan <span className="font-bold text-red-500">{product.Stock}</span> de {product.Alerta_Stock || 5} (Límite)
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <div className="mx-auto w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mb-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Stock saludable. No hay alertas.</p>
                    </div>
                  )}
                </div>
                {lowStockProducts.length > 0 && (
                  <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                    <a href="/admin/productos" className="block text-center text-xs font-medium text-blue-600 dark:text-blue-400 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                      Gestionar Inventario
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-2"></div>
          
          <button className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200 leading-none">Administrador</p>
              <p className="text-xs text-gray-500 mt-1">admin@tienda.com</p>
            </div>
          </button>
        </div>
        
      </div>
    </header>
  );
}