import { NextRequest, NextResponse } from 'next/server';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '@/lib/googleSheets';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (id) {
      const product = await getProductById(id);
      if (!product) {
        return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
      }
      const cleanProduct = typeof product.toObject === 'function' ? product.toObject() : product;
      return NextResponse.json(cleanProduct);
    }
    
    const products = await getProducts();
    const cleanProducts = products.map((row: any) => {
      const obj = typeof row.toObject === 'function' ? row.toObject() : row;
      // Normalizar nombre de alerta
      return {
        ...obj,
        Alerta_Stock: parseInt(obj['Alerta de Stock'] || obj['Alerrta de Stock'] || '5')
      };
    });
    
    const all = searchParams.get('all');
    if (all === 'true') {
      return NextResponse.json(cleanProducts);
    }
    
    const activeProducts = cleanProducts.filter((p: any) => p.Estado === 'Activo' || p.Estado === 'activo');
    return NextResponse.json(activeProducts);
  } catch (error) {
    console.error("Error API Productos:", error);
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const newProduct = {
      ID: crypto.randomUUID(),
      Nombre: body.Nombre,
      Descripcion: body.Descripcion,
      Precio_USD: parseFloat(body.Precio_USD),
      Imagen_URL: body.Imagen_URL,
      Categoria: body.Categoria,
      Stock: parseInt(body.Stock),
      Estado: body.Estado || 'Activo',
      'Alerrta de Stock': parseInt(body.Alerta_Stock) || 5,
      'Alerta de Stock': parseInt(body.Alerta_Stock) || 5,
    };
    
    const product = await createProduct(newProduct);
    const cleanProduct = typeof product.toObject === 'function' ? product.toObject() : product;
    return NextResponse.json(cleanProduct, { status: 201 });
  } catch (error) {
    console.error("Error al crear producto:", error);
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'ID de producto requerido' }, { status: 400 });
    }
    
    // Si viene Alerta_Stock, prepararlo para la hoja
    if (data.Alerta_Stock !== undefined) {
      data['Alerrta de Stock'] = data.Alerta_Stock;
      data['Alerta de Stock'] = data.Alerta_Stock;
      delete data.Alerta_Stock;
    }
    
    const product = await updateProduct(id, data);
    const cleanProduct = typeof product.toObject === 'function' ? product.toObject() : product;
    return NextResponse.json(cleanProduct);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID de producto requerido' }, { status: 400 });
    }
    
    await deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 });
  }
}