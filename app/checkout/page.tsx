'use client';

import React, { useEffect, useState } from 'react';
import { fetchConfig } from '@/lib/hooks';

interface CarritoItem {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
}

export default function CheckoutPage() {
  const [config, setConfig] = useState<any>(null);
  const [cart, setCart] = useState<CarritoItem[]>([
    { id: '1', nombre: 'Producto 1', precio: 100, cantidad: 2, imagen: '/placeholder.jpg' },
    { id: '2', nombre: 'Producto 2', precio: 200, cantidad: 1, imagen: '/placeholder.jpg' }
  ]);
  
  useEffect(() => {
    async function loadConfig() {
      const configData = await fetchConfig();
      setConfig(configData);
    }
    loadConfig();
  }, []);
  
  const tasaDolar = config?.TasaDolar ? parseFloat(config.TasaDolar) : 700;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const subtotal = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const totalUSD = subtotal;
    const totalBs = Math.round(totalUSD * tasaDolar);
    
    // En un caso real, enviaríamos los datos al API
    console.log('Pedido creado:', { subtotal, totalUSD, totalBs, cart });
    
    setCart([]);
    window.location.href = '/gracias';
  };
  
  if (cart.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">Carrito vacío</div>;
  }
  
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Finalizar Compra</h2>
        
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl p-8">
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre completo</label>
              <input
                type="text"
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 rounded px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Nombre completo"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Teléfono</label>
              <input
                type="tel"
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 rounded px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Teléfono"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Método de envío</label>
              <select className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 rounded px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">Seleccionar</option>
                <option value="MRW">MRW</option>
                <option value="Zoom">Zoom</option>
                <option value="Tealca">Tealca</option>
                <option value="Delivery">Delivery</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Método de pago</label>
              <select className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 rounded px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">Seleccionar</option>
                <option value="Pago Móvel">Pago Móvil</option>
                <option value="Transferencia">Transferencia</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Referencia de pago</label>
            <input
              type="text"
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 rounded px-3 py-2 pl-8 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Número de transacción o referencia"
            />
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-gray-900 dark:text-white">Resumen</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400">Producto</th>
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400">Cantidad</th>
                    <th className="text-right text-xs font-medium text-gray-500 dark:text-gray-400">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-3 text-gray-900 dark:text-white">{item.nombre}</td>
                      <td className="py-3 text-gray-500 dark:text-gray-400">{item.cantidad}</td>
                      <td className="py-3 text-right font-medium">${item.precio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 flex justify-between font-bold">
              <span>Total</span>
              <span>{Math.round(cart.reduce((s, i) => i.precio * i.cantidad, 0) * tasaDolar)} Bs</span>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-primary-600 text-white px-6 py-3 rounded hover:bg-primary-700 transition-colors"
          >
            Confirmar Pedido
          </button>
        </form>
      </div>
    </section>
  );
}