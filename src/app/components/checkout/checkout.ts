import { Component, OnInit } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Importante para usar ngModel en el formulario
import { CartService } from '../../services/cart';
import { HttpClient } from '@angular/common/http';
import { OrdenesService } from '../../services/ordenes'; // Ajustá tu ruta
import { Router } from '@angular/router';
import { PaymentsService } from '../../services/payments'; // Ajustá tu ruta

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html'
})
export class Checkout implements OnInit {
  totalCarrito = 0;
  costoEnvio = 0; // Costo fijo de envío de ejemplo

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
    private router: Router,
    private paymentsService: PaymentsService
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
  /*irAPagar() {
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
}*/


  
  //Codigo para el botón "Pagar" (descomentá y ajustá según tu implementación) usando MercadoPago
  irAPagar() {
    const productosCart = this.cartService.getItems();

    if (!productosCart || productosCart.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    // 1. Mapeamos los datos al formato que espera tu Backend para crear la orden
    const detallesOrden = productosCart.map((item: any) => ({
      productoId: item.id,
      cantidad: item.cantidad || 1
    }));

    const payload = {
      detalles: detallesOrden
    };

    // 2. Creamos la orden en la base de datos (nace con estado PENDIENTE)
    this.ordenesService.crearOrden(payload).subscribe({
      next: (ordenCreada: any) => {
        
        // 👇 LA MAGIA DE MERCADO PAGO ARRANCA ACÁ 👇
        
        // 3. Preparamos el paquete para el backend de pagos
        // Necesitamos el ID de la orden que recién se guardó en Prisma
        const datosPago = {
          ordenId: ordenCreada.id, 
          items: productosCart // MP necesita los nombres y precios reales
        };

        // 4. Pedimos el link de pago (init_point)
        this.paymentsService.createPreference(datosPago).subscribe({
          next: (resPago: any) => {
            // Vaciamos el carrito local porque ya se fue a pagar
            this.cartService.clearCart(); 
            
            // 5. ¡Viajamos a la pantalla azul de Mercado Pago!
            window.location.href = resPago.init_point; 
          },
          error: (errPago) => {
            console.error('Error generando el pago en MP:', errPago);
            alert('No pudimos conectar con Mercado Pago. Intentá de nuevo.');
          }
        });

      },
      error: (err) => {
        console.error('Error al crear la orden:', err);
        alert(err.error?.message || 'Hubo un problema al procesar tu compra.');
      }
    });
  }
  
}