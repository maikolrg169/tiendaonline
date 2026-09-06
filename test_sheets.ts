import { getDoc } from './lib/googleSheets';

async function test() {
  try {
    const doc = await getDoc();
    const sheet = doc.sheetsByTitle['Configuracion'];
    const headers = sheet.headerValues;
    console.log('Headers:', headers);
    
    const rows = await sheet.getRows();
    if (rows.length > 0) {
      console.log('First row keys:', Object.keys(rows[0].toObject?.() || {}));
      console.log('First row object:', rows[0].toObject?.());
      console.log('Direct properties:', { Clave: rows[0].get('Clave'), Valor: rows[0].get('Valor') });
    }
  } catch (err) {
    console.error(err);
  }
}

test();
