import { NextRequest, NextResponse } from 'next/server';
import { getOrders, createOrder, updateOrderStatus } from '@/lib/googleSheets';

export async function GET() {
  try {
    const orders = await getOrders();
    const cleanOrders = orders.map((row: any) => typeof row.toObject === 'function' ? row.toObject() : row);
    return NextResponse.json(cleanOrders);
  } catch (error) {
    console.error("Error API Pedidos:", error);
    return NextResponse.json({ error: 'Error al obtener pedidos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const tasaDolar = parseFloat(body.tasaDolar) || 700;
    const totalUSD = parseFloat(body.totalUSD) || 0;
    const totalBs = totalUSD * tasaDolar;
    
    const newOrder = {
      ID_Pedido: crypto.randomUUID(),
      Fecha: new Date().toISOString(),
      Nombre_Cliente: body.nombreCliente,
      Telefono_Cliente: body.telefonoCliente,
      Metodo_Envio: body.metodoEnvio,
      Metodo_Pago: body.metodoPago,
      Referencia_Pago: body.referenciaPago,
      Total_USD: totalUSD,
      Total_Bs: totalBs,
      Estado_Pedido: 'Pendiente',
      Productos_Carrito: JSON.stringify(body.productosCarrito)
    };
    
    const order = await createOrder(newOrder);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear pedido' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, estado } = body;
    
    if (!id || !estado) {
      return NextResponse.json({ error: 'ID y estado requeridos' }, { status: 400 });
    }
    
    const order = await updateOrderStatus(id, estado);
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar pedido' }, { status: 500 });
  }
}