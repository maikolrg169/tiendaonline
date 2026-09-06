'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/app/admin/components/sidebar';
import TopNav from '@/app/admin/components/topnav';
import OrdersTable from '@/app/admin/components/orders-table';

export default function AdminPedidos() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const ordersData = await fetch('/api/orders');
      const ordersJson = await ordersData.json();
      setOrders(Array.isArray(ordersJson) ? ordersJson : []);
    }
    loadData();
  }, []);

  const orderData = orders.map((o: any) => ({
    ID_Pedido: o.ID_Pedido || '',
    Fecha: o.Fecha || '',
    Nombre_Cliente: o.Nombre_Cliente || '',
    Telefono_Cliente: o.Telefono_Cliente || '',
    Metodo_Envio: o.Metodo_Envio || '',
    Metodo_Pago: o.Metodo_Pago || '',
    Total_USD: parseFloat(o.Total_USD) || 0,
    Total_Bs: parseFloat(o.Total_Bs) || 0,
    Estado_Pedido: o.Estado_Pedido || 'Pendiente'
  }));

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-6 sm:p-8">
        <TopNav />
        <main className="mt-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Pedidos</h3>
            <OrdersTable orders={orderData} />
          </div>
        </main>
      </div>
    </div>
  );
}
