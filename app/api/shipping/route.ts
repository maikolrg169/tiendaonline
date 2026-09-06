import { NextRequest, NextResponse } from 'next/server';
import { getShipping, createShipping, updateShipping, deleteShipping } from '@/lib/googleSheets';

export async function GET() {
  try {
    const shipments = await getShipping();
    const activeShipments = shipments.filter((s: any) => s.Estado === 'Activo' || s.Estado === 'activo');
    return NextResponse.json(activeShipments);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener envíos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const newShipment = {
      ID_Envio: crypto.randomUUID(),
      Nombre_Empresa: body.Nombre_Empresa,
      Tarifa_USD: parseFloat(body.Tarifa_USD),
      Estado: body.Estado || 'Activo'
    };
    
    const shipment = await createShipping(newShipment);
    return NextResponse.json(shipment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear envío' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'ID de envío requerido' }, { status: 400 });
    }
    
    const shipment = await updateShipping(id, data);
    return NextResponse.json(shipment);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar envío' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID de envío requerido' }, { status: 400 });
    }
    
    await deleteShipping(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar envío' }, { status: 500 });
  }
}