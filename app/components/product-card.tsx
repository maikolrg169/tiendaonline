'use client';

import React from 'react';

export default function ProductCard({ 
  product, 
  tasaDolar, 
  onAddToCart 
}: { 
  product: any, 
  tasaDolar: number, 
  onAddToCart: (product: any) => void 
}) {
  const precioBs = (parseFloat(product.Precio_USD) * tasaDolar).toFixed(2);
  const imageUrl = product.Imagen_URL || 'https://via.placeholder.com/300x300?text=Sin+Imagen';

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-3xl shadow-sm hover:shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
        <img
          src={imageUrl}
          alt={product.Nombre}
          className="w-full h-56 object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=Error+Imagen';
          }}
        />
        {parseInt(product.Stock) <= 0 && (
          <div className="absolute top-3 right-3 bg-red-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
            Agotado
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 mb-1 uppercase tracking-wider">{product.Categoria}</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{product.Nombre}</h3>
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-6 flex-1 line-clamp-3">{product.Descripcion}</p>
        
        <div className="mt-auto">
          <div className="flex items-end justify-between mb-5">
            <div>
              <p className="text-3xl font-black text-gray-900 dark:text-white">${parseFloat(product.Precio_USD).toFixed(2)}</p>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Bs. {precioBs}</p>
            </div>
          </div>
          
          <button
            onClick={() => onAddToCart(product)}
            disabled={parseInt(product.Stock) <= 0}
            className="w-full flex items-center justify-center px-4 py-3 rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            Añadir al Carrito
          </button>
        </div>
      </div>
    </div>
  );
}
