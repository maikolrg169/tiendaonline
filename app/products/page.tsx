'use client';

import React, { useEffect, useState } from 'react';
import { fetchProducts, fetchConfig } from '@/lib/hooks';

export default function ProductGrid() {
  const [config, setConfig] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function loadData() {
      const configData = await fetchConfig();
      setConfig(configData);
      const productsData = await fetchProducts();
      setProducts(productsData);
      setIsLoading(false);
    }
    loadData();
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-600">Cargando productos...</span>
      </div>
    );
  }
  
  const tasaDolar = config?.TasaDolar ? parseFloat(config.TasaDolar) : 700;
  
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Catálogo</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products?.map((producto: any) => (
            <div 
              key={producto.ID} 
              className="bg-white dark:bg-gray-800 rounded-xl overflow-shadow border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:shadow-gray-200 transition-all duration-300"
            >
              {producto.Imagen_URL && (
                <img 
                  src={producto.Imagen_URL}
                  alt={producto.Nombre}
                  className="h-48 w-full object-cover rounded-t-xl"
                />
              )}
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{producto.Nombre}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{producto.Descripcion}</p>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-xl font-bold text-primary-600 dark:text-primary-500">
                    ${producto.Precio_USD} / Bs {Math.round(producto.Precio_USD * tasaDolar)}
                  </span>
                  <span className="text-sm text-gray-400 dark:text-gray-500">
                    {producto.Stock} en stock
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}