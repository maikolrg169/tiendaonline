import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { createProduct } from './lib/googleSheets';

async function test() {
  try {
    const data = {
      ID: 'test-123',
      Nombre: 'Test Product',
      Stock: 10,
      Precio_USD: 10.5
    };
    const res = await createProduct(data);
    console.log("Created successfully!");
  } catch (err) {
    console.error("Error creating product:", err);
  }
}
test();
