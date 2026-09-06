'use client';

import React from 'react';

export default function ShoppingCart({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem,
  tasaDolar,
  config
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  cartItems: any[], 
  onUpdateQuantity: (id: string, quantity: number) => void,
  onRemoveItem: (id: string) => void,
  tasaDolar: number,
  config?: any
}) {
  const totalUSD = cartItems.reduce((total, item) => {
    const price = parseFloat(item.Precio_USD) || 0;
    return total + (price * item.quantity);
  }, 0);
  const totalBs = totalUSD * tasaDolar;

  const handleCheckout = () => {
    const number = config?.WhatsAppNumber || '1234567890';
    const defaultMsg = config?.WhatsAppMessage || 'Hola, quiero hacer el siguiente pedido:';
    
    const text = cartItems.map(item => {
      const price = parseFloat(item.Precio_USD) || 0;
      return `${item.quantity}x ${item.Nombre} ($${price.toFixed(2)})`;
    }).join('%0A');
    
    const url = `https://wa.me/${number}?text=${encodeURIComponent(defaultMsg)}%0A%0A${text}%0A%0ATotal: $${totalUSD.toFixed(2)} / Bs. ${totalBs.toFixed(2)}`;
    window.open(url, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md transform transition ease-in-out duration-500 sm:duration-700 translate-x-0">
          <div className="h-full flex flex-col bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl shadow-2xl overflow-y-scroll border-l border-gray-200 dark:border-gray-800">
            <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tu Carrito</h2>
                <div className="ml-3 h-7 flex items-center">
                  <button
                    onClick={onClose}
                    className="bg-white/50 dark:bg-gray-800/50 rounded-full p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none transition-colors"
                  >
                    <span className="sr-only">Cerrar panel</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <div className="flow-root">
                  <ul role="list" className="-my-6 divide-y divide-gray-100 dark:divide-gray-800">
                    {cartItems.length === 0 ? (
                      <li className="py-12 flex flex-col items-center justify-center text-center text-gray-500">
                        <svg className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">Tu carrito está vacío</p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">¡Agrega algunos productos para continuar!</p>
                      </li>
                    ) : (
                      cartItems.map((item) => (
                        <li key={item.ID} className="py-6 flex">
                          <div className="flex-shrink-0 w-24 h-24 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900">
                            <img
                              src={item.Imagen_URL || 'https://via.placeholder.com/150'}
                              alt={item.Nombre}
                              className="w-full h-full object-center object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error';
                              }}
                            />
                          </div>

                          <div className="ml-4 flex-1 flex flex-col">
                            <div>
                              <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white">
                                <h3>{item.Nombre}</h3>
                                <p className="ml-4">${((parseFloat(item.Precio_USD) || 0) * item.quantity).toFixed(2)}</p>
                              </div>
                              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-indigo-500">{item.Categoria}</p>
                            </div>
                            <div className="flex-1 flex items-end justify-between text-sm mt-4">
                              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
                                <button 
                                  onClick={() => onUpdateQuantity(item.ID, Math.max(1, item.quantity - 1))}
                                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors font-medium"
                                >
                                  -
                                </button>
                                <span className="px-3 font-semibold text-gray-900 dark:text-white">{item.quantity}</span>
                                <button 
                                  onClick={() => onUpdateQuantity(item.ID, Math.min(parseInt(item.Stock), item.quantity + 1))}
                                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors font-medium"
                                >
                                  +
                                </button>
                              </div>

                              <div className="flex">
                                <button
                                  onClick={() => onRemoveItem(item.ID)}
                                  type="button"
                                  className="font-medium text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300 text-sm transition-colors"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 py-6 px-4 sm:px-6">
                <div className="flex justify-between text-lg font-black text-gray-900 dark:text-white mb-1">
                  <p>Total (USD)</p>
                  <p>${totalUSD.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-400 mb-6">
                  <p>Equivalente en Bs.</p>
                  <p>Bs. {totalBs.toFixed(2)}</p>
                </div>
                
                <div className="mt-6">
                  <button
                    onClick={handleCheckout}
                    className="w-full flex justify-center items-center px-6 py-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
                  >
                    Hacer Pedido por WhatsApp
                  </button>
                </div>
                <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                  <p>
                    o{' '}
                    <button
                      type="button"
                      className="text-indigo-600 font-medium hover:text-indigo-500 dark:text-indigo-400"
                      onClick={onClose}
                    >
                      Continuar comprando<span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
