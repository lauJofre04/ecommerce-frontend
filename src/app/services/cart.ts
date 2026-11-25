import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ItemCarrito } from '../interfaces/models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: ItemCarrito[] = [];
  private _cart = new BehaviorSubject<ItemCarrito[]>([]);
  
  // Observable para que el Navbar y otros componentes "escuchen" cambios
  cart$ = this._cart.asObservable();

  constructor() {
    this.loadCart(); // Cargamos apenas arranca la app
  }

  addToCart(product: ItemCarrito) {
    this.cartItems.push(product);
    this._cart.next(this.cartItems);
    this.saveToLocalStorage();
  }

  getCartCount() {
    return this.cartItems.length;
  }
  // En cart.service.ts
  getItems() {
    // Asumiendo que guardás tus productos en una variable llamada 'items'
    // o que podés obtenerlos del valor actual de tu BehaviorSubject
    return this._cart.getValue(); // O simplemente return this.cartItems; si ya es un array de productos
  }
  private saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

   loadCart() {
    const saved = localStorage.getItem('cart');
    if (saved) {
      this.cartItems = JSON.parse(saved);
      this._cart.next(this.cartItems);
    }
  }

  removeFromCart(index: number) {
    this.cartItems.splice(index, 1); // Borra 1 elemento en esa posición
    this._cart.next(this.cartItems);
    this.saveToLocalStorage();
  }
  clearCart() {
    // Antes solo se vaciaba el observable y cartItems conservaba los productos viejos:
    // el siguiente addToCart los volvía a emitir.
    this.cartItems = [];
    this._cart.next([]); // Vaciamos el observable
    localStorage.removeItem('cart'); // Limpiamos la memoria del navegador
  }
}