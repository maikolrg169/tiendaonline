export default function StatsCards({ config, products = [], orders = [] }: { config: any, products?: any[], orders?: any[] }) {
  const tasaDolar = config?.TasaDolar || 0;
  
  // Calculate real metrics
  const activeProducts = products.filter(p => String(p.Activo).toLowerCase() === 'si').length;
  
  const pendingOrders = orders.filter(o => o.Estado_Pedido === 'Pendiente').length;
  
  // Calculate today's sales in USD
  const today = new Date().toISOString().split('T')[0];
  const todaysCompletedOrders = orders.filter(o => 
    o.Estado_Pedido === 'Completado' && 
    o.Fecha?.startsWith(today)
  );
  
  const todaysSales = todaysCompletedOrders.reduce((sum, order) => {
    return sum + (parseFloat(order.Total_USD) || 0);
  }, 0);

  // Format currency
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Productos Activos</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{activeProducts}</span>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Ventas Hoy</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{formatter.format(todaysSales)}</span>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Pedidos Pendientes</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{pendingOrders}</span>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tasa Dólar</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{tasaDolar}</span>
        </div>
      </div>
    </div>
  );
}