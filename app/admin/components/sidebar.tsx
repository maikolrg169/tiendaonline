'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Settings, Package, ShoppingCart, Truck, LogOut } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/admin/dashboard', label: 'Panel', icon: LayoutDashboard },
    { href: '/admin/config', label: 'Configuración', icon: Settings },
    { href: '/admin/productos', label: 'Productos', icon: Package },
    { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingCart },
    { href: '/admin/envios', label: 'Envíos', icon: Truck },
  ];

  return (
    <nav className="bg-gray-900/95 backdrop-blur-md h-screen w-64 flex-shrink-0 border-r border-gray-800 flex flex-col transition-all duration-300">
      <div className="h-16 border-b border-gray-800 flex items-center px-6">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center mr-3 shadow-lg shadow-blue-600/20">
          <Package className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-white font-bold text-lg tracking-tight">Tienda CMS</h2>
      </div>
      
      <div className="flex-1 py-6 px-3 overflow-y-auto">
        <ul className="space-y-1.5">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group
                    ${isActive 
                      ? 'bg-blue-600/10 text-blue-400' 
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                    }`}
                >
                  <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => window.location.href = '/admin/login'}
          className="flex items-center w-full rounded-xl px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 mr-3 text-gray-500 group-hover:text-red-400 transition-colors" />
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}