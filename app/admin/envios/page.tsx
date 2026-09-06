'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/app/admin/components/sidebar';
import TopNav from '@/app/admin/components/topnav';
import ShippingTable from '@/app/admin/components/shipping-table';

export default function AdminEnvios() {
  const [shipping, setShipping] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const shippingData = await fetch('/api/shipping');
      const shippingJson = await shippingData.json();
      setShipping(Array.isArray(shippingJson) ? shippingJson : []);
    }
    loadData();
  }, []);

  const shippingData = shipping.map((s: any) => ({
    ID_Envio: s.ID_Envio || '',
    Nombre_Empresa: s.Nombre_Empresa || '',
    Tarifa_USD: parseFloat(s.Tarifa_USD) || 0,
    Estado: s.Estado || 'Activo'
  }));

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-6 sm:p-8">
        <TopNav />
        <main className="mt-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Envíos</h3>
            <ShippingTable shipping={shippingData} />
          </div>
        </main>
      </div>
    </div>
  );
}
