import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto my-10 px-4">
      
      <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">🚀 Panel de Administrador</h2>
        
        <form (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nombre del Producto</label>
            <input type="text" [(ngModel)]="newProduct.nombre" name="nombre" class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea [(ngModel)]="newProduct.descripcion" name="descripcion" class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Precio ($)</label>
              <input type="number" [(ngModel)]="newProduct.precio" name="precio" class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Stock</label>
              <input type="number" [(ngModel)]="newProduct.stock" name="stock" class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Imagen del Producto</label>
            <input type="file" (change)="onFileSelected($event)" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
          </div>

          <button type="submit" 
                  [disabled]="isLoading"
                  [class.opacity-50]="isLoading"
                  class="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex justify-center items-center gap-2">
            <span *ngIf="isLoading" class="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
            {{ isLoading ? 'Guardando...' : 'Guardar Producto' }}
          </button>
        </form>
      </div>

      <div class="mt-12 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h3 class="text-xl font-bold mb-4 text-gray-700">📦 Gestionar Productos</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-50 text-gray-600 text-sm uppercase">
              <tr>
                <th class="p-4 font-bold">Producto</th>
                <th class="p-4 font-bold text-right">Acción</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr *ngFor="let p of productosExistentes" class="hover:bg-gray-50 transition">
                <td class="p-4 font-medium text-gray-800">{{ p.nombre }}</td>
                <td class="p-4 text-right">
                  <button (click)="eliminar(p.id)" class="text-red-500 hover:text-red-700 font-bold px-3 py-1 rounded-lg hover:bg-red-50 transition border border-transparent hover:border-red-200">
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `
})
export class AdminPanelComponent implements OnDestroy{
  newProduct = { nombre: '', descripcion: '', precio: 0, stock: 0 };
  selectedFile: File | null = null;
  isLoading = false;

  constructor(private productService: ProductService) {}
  ngOnDestroy() {
    // Esto asegura que al salir de la ruta, no queden procesos colgados
    this.newProduct = { nombre: '', descripcion: '', precio: 0, stock: 0 };
    this.selectedFile = null;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (!this.selectedFile) return alert('Por favor, selecciona una imagen');
    
    this.isLoading = true; // Empieza a cargar
    const formData = new FormData();
    formData.append('nombre', this.newProduct.nombre);
    formData.append('descripcion', this.newProduct.descripcion);
    formData.append('precio', this.newProduct.precio.toString());
    formData.append('stockDisponible', this.newProduct.stock.toString());
    formData.append('categoriaId', '1'); 
    formData.append('file', this.selectedFile);

    this.productService.createProduct(formData).subscribe({
      next: () => {
        this.isLoading = false;
        this.cargarProductos(); // <--- REPETIMOS CARGA AUTOMÁTICA
        this.newProduct = { nombre: '', descripcion: '', precio: 0, stock: 0 }; // Limpiamos form
        alert('¡Producto creado con éxito!');
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
      }
    });
  }

    // Agrega esto en el AdminPanelComponent
  productosExistentes: any[] = [];

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productService.getProducts().subscribe(res => this.productosExistentes = res);
  }

  eliminar(id: number) {
    if(confirm('¿Estás seguro de que querés borrar este producto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          alert('Producto eliminado');
          this.cargarProductos(); // Refrescamos la lista
        },
        error: (err) => console.error('Error al borrar', err)
      });
    }
  }
  
}