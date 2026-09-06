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
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 rounded-xl">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400">ID</th>
            <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400">Fecha</th>
            <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400">Cliente</th>
            <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400">Envío</th>
            <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400">Pago</th>
            <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400">Total Bs</th>
            <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400">Estado</th>
            <th className="text-right text-xs font-medium text-gray-500 dark:text-gray-400">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((pedido) => (
            <tr key={pedido.ID_Pedido} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="text-sm font-medium text-gray-900 dark:text-white">{pedido.ID_Pedido}</td>
              <td className="text-sm text-gray-500 dark:text-gray-400">{new Date(pedido.Fecha).toLocaleDateString()}</td>
              <td className="text-sm text-gray-900 dark:text-white">{pedido.Nombre_Cliente}</td>
              <td className="text-sm text-gray-500 dark:text-gray-400">{pedido.Metodo_Envio}</td>
              <td className="text-sm text-gray-500 dark:text-gray-400">{pedido.Metodo_Pago}</td>
              <td className="text-sm text-gray-500 dark:text-gray-400">{pedido.Total_Bs} Bs</td>
              <td className="text-sm">
                <span className={pedido.Estado_Pedido === 'Pagado' 
                  ? 'bg-green-100 text-green-800 px-2 py-1 rounded' 
                  : pedido.Estado_Pedido === 'Enviado' 
                    ? 'bg-blue-100 text-blue-800 px-2 py-1 rounded' 
                    : 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded'
                }>{pedido.Estado_Pedido}</span>
              </td>
              <td className="text-right text-sm text-gray-400 dark:text-gray-500">
                <button className="mr-1 text-blue-600 hover:text-blue-800">Ver</button>
                <button className="text-green-600 hover:text-green-800">Actualizar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}