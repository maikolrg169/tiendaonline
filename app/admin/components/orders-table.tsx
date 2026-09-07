export interface PedidoTabla {
  ID_Pedido: string;
  Fecha: string;
  Nombre_Cliente: string;
  Telefono_Cliente: string;
  Metodo_Envio: string;
  Metodo_Pago: string;
  Total_USD: number;
  Total_Bs: number;
  Estado_Pedido: string;
}

export default function OrdersTable({ orders }: { orders: PedidoTabla[] | undefined }) {
  if (!orders) return null;
  
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <table className="min-w-full bg-white dark:bg-gray-900">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha</th>
            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cliente</th>
            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Envío</th>
            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pago</th>
            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Bs</th>
            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
            <th className="py-4 px-6 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {orders.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-8 text-center text-gray-500 dark:text-gray-400">
                No hay pedidos recientes
              </td>
            </tr>
          ) : (
            orders.map((pedido) => (
              <tr key={pedido.ID_Pedido} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group">
                <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">{pedido.ID_Pedido}</td>
                <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">{new Date(pedido.Fecha).toLocaleDateString()}</td>
                <td className="py-4 px-6 text-sm text-gray-900 dark:text-white">
                  <div>{pedido.Nombre_Cliente}</div>
                  <div className="text-xs text-gray-500">{pedido.Telefono_Cliente}</div>
                </td>
                <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">{pedido.Metodo_Envio}</td>
                <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">{pedido.Metodo_Pago}</td>
                <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">{pedido.Total_Bs} Bs</td>
                <td className="py-4 px-6 text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                    ${pedido.Estado_Pedido === 'Pagado' 
                      ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' 
                      : pedido.Estado_Pedido === 'Enviado' 
                        ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' 
                        : 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20'
                    }`}
                  >
                    {pedido.Estado_Pedido}
                  </span>
                </td>
                <td className="py-4 px-6 text-right text-sm">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400">Ver</button>
                    <button className="text-green-600 hover:text-green-800 dark:hover:text-green-400">Actualizar</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}