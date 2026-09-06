export interface Config {
  NombreTienda?: string;
  ColorPrimario?: string;
  ColorSecundario?: string;
  TasaDolar?: number;
  TelefonoContacto?: string;
  TextoNosotros?: string;
  [key: string]: string | number | undefined;
}

export interface Producto {
  ID: string;
  Nombre: string;
  Descripcion: string;
  Precio_USD: number;
  Imagen_URL: string;
  Categoria: string;
  Stock: number;
  Estado: 'Activo' | 'Oculto';
  [key: string]: unknown;
}

export interface CarritoItem {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
}

export interface Pedido {
  ID_Pedido: string;
  Fecha: string;
  Nombre_Cliente: string;
  Telefono_Cliente: string;
  Metodo_Envio: string;
  Metodo_Pago: string;
  Referencia_Pago: string;
  Total_USD: number;
  Total_Bs: number;
  Estado_Pedido: 'Pendiente' | 'Pagado' | 'Enviado';
  Productos_Carrito: string;
}

export interface Envio {
  ID_Envio: string;
  Nombre_Empresa: string;
  Tarifa_USD: number;
  Estado: 'Activo' | 'Inactivo';
}