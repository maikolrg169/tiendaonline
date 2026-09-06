// @ts-ignore
import { NextRequest, NextResponse } from 'next/server';
import { getConfig } from '@/lib/googleSheets';

// @ts-ignore
export async function GET() {
  try {
    let config = await getConfig();
    if (!config) config = {};
    
    // Sobrescribir TasaDolar con la de DolarAPI
    try {
      const dolarRes = await fetch('https://ve.dolarapi.com/v1/dolares/oficial', {
        next: { revalidate: 3600 } // Caché por 1 hora
      });
      if (dolarRes.ok) {
        const dolarData = await dolarRes.json();
        if (dolarData && dolarData.promedio) {
          config.TasaDolar = dolarData.promedio;
        }
      }
    } catch (e) {
      console.error('Error fetching DolarAPI:', e);
      // Fallback a la hoja de Google Sheets si la API falla
    }

    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener configuración' }, { status: 500 });
  }
}

// @ts-ignore
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rows = Object.entries(body);
    
    const doc = await (await import('@/lib/googleSheets')).getDoc();
    const sheet = doc.sheetsByTitle['Configuracion'];
    
    if (!sheet) throw new Error('Sheet Configuracion no encontrado');
    
    const existingRows = await sheet.getRows();
    
    for (const [clave, valor] of rows) {
      // Handle google-spreadsheet v5 and v3/v4 compatibility
      const row = existingRows.find((r: any) => {
        if (typeof r.get === 'function') {
          return r.get('Cla') === clave || r.get('Clave') === clave;
        }
        return r.Cla === clave || r.Clave === clave;
      });

      if (row) {
        if (typeof row.assign === 'function') {
          // v5 syntax
          if (row.get('Val') !== undefined) row.assign({ Val: String(valor) });
          if (row.get('Valor') !== undefined) row.assign({ Valor: String(valor) });
        } else {
          // older versions syntax
          (row as any).Val = String(valor);
          (row as any).Valor = String(valor);
        }
        await row.save();
      } else {
        // Find if header is Cla or Clave
        const headers = sheet.headerValues;
        const newRowData: any = {};
        if (headers.includes('Cla')) newRowData.Cla = clave;
        if (headers.includes('Clave')) newRowData.Clave = clave;
        if (headers.includes('Val')) newRowData.Val = String(valor);
        if (headers.includes('Valor')) newRowData.Valor = String(valor);
        
        await sheet.addRow(newRowData);
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar configuración' }, { status: 500 });
  }
}