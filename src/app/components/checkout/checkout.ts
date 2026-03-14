import { Component, OnInit } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Importante para usar ngModel en el formulario
import { CartService } from '../../services/cart';
import { HttpClient } from '@angular/common/http';
import { OrdenesService } from '../../services/ordenes'; // Ajustá tu ruta
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html'
})
export class Checkout implements OnInit {
  totalCarrito = 0;
  costoEnvio = 5000; // Costo fijo de envío de ejemplo

  // Objeto para guardar los datos del formulario
  datosEnvio = {
    direccion: '',
    ciudad: '',
    provincia: '',
    codigoPostal: ''
  };

  constructor(
    private cartService: CartService,
    private http: HttpClient,
    private ordenesService: OrdenesService, // INYECTAMOS ESTO
    private router: Router
  ) {}

  ngOnInit() {
    // 1. Total del carrito (lo que ya tenías)
    this.cartService.cart$.subscribe(items => {
      this.totalCarrito = items.reduce((acc, item) => acc + Number(item.precio), 0);
    });

    // 2. Autocompletado inteligente
    const userStr = localStorage.getItem('usuario');
    if (userStr) {
      const parsedData = JSON.parse(userStr);
      // Chequeamos si los datos están directo o dentro de .usuario (según tu login)
      const user = parsedData.usuario ? parsedData.usuario : parsedData;

      // Si el usuario tiene dirección en la base de datos, la precargamos
      if (user.direccion) {
        this.datosEnvio = {
          direccion: user.direccion,
          ciudad: user.ciudad || '',
          provincia: user.provincia || '',
          codigoPostal: user.codigoPostal || ''
        };
        
      }
    }
  }

  get totalFinal() {
    return this.totalCarrito + this.costoEnvio;
  }
  irAPagar() {
  const productosCart = this.cartService.getItems();

  if (!productosCart || productosCart.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }

  // 1. Armamos el paquete con el formato que espera tu Backend (CreateOrdenDto)
  const detallesOrden = productosCart.map((item: any) => ({
    productoId: item.id,
    cantidad: item.cantidad || 1
  }));

  const payload = {
    detalles: detallesOrden
  };

  // 2. Simulamos el pago exitoso llamando directo a tu servicio de Órdenes
  
  
  this.ordenesService.crearOrden(payload).subscribe({
    next: (res) => {
      
      
      // 3. Vaciamos el carrito local
      this.cartService.clearCart(); 
      
      // 4. Te mandamos a ver tu nueva orden
      alert('¡Simulación de compra exitosa! Mirá tu historial.');
      this.router.navigate(['/perfil']); 
    },
    error: (err) => {
      console.error('Error al crear la orden:', err);
      alert('Hubo un problema guardando la orden. Mirá la consola.');
    }
  });
}


  /*
  Codigo para el botón "Pagar" (descomentá y ajustá según tu implementación) usando MercadoPago
  irAPagar() {
    const productosCart = this.cartService.getItems();

    if (!productosCart || productosCart.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    // 1. Mapeamos los datos al formato que espera tu Backend
    const detallesOrden = productosCart.map((item: any) => ({
      productoId: item.id,
      cantidad: item.cantidad || 1 // Asumimos 1 si no manejas cantidades aún en el frontend
    }));

    const payload = {
      detalles: detallesOrden
    };

    // 2. Llamamos al servicio para crear la orden en la DB
    this.ordenesService.crearOrden(payload).subscribe({
      next: (res) => {
        
        
        // 3. Vaciamos el carrito (Asumiendo que tenés un método clearCart)
        this.cartService.clearCart(); 
        
        // 4. Redirigimos al perfil a la pestaña de historial
        // (Podés pasar un query param o simplemente mandarlo a /perfil)
        alert('¡Compra realizada con éxito! Serás redirigido a tu historial.');
        this.router.navigate(['/perfil']); 
      },
      error: (err) => {
        console.error('Error al crear la orden:', err);
        // Acá podrías capturar el error de stock que armaste en el backend
        alert(err.error?.message || 'Hubo un problema al procesar tu compra.');
      }
    });
  }*/
  
}