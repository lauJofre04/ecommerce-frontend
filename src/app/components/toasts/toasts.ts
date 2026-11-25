import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-toasts',
  standalone: true,
  template: `
    <div class="fixed right-4 top-20 z-[100] flex w-[min(92vw,22rem)] flex-col gap-3" aria-live="polite">
      @for (t of toast.toasts(); track t.id) {
        <div
          role="status"
          class="anim-entrada flex items-start gap-3 rounded-xl border bg-white p-4 shadow-xl"
          [class.border-emerald-300]="t.tipo === 'exito'"
          [class.border-red-300]="t.tipo === 'error'"
          [class.border-slate-200]="t.tipo === 'info'"
        >
          <span
            class="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
            [class.bg-emerald-500]="t.tipo === 'exito'"
            [class.bg-red-500]="t.tipo === 'error'"
            [class.bg-blue-500]="t.tipo === 'info'"
          ></span>
          <p class="flex-1 text-sm font-medium text-slate-800">{{ t.mensaje }}</p>
          <button type="button" (click)="toast.cerrar(t.id)" class="text-slate-400 transition hover:text-slate-700" aria-label="Cerrar aviso">✕</button>
        </div>
      }
    </div>
  `
})
export class Toasts {
  protected readonly toast = inject(ToastService);
}
