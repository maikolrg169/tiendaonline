export interface EnvioTabla {
  ID_Envio: string;
  Nombre_Empresa: string;
  Tarifa_USD: number;
  Estado: string;
}

export default function ShippingTable({ shipping }: { shipping: EnvioTabla[] | undefined }) {
  if (!shipping) return null;
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 rounded-xl">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400">ID</th>
            <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400">Empresa</th>
            <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400">Tarifa USD</th>
            <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400">Estado</th>
            <th className="text-right text-xs font-medium text-gray-500 dark:text-gray-400">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {shipping.map((envio) => (
            <tr key={envio.ID_Envio} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="text-sm font-medium text-gray-900 dark:text-white">{envio.ID_Envio}</td>
              <td className="text-sm text-gray-900 dark:text-white">{envio.Nombre_Empresa}</td>
              <td className="text-sm text-gray-500 dark:text-gray-400">${envio.Tarifa_USD}</td>
              <td className="text-sm">
                <span className={envio.Estado === 'Activo' 
                  ? 'bg-green-100 text-green-800 px-2 py-1 rounded' 
                  : 'bg-red-100 text-red-800 px-2 py-1 rounded'
                }>{envio.Estado}</span>
              </td>
              <td className="text-right text-sm text-gray-400 dark:text-gray-500">
                <button className="text-blue-600 hover:text-blue-800">Editar</button>
                <button className="text-red-600 hover:text-red-800">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}