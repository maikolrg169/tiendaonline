export interface EnvioTabla {
  ID_Envio: string;
  Nombre_Empresa: string;
  Tarifa_USD: number;
  Estado: string;
}

export default function ShippingTable({ shipping }: { shipping: EnvioTabla[] | undefined }) {
  if (!shipping) return null;
  
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <table className="min-w-full bg-white dark:bg-gray-900">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Empresa</th>
            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tarifa USD</th>
            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
            <th className="py-4 px-6 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {shipping.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-8 text-center text-gray-500 dark:text-gray-400">
                No hay envíos configurados
              </td>
            </tr>
          ) : (
            shipping.map((envio) => (
              <tr key={envio.ID_Envio} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group">
                <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">{envio.ID_Envio}</td>
                <td className="py-4 px-6 text-sm text-gray-900 dark:text-white">{envio.Nombre_Empresa}</td>
                <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">${envio.Tarifa_USD}</td>
                <td className="py-4 px-6 text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                    ${(envio.Estado === 'Activo' || envio.Estado === 'activo')
                      ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' 
                      : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                    }`}
                  >
                    {envio.Estado}
                  </span>
                </td>
                <td className="py-4 px-6 text-right text-sm">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400">Editar</button>
                    <button className="text-red-600 hover:text-red-800 dark:hover:text-red-400">Eliminar</button>
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