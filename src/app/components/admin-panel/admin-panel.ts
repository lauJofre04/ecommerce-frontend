import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product';
import { OrdenesService } from '../../services/ordenes'; // <-- NUEVO

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-panel.html' 
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  newProduct = { nombre: '', descripcion: '', precio: 0, stock: 0, categoriaId:0};
  selectedFile: File | null = null;
  isLoading = false;
  categorias: any[] = [];
  nuevaCategoriaNombre: string = '';
  productosExistentes: any[] = [];
  productoEnEdicionId: number | null = null; 

  // NUEVO: Variables para las órdenes
  ordenes: any[] = [];
  cargandoOrdenes: boolean = true;

  constructor(
    private productService: ProductService,
    private ordenesService: OrdenesService // <-- NUEVO
  ) {}

  ngOnInit() {
    this.cargarProductos();
    this.cargarCategorias();
    this.cargarOrdenes(); // <-- NUEVO
  }

  ngOnDestroy() {
    this.cancelarEdicion(); 
  }

  /* =========================================
     LÓGICA DE PRODUCTOS Y CATEGORÍAS (Intacta)
     ========================================= */
  cargarProductos() {
    this.productService.getProducts().subscribe(res => this.productosExistentes = res);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  cargarParaEditar(producto: any) {
    this.productoEnEdicionId = producto.id;
    this.newProduct = {
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stockDisponible,
      categoriaId: producto.categoria?.id || producto.categoriaId || 0
    };
    this.selectedFile = null; 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  }

  cancelarEdicion() {
    this.productoEnEdicionId = null;
    this.newProduct = { nombre: '', descripcion: '', precio: 0, stock: 0, categoriaId:0};
    this.selectedFile = null;
  }

  onSubmit() {
    if (!this.productoEnEdicionId && !this.selectedFile) {
      return alert('Por favor, selecciona una imagen');
    }
    
    this.isLoading = true;
    const formData = new FormData();
    formData.append('nombre', this.newProduct.nombre);
    formData.append('descripcion', this.newProduct.descripcion);
    formData.append('precio', this.newProduct.precio.toString());
    formData.append('stockDisponible', this.newProduct.stock.toString());
    formData.append('categoriaId', this.newProduct.categoriaId.toString()); 
    
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    if (this.productoEnEdicionId) {
      this.productService.updateProduct(this.productoEnEdicionId, formData).subscribe({
        next: () => {
          this.isLoading = false;
          this.cargarProductos();
          this.cancelarEdicion();
          alert('¡Producto actualizado con éxito!');
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error al actualizar:', err);
        }
      });
    } else {
      this.productService.createProduct(formData).subscribe({
        next: () => {
          this.isLoading = false;
          this.cargarProductos(); 
          this.cancelarEdicion(); 
          alert('¡Producto creado con éxito!');
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error al crear:', err);
        }
      });
    }
  }

  eliminar(id: number) {
    if(confirm('¿Estás seguro de que querés borrar este producto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          alert('Producto eliminado');
          this.cargarProductos(); 
        },
        error: (err) => console.error('Error al borrar', err)
      });
    }
  }

  cargarCategorias() {
    this.productService.getCategories().subscribe(res => {
      this.categorias = res;
    });
  }

  agregarCategoria() {
    if (!this.nuevaCategoriaNombre.trim()) return;
    this.productService.createCategory(this.nuevaCategoriaNombre).subscribe({
      next: (res) => {
        this.cargarCategorias(); 
        this.nuevaCategoriaNombre = ''; 
        alert('Categoría creada con éxito');
      },
      error: (err) => alert('Error al crear categoría. Capaz ya existe.')
    });
  }

  eliminarCategoria(id: number) {
    if (confirm('¿Estás seguro? Se borrará la categoría (aseguráte de que no tenga productos asociados)')) {
      this.productService.deleteCategory(id).subscribe(() => {
        this.cargarCategorias();
      });
    }
  }

  /* =========================================
     NUEVA LÓGICA DE ÓRDENES / VENTAS
     ========================================= */
  cargarOrdenes() {
    this.cargandoOrdenes = true;
    this.ordenesService.getAllOrdenes().subscribe({
      next: (data) => {
        this.ordenes = data;
        this.cargandoOrdenes = false;
      },
      error: (err) => {
        console.error('Error al cargar órdenes:', err);
        this.cargandoOrdenes = false;
      }
    });
  }

  cambiarEstadoOrden(ordenId: number, nuevoEstado: string) {
    if (confirm(`¿Estás seguro de cambiar el estado del pedido #${ordenId} a ${nuevoEstado}?`)) {
      this.ordenesService.cambiarEstado(ordenId, nuevoEstado).subscribe({
        next: () => {
          alert(`¡Pedido #${ordenId} actualizado a ${nuevoEstado}! El stock fue modificado.`);
          this.cargarOrdenes(); 
        },
        error: (err) => {
          console.error('Error actualizando estado:', err);
          alert('Hubo un error al intentar cambiar el estado.');
        }
      });
    }
  }
}