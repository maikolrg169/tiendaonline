'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/app/admin/components/sidebar';
import TopNav from '@/app/admin/components/topnav';
import StatsCards from '@/app/admin/components/stats-cards';
import DashboardCharts from '@/app/admin/components/dashboard-charts';

export default function AdminDashboard() {
  const [config, setConfig] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [configRes, productsRes, ordersRes] = await Promise.all([
          fetch('/api/config'),
          fetch('/api/products'),
          fetch('/api/orders')
        ]);
        
        setConfig(await configRes.json());
        setProducts(await productsRes.json());
        setOrders(await ordersRes.json());
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-6 sm:p-8">
        <TopNav />
        <main className="mt-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Panel de Resumen</h2>
            <p className="text-gray-500 dark:text-gray-400">Bienvenido al sistema de administración de tu tienda.</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <>
              <StatsCards 
                config={config} 
                products={products} 
                orders={orders} 
              />
              <DashboardCharts orders={orders} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}