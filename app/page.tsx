'use client';

import React, { useEffect, useState } from 'react';
import StoreNavbar from '@/app/components/store-navbar';
import ProductCard from '@/app/components/product-card';
import ShoppingCart from '@/app/components/shopping-cart';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [tasaDolar, setTasaDolar] = useState<number>(0);
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const configData = await fetch('/api/config');
        const configJson = await configData.json();
        setTasaDolar(parseFloat(configJson.TasaDolar) || 0);
        setConfig(configJson);

        const productsData = await fetch('/api/products');
        const productsJson = await productsData.json();
        setProducts(Array.isArray(productsJson) ? productsJson : []);
      } catch (error) {
        console.error("Error loading store data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    
    // Cargar carrito desde local storage (opcional)
    const savedCart = localStorage.getItem('shopping_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {}
    }
  }, []);

  // Guardar carrito en local storage
  useEffect(() => {
    localStorage.setItem('shopping_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (product: any) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.ID === product.ID);
      if (existing) {
        return prev.map(item => 
          item.ID === product.ID 
            ? { ...item, quantity: Math.min(parseInt(item.Stock), item.quantity + 1) } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true); // Abrir carrito al agregar
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(prev => prev.map(item => item.ID === id ? { ...item, quantity } : item));
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.ID !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 flex flex-col">
      <StoreNavbar 
        cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} 
        onCartClick={() => setIsCartOpen(true)} 
        config={config}
      />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-indigo-500/20 dark:bg-indigo-600/20 blur-[100px] -z-10 rounded-full pointer-events-none"></div>
          
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-7xl">
            <span className="block mb-2">{config?.HeroTitle1 || 'Explora el nuevo'}</span>
            <span 
              className="block bg-clip-text text-transparent pb-2"
              style={{
                backgroundImage: config?.PrimaryColor 
                  ? `linear-gradient(to right, ${config.PrimaryColor}, #ec4899)` 
                  : 'linear-gradient(to right, #6366f1, #a855f7, #ec4899)'
              }}
            >
              {config?.HeroTitle2 || 'Catálogo Premium'}
            </span>
          </h1>
          <p className="mt-6 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-8 md:text-xl md:max-w-2xl">
            {config?.HeroSubtitle || 'Descubre nuestra selección de artículos de alta calidad, con precios sincronizados en tiempo real para tu mayor comodidad.'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl leading-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all shadow-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl shadow-sm">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No hay productos</h3>
            <p className="mt-1 text-sm text-gray-500">Actualmente no hay productos disponibles o ninguno coincide con tu búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products
              .filter(p => p.Nombre?.toLowerCase().includes(searchQuery.toLowerCase()) || p.Categoria?.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(product => (
                <ProductCard 
                  key={product.ID} 
                  product={product} 
                  tasaDolar={tasaDolar} 
                  onAddToCart={handleAddToCart} 
                />
            ))}
          </div>
        )}
      </main>

      <ShoppingCart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        tasaDolar={tasaDolar}
        config={config}
      />

      {/* Dynamic Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 text-center mt-auto">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {config?.FooterText || "© 2026 MiTienda. Todos los derechos reservados."}
        </p>
      </footer>
    </div>
  );
}
