'use client';

import React, { useEffect, useState } from 'react';
import { fetchConfig, fetchProducts } from '@/lib/hooks';

interface CarritoItem {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
}

export default function CartPage() {
  const [config, setConfig] = useState<any>(null);
  const [products] = useState<any[]>([]);
  const [cart, setCart] = useState<CarritoItem[]>([]);
  
  useEffect(() => {
    async function loadData() {
      const configData = await fetchConfig();
      setConfig(configData);
    }
    loadData();
  }, []);
  
  const agregarAlCarrito = (producto: any) => {
    const existente = cart.find(item => item.id === producto.ID);
    if (existente) {
      setCart(cart.map(item => 
        item.id === producto.ID 
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setCart([...cart, { 
        id: producto.ID, 
        nombre: producto.Nombre, 
        precio: producto.Precio_USD, 
        cantidad: 1, 
        imagen: producto.Imagen_URL 
      }]);
    }
  };
  
  useEffect(() => {
    // Cargar productos y agregar algunos al carrito por defecto
    const loadProducts = async () => {
      const productsData = await fetchProducts();
      // Podemos agregar lógica aquí para prellenar el carrito
    };
    loadProducts();
  }, []);
  
  const subtotal = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const tasaDolar = config?.TasaDolar ? parseFloat(config.TasaDolar) : 700;
  const totalBs = Math.round(subtotal * tasaDolar);
  
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Carrito de Compras</h2>
        
        {cart.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">Tu carrito está vacío</p>
            <a href="/products" className="mt-4 inline-block text-primary-600 hover:text-primary-500">Continuar comprando</a>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400">Producto</th>
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400">Precio</th>
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400">Cantidad</th>
                    <th className="text-right text-xs font-medium text-gray-500 dark:text-gray-400">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-4">
                        <img 
                          src={item.imagen} 
                          alt={item.nombre} 
                          className="w-6 h-6 object-rounded mr-3"
                        />
                        <span className="text-gray-900 dark:text-white">{item.nombre}</span>
                      </td>
                      <td className="py-4 text-gray-500 dark:text-gray-400">${item.precio}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setCart(cart.filter(c => c.id !== item.id))}
                            className="text-red-500 hover:text-red-700"
                          >
                            - 
                          </button>
                          <span className="text-gray-600 dark:text-gray-300">{item.cantidad}</span>
                          <button 
                            onClick={() => setCart(cart.map(c => c.id === item.id ? { ...c, cantidad: c.cantidad + 1 } : c))}
                            className="text-green-500 hover:text-green-700"
                          >
                            + 
                          </button>
                        </div>
                      </td>
                      <td className="py-4 text-right font-medium">
                        ${item.precio * item.cantidad}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium text-gray-900 dark:text-white">Subtotal</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">${subtotal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Total Bs</span>
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-500">{totalBs} Bs</span>
              </div>
            </div>
            
            <div className="mt-8">
              <button 
                onClick={() => window.location.href = '/checkout'}
                className="w-full bg-primary-600 text-white px-6 py-3 rounded hover:bg-primary-700 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}