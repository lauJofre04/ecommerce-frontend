import { Injectable, signal } from '@angular/core';

export type TipoToast = 'exito' | 'error' | 'info';

export interface Toast {
  id: number;
  tipo: TipoToast;
  mensaje: string;
}

// Avisos no bloqueantes que reemplazan a window.alert()
@Injectable({ providedIn: 'root' })
export class ToastService {
  private siguienteId = 1;
  readonly toasts = signal<Toast[]>([]);

  exito(mensaje: string) { this.mostrar('exito', mensaje); }
  error(mensaje: string) { this.mostrar('error', mensaje, 5000); }
  info(mensaje: string) { this.mostrar('info', mensaje); }

  cerrar(id: number) {
    this.toasts.update((lista) => lista.filter((t) => t.id !== id));
  }

  private mostrar(tipo: TipoToast, mensaje: string, duracionMs = 3500) {
    const id = this.siguienteId++;
    this.toasts.update((lista) => [...lista, { id, tipo, mensaje }]);
    setTimeout(() => this.cerrar(id), duracionMs);
  }
}
