import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart';
import { CommonModule } from '@angular/common'; // Asegúrate de esto
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html'
})
export class Navbar implements OnInit {
  cartCount = 0;
  isMenuOpen= false;
  constructor(
    private cartService: CartService,
    public authService: AuthService // <-- Lo inyectamos como 'public' para usarlo en el HTML
  ) {
    this.cartService.cart$.subscribe(items => {
      this.cartCount = items.length;
    });
  }
  // Función para abrir/cerrar el menú
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isMenuOpen = false; // Cerramos el menú al salir
    // this.router.navigate(['/login']); // Opcional: mandarlo al login
  }
  ngOnInit() {
    this.cartService.cart$.subscribe(items => {
      this.cartCount = items.length;
    });
  }
}