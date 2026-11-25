// Modelos del dominio. Reflejan lo que devuelve el backend (ver prisma/schema.prisma).
// Nota: Prisma serializa los Decimal (precio, total) como string en JSON, por eso `number | string`.

export type RolUsuario = 'ADMIN' | 'CLIENTE';
export type EstadoOrden = 'PENDIENTE' | 'PAGADA' | 'CANCELADA';

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string | null;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string | null;
  precio: number | string;
  stockDisponible: number;
  estado?: boolean;
  imagenUrl?: string | null;
  categoriaId: number;
  categoria?: Categoria;
}

// Un producto dentro del carrito
export type ItemCarrito = Producto;

export interface DetalleOrden {
  id: number;
  cantidad: number;
  precioUnitario: number | string;
  productoId: number;
  producto?: Producto;
}

export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  direccion?: string | null;
  ciudad?: string | null;
  provincia?: string | null;
  codigoPostal?: string | null;
  rol: RolUsuario;
}

export interface Orden {
  id: number;
  total: number | string;
  estado: EstadoOrden;
  fechaOrden: string;
  usuarioId: number;
  usuario?: Usuario;
  detalles?: DetalleOrden[];
}

export interface Credenciales {
  email: string;
  password: string;
}

// El backend puede devolver el JWT en cualquiera de estas dos propiedades
export interface RespuestaLogin {
  access_token?: string;
  token?: string;
}

export interface PayloadToken {
  rol?: string;
  role?: string;
}
