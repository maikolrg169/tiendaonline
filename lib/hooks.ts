export async function fetchConfig() {
  const res = await fetch('/api/config');
  if (!res.ok) throw new Error('Error al obtener configuración');
  const data = await res.json();
  return data;
}

export async function fetchProducts() {
  const res = await fetch('/api/products');
  if (!res.ok) throw new Error('Error al obtener productos');
  const data = await res.json();
  return data.filter((p: any) => p.Estado === 'Activo' || p.Estado === 'activo');
}

export async function fetchProductById(id: string) {
  const res = await fetch(`/api/products?id=${id}`);
  if (!res.ok) throw new Error('Error al obtener producto');
  const data = await res.json();
  return data;
}

export async function fetchOrders() {
  const res = await fetch('/api/orders');
  if (!res.ok) throw new Error('Error al obtener pedidos');
  const data = await res.json();
  return data;
}

export async function fetchShipping() {
  const res = await fetch('/api/shipping');
  if (!res.ok) throw new Error('Error al obtener envíos');
  const data = await res.json();
  return data;
}