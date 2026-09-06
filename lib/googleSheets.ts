// @ts-ignore
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const auth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheetId = process.env.GOOGLE_SHEET_ID;

export async function getDoc() {
  const doc = new GoogleSpreadsheet(sheetId, auth);
  await doc.loadInfo();
  return doc;
}

// @ts-ignore
export async function getConfig() {
  const doc = await getDoc();
  const sheet = doc.sheetsByTitle['Configuracion'];
  if (!sheet) return {};
  const rows = await sheet.getRows();
  const config: Record<string, string> = {};
  rows.forEach((row: any) => {
    // google-spreadsheet v5 uses .get()
    let clave = '';
    let valor = '';
    if (typeof row.get === 'function') {
      clave = row.get('Cla') || row.get('Clave') || '';
      valor = row.get('Val') || row.get('Valor') || '';
    } else {
      clave = row.Cla || row.Clave || '';
      valor = row.Val || row.Valor || '';
    }
    if (clave) config[clave] = String(valor);
  });
  return config;
}

// @ts-ignore
export async function getProducts() {
  const doc = await getDoc();
  const sheet = doc.sheetsByTitle['Productos'];
  if (!sheet) return [];
  return await sheet.getRows();
}

// @ts-ignore
export async function getProductById(id: string) {
  const products = await getProducts();
  return products.find((p: any) => (typeof p.get === 'function' ? p.get('ID') : p.ID) === id);
}

export async function createProduct(data: any) {
  const doc = await getDoc();
  const sheet = doc.sheetsByTitle['Productos'];
  if (!sheet) throw new Error('Sheet Productos no encontrado');
  
  const rowData: Record<string, any> = {};
  for (const key of sheet.headerValues) {
    if (data[key] !== undefined) {
      rowData[key] = data[key];
    }
  }
  
  const newRow = await sheet.addRow(rowData);
  return newRow;
}

// @ts-ignore
export async function updateProduct(id: string, data: any) {
  const doc = await getDoc();
  const sheet = doc.sheetsByTitle['Productos'];
  if (!sheet) throw new Error('Sheet Productos no encontrado');
  const rows = await sheet.getRows();
  const row = rows.find((r: any) => (typeof r.get === 'function' ? r.get('ID') : r.ID) === id);
  if (!row) throw new Error('Producto no encontrado');
  
  if (typeof row.assign === 'function') {
    row.assign(data);
  } else {
    Object.assign(row, data);
  }
  
  await row.save();
  return row;
}

// @ts-ignore
export async function deleteProduct(id: string) {
  const doc = await getDoc();
  const sheet = doc.sheetsByTitle['Productos'];
  if (!sheet) throw new Error('Sheet Productos no encontrado');
  const rows = await sheet.getRows();
  const row = rows.find((r: any) => (typeof r.get === 'function' ? r.get('ID') : r.ID) === id);
  if (!row) throw new Error('Producto no encontrado');
  await row.delete();
  return true;
}

// @ts-ignore
export async function getOrders() {
  const doc = await getDoc();
  const sheet = doc.sheetsByTitle['Pedidos'];
  if (!sheet) return [];
  return await sheet.getRows();
}

// @ts-ignore
export async function createOrder(data: any) {
  const doc = await getDoc();
  const sheet = doc.sheetsByTitle['Pedidos'];
  if (!sheet) throw new Error('Sheet Pedidos no encontrado');
  const newRow = await sheet.addRow(data);
  return newRow;
}

// @ts-ignore
export async function updateOrderStatus(id: string, status: string) {
  const doc = await getDoc();
  const sheet = doc.sheetsByTitle['Pedidos'];
  if (!sheet) throw new Error('Sheet Pedidos no encontrado');
  const rows = await sheet.getRows();
  const row = rows.find((r: any) => (typeof r.get === 'function' ? r.get('ID_Pedido') : r.ID_Pedido) === id);
  if (!row) throw new Error('Pedido no encontrado');
  
  if (typeof row.assign === 'function') {
    row.assign({ Estado_Pedido: status });
  } else {
    // @ts-ignore
    row.Estado_Pedido = status;
  }
  
  await row.save();
  return row;
}

// @ts-ignore
export async function getShipping() {
  const doc = await getDoc();
  const sheet = doc.sheetsByTitle['Envios'];
  if (!sheet) return [];
  return await sheet.getRows();
}

// @ts-ignore
export async function createShipping(data: any) {
  const doc = await getDoc();
  const sheet = doc.sheetsByTitle['Envios'];
  if (!sheet) throw new Error('Sheet Envios no encontrado');
  const newRow = await sheet.addRow(data);
  return newRow;
}

// @ts-ignore
export async function updateShipping(id: string, data: any) {
  const doc = await getDoc();
  const sheet = doc.sheetsByTitle['Envios'];
  if (!sheet) throw new Error('Sheet Envios no encontrado');
  const rows = await sheet.getRows();
  const row = rows.find((r: any) => (typeof r.get === 'function' ? r.get('ID_Envio') : r.ID_Envio) === id);
  if (!row) throw new Error('Envio no encontrado');
  
  if (typeof row.assign === 'function') {
    row.assign(data);
  } else {
    Object.assign(row, data);
  }
  
  await row.save();
  return row;
}

// @ts-ignore
export async function deleteShipping(id: string) {
  const doc = await getDoc();
  const sheet = doc.sheetsByTitle['Envios'];
  if (!sheet) throw new Error('Sheet Envios no encontrado');
  const rows = await sheet.getRows();
  const row = rows.find((r: any) => (typeof r.get === 'function' ? r.get('ID_Envio') : r.ID_Envio) === id);
  if (!row) throw new Error('Envio no encontrado');
  await row.delete();
  return true;
}

// @ts-ignore
export async function getUsers() {
  const doc = await getDoc();
  const sheet = doc.sheetsByTitle['Usuarios'];
  if (!sheet) return [];
  return await sheet.getRows();
}