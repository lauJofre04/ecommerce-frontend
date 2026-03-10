import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl mx-auto p-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-8">Nuestros Productos</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div *ngFor="let p of productos" class="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
          <div class="h-48 bg-gray-200">
            <img [src]="'http://localhost:3000/uploads/' + p.imagenUrl" class="w-full h-full object-cover">
          </div>
          <div class="p-5">
            <h3 class="text-lg font-bold text-gray-800">{{ p.nombre }}</h3>
            <p class="text-gray-600 text-sm mt-2">{{ p.descripcion }}</p>
            <div class="flex justify-between items-center mt-6">
              <span class="text-2xl font-black text-blue-600">$ {{ p.precio }}</span>
              <button class="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">Añadir</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductList implements OnInit {
  productos: any[] = [];
  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (res) => this.productos = res,
      error: (err) => console.error(err)
    });
  }
}