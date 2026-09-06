import { Edit, Trash2 } from 'lucide-react';

export interface ProductoTabla {
  ID: string;
  Nombre: string;
  Descripcion: string;
  Precio_USD: number;
  Imagen_URL: string;
  Categoria: string;
  Stock: number;
  Estado: string;
  Alerta_Stock?: number;
}

interface ProductTableProps {
  products: ProductoTabla[] | undefined;
  onEdit: (product: ProductoTabla) => void;
  onDelete: (id: string) => void;
}

export default function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  if (!products) return null;
  
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <table className="min-w-full bg-white dark:bg-gray-900">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Producto</th>
            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Descripción</th>
            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Precio</th>
            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock</th>
            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
            <th className="py-4 px-6 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {products.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-8 text-center text-gray-500 dark:text-gray-400">
                No hay productos disponibles
              </td>
            </tr>
          ) : (
            products.map((producto) => (
              <tr key={producto.ID} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    {producto.Imagen_URL ? (
                      <img src={producto.Imagen_URL} alt={producto.Nombre} className="w-10 h-10 rounded-lg object-cover bg-gray-100 dark:bg-gray-800" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No img</span>
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{producto.Nombre}</div>
                      <div className="text-xs text-gray-500">{producto.Categoria}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400 max-w-[200px] truncate">
                  {producto.Descripcion}
                </td>
                <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                  ${producto.Precio_USD}
                </td>
                <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className={producto.Stock <= (producto.Alerta_Stock || 5) ? 'text-red-600 font-bold dark:text-red-400' : ''}>
                      {producto.Stock}
                    </span>
                    {producto.Stock <= (producto.Alerta_Stock || 5) && (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6 text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                    ${(producto.Estado === 'Activo' || producto.Estado === 'activo')
                      ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' 
                      : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                    }`}
                  >
                    {producto.Estado}
                  </span>
                </td>
                <td className="py-4 px-6 text-right text-sm">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(producto)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(producto.ID)}
                      className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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