import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environments'; // (Ojo, los ../ dependen de dónde esté tu archivo)


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './product-list.html'
})
export class ProductList implements OnInit {
  productos: any[] = [];
  productosFiltrados: any[] = [];
  terminoBusqueda: string = '';
  categorias: any[] = [];
  categoriaSeleccionada: number | null = null;
  timestamp: number = Date.now();
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    
  ) {}
 // <-- Inyectamos el Router

  
  agregarAlCarrito(producto: any) {
    this.cartService.addToCart(producto);
    alert(`${producto.nombre} añadido al carrito 🛒`);
  }
  ngOnInit() {
    this.cargarProductos();
    this.cargarCategorias();
  }
  cargarProductos() {
    this.timestamp = Date.now(); // 2. ACTUALIZAMOS EL TIEMPO AL CARGAR
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.productos = res;
        this.productosFiltrados = [...res]; 
      },
      error: (err) => console.error('Error al cargar:', err)
    });
  }
  
  
  cargarCategorias() {
    this.productService.getCategories().subscribe({
      next: (res) => {
        this.categorias = res;
         // <-- Agregá esto para revisar la consola
      },
      error: (err) => console.error('Error cargando categorías', err)
    });
  }

    // 2. Cuando el usuario hace clic en un botón de categoría
  seleccionarCategoria(id: number | null) {
    
    this.categoriaSeleccionada = id;
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    let resultado = this.productos;

    // 1. Filtro por Categoría
    if (this.categoriaSeleccionada !== null) {
      resultado = resultado.filter(p => {
        // Forzamos que ambos lados sean números para que coincidan sí o sí
        const idProductoCat = p.categoriaId ? Number(p.categoriaId) : (p.categoria?.id ? Number(p.categoria?.id) : null);
        return idProductoCat === Number(this.categoriaSeleccionada);
      });
    }
    // En tu componente de Angular
    

    // 2. Filtro por Búsqueda (Texto)
    const termino = this.terminoBusqueda?.toLowerCase().trim();
    if (termino) {
      resultado = resultado.filter(p => 
        p.nombre?.toLowerCase().includes(termino) || 
        p.descripcion?.toLowerCase().includes(termino)
      );
    }

    this.productosFiltrados = resultado;
    
  }
  getProductImageUrl(imageName: string): string {
    if (!imageName || imageName === '') {
      // Le sacamos la barra inicial por las dudas con Vercel
      return 'assets/no-image.jpg'; 
    }

    // 3. USAMOS THIS.TIMESTAMP EN LUGAR DE DATE.NOW() DIRECTO
    return `https://ecommerce-proyecto-backend.onrender.com/uploads/${imageName}?t=${this.timestamp}`;
  }
}