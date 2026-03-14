import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart'; // <-- Ajustá esta ruta
// Asegurate de importar tu servicio de productos
// import { ProductsService } from '../../services/products.service'; 

@Component({
  selector: 'app-producto-detalle',
  standalone: true, // Si usas standalone
  imports: [CommonModule],
  templateUrl: './producto-detalle.html'
})
export class ProductoDetalle implements OnInit {
  producto: any = null;
  cargando: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService // 
  ) {}

  ngOnInit() {
    // Escuchamos la URL para atrapar el ID
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.cargarProducto(Number(id));
      }
    });
  }

  cargarProducto(id: number) {
    // Acá llamamos a tu backend usando el servicio que ya tenés
    
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.producto = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar el producto', err);
        this.cargando = false;
      }
    });
  }

  // ... tu código anterior

  obtenerImagen(imagen: string): string {
    if (!imagen) return 'https://picsum.photos/600'; // Si no hay foto, muestra la de relleno
    
    if (imagen.startsWith('http')) return imagen; // Si ya es un link completo, lo deja igual
    
    // Si es solo el nombre del archivo, le pegamos la URL de tu backend
    // ATENCIÓN: Cambiá '/uploads/' por el nombre de la carpeta donde tu backend guarda las fotos
    return `https://ecommerce-proyecto-backend.onrender.com/uploads/${imagen}`; 
  }

  agregarAlCarrito() {
    if (this.producto) {
      // 1. Le mandamos el producto entero a tu servicio
      this.cartService.addToCart(this.producto);
      
      // 2. Le damos un aviso visual al usuario
      alert('¡Producto agregado al carrito! 🛒');
      
      // Opcional: Si querés que lo lleve directo al carrito después de agregar, descomentá esto:
      // this.router.navigate(['/carrito']); 
    }
  }

  volver() {
    this.router.navigate(['/']); // Vuelve al catálogo
  }
}
