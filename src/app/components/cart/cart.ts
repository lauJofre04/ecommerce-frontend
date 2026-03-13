import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './cart.html'
})
export class Cart implements OnInit {
  items: any[] = [];
  total = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(productos => {
      this.items = productos;
      this.calcularTotal();
    });
  }

  calcularTotal() {
    this.total = this.items.reduce((acc, item) => acc + Number(item.precio), 0);
  }

 // Cambiá tu función eliminar por esta:
eliminar(index: number) {
  this.cartService.removeFromCart(index);
}

// Y agregamos una para vaciar todo
vaciarCarrito() {
  if(confirm('¿Estás seguro de que querés vaciar el carrito?')) {
    this.cartService.clearCart();
  }
}
  
}