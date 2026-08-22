// src/lib/confirmModal.ts
// Modal de confirmación reutilizable que reemplaza las alertas nativas (confirm).
// Crea dinámicamente el modal en el DOM y retorna una Promise<boolean>.

interface ConfirmModalOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
  /** Centra los botones horizontalmente en lugar de alinearlos a la derecha. */
  centerActions?: boolean;
}

let modalElement: HTMLElement | null = null;
let resolvePromise: ((value: boolean) => void) | null = null;

/**
 * Muestra un modal de confirmación y retorna una Promise que resuelve
 * true si el usuario aceptó, false si canceló o cerró.
 */
export async function showConfirmModal(options: ConfirmModalOptions = {}): Promise<boolean> {
  if (!modalElement) {
    modalElement = createModal();
    document.body.appendChild(modalElement);
  }

  // Actualizar contenido
  if (options.title) {
    const titleEl = modalElement.querySelector<HTMLElement>('#confirm-modal-title');
    if (titleEl) titleEl.textContent = options.title;
  }
  if (options.message) {
    const msgEl = modalElement.querySelector<HTMLElement>('#confirm-modal-message');
    if (msgEl) msgEl.textContent = options.message;
  }
  if (options.confirmText) {
    const confirmBtn = modalElement.querySelector<HTMLElement>('[data-confirm-modal-confirm]');
    if (confirmBtn) confirmBtn.textContent = options.confirmText;
  }
  if (options.cancelText) {
    const cancelBtn = modalElement.querySelector<HTMLElement>('[data-confirm-modal-cancel]');
    if (cancelBtn) cancelBtn.textContent = options.cancelText;
  }
  if (options.confirmVariant) {
    const confirmBtn = modalElement.querySelector<HTMLElement>('[data-confirm-modal-confirm]');
    if (confirmBtn) {
      confirmBtn.className = `confirm-modal__btn confirm-modal__btn--confirm confirm-modal__btn--${options.confirmVariant}`;
    }
  }

  // Centrar acciones horizontalmente cuando se solicita
  const actionsEl = modalElement.querySelector<HTMLElement>('.confirm-modal__actions');
  if (actionsEl) {
    actionsEl.classList.toggle('confirm-modal__actions--center', !!options.centerActions);
  }

  return new Promise<boolean>((resolve) => {
    resolvePromise = resolve;
    modalElement!.hidden = false;
    document.body.style.overflow = 'hidden';

    // Focus trap: enfocar el botón de cancelar por defecto
    const cancelBtn = modalElement!.querySelector<HTMLButtonElement>('[data-confirm-modal-cancel]');
    setTimeout(() => cancelBtn?.focus(), 50);
  });
}

function hideModal(result: boolean): void {
  if (modalElement) {
    modalElement.hidden = true;
    document.body.style.overflow = '';
  }
  resolvePromise?.(result);
  resolvePromise = null;
}

function createModal(): HTMLElement {
  const div = document.createElement('div');
  div.id = 'confirm-modal';
  div.className = 'confirm-modal';
  div.setAttribute('role', 'dialog');
  div.setAttribute('aria-modal', 'true');
  div.setAttribute('aria-labelledby', 'confirm-modal-title');
  div.setAttribute('aria-describedby', 'confirm-modal-message');
  div.hidden = true;

  div.innerHTML = `
    <div class="confirm-modal__backdrop" data-confirm-modal-backdrop></div>
    <div class="confirm-modal__container">
      <div class="confirm-modal__content">
        <h2 class="confirm-modal__title" id="confirm-modal-title">¿Estás seguro?</h2>
        <p class="confirm-modal__message" id="confirm-modal-message"></p>
      </div>
      <div class="confirm-modal__actions">
        <button type="button" class="confirm-modal__btn confirm-modal__btn--cancel" data-confirm-modal-cancel>
          Cancelar
        </button>
        <button type="button" class="confirm-modal__btn confirm-modal__btn--confirm confirm-modal__btn--danger" data-confirm-modal-confirm>
          Aceptar
        </button>
      </div>
    </div>
  `;

  // Inyectar estilos si no existen
  if (!document.getElementById('confirm-modal-styles')) {
    const style = document.createElement('style');
    style.id = 'confirm-modal-styles';
    style.textContent = `
      .confirm-modal {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
      }
      .confirm-modal[hidden] { display: none; }
      .confirm-modal__backdrop {
        position: fixed;
        inset: 0;
        background-color: rgba(13, 22, 17, 0.7);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        animation: confirm-modal-fade-in 0.2s ease;
      }
      .confirm-modal__container {
        position: relative;
        z-index: 1;
        width: 100%;
        max-width: 28rem;
        background-color: var(--theme-surface, #ffffff);
        border: 1px solid var(--theme-border, #e2e4e5);
        border-radius: 1.25rem;
        box-shadow: 0 8px 24px rgba(36, 38, 39, 0.12);
        animation: confirm-modal-slide-in 0.2s ease;
      }
      .confirm-modal__content { padding: 1.5rem 1.5rem 1rem; }
      .confirm-modal__title {
        margin: 0 0 0.75rem;
        font-family: var(--font-heading, 'Archivo', sans-serif);
        font-size: 1.125rem;
        font-weight: 700;
        color: var(--theme-text, #242627);
        line-height: 1.3;
      }
      .confirm-modal__message {
        margin: 0;
        font-size: 1rem;
        color: var(--theme-text-muted, #6b7072);
        line-height: 1.6;
      }
      .confirm-modal__actions {
        display: flex;
        gap: 0.75rem;
        padding: 1rem 1.5rem 1.5rem;
        justify-content: flex-end;
      }
      .confirm-modal__actions--center {
        justify-content: center;
      }
      .confirm-modal__btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.75rem 1.5rem;
        font-family: var(--font-heading, 'Archivo', sans-serif);
        font-size: 0.875rem;
        font-weight: 700;
        border-radius: 999px;
        cursor: pointer;
        transition: all 0.15s ease;
        border: 1px solid transparent;
      }
      .confirm-modal__btn:focus-visible {
        outline: 2px solid #308f40;
        outline-offset: 2px;
      }
      .confirm-modal__btn--cancel {
        background-color: transparent;
        color: var(--theme-text, #242627);
        border-color: var(--theme-border, #e2e4e5);
      }
      .confirm-modal__btn--cancel:hover { background-color: var(--theme-bg-alt, #f5f5f5); }
      .confirm-modal__btn--confirm {
        background-color: #c0392b;
        color: #ffffff;
      }
      .confirm-modal__btn--confirm:hover { background-color: #a93226; }
      .confirm-modal__btn--primary {
        background-color: #308f40;
        color: #ffffff;
      }
      .confirm-modal__btn--primary:hover { background-color: #226f31; }
      @keyframes confirm-modal-fade-in { from { opacity: 0; } to { opacity: 1; } }
      @keyframes confirm-modal-slide-in {
        from { opacity: 0; transform: translateY(-8px) scale(0.98); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      @media (max-width: 479.98px) {
        .confirm-modal__actions { flex-direction: column-reverse; }
        .confirm-modal__btn { width: 100%; }
      }
    `;
    document.head.appendChild(style);
  }

  // Event listeners
  const backdrop = div.querySelector<HTMLElement>('[data-confirm-modal-backdrop]');
  const confirmBtn = div.querySelector<HTMLButtonElement>('[data-confirm-modal-confirm]');
  const cancelBtn = div.querySelector<HTMLButtonElement>('[data-confirm-modal-cancel]');

  confirmBtn?.addEventListener('click', () => hideModal(true));
  cancelBtn?.addEventListener('click', () => hideModal(false));
  backdrop?.addEventListener('click', () => hideModal(false));

  // Teclado: Escape para cerrar
  div.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      hideModal(false);
    }
  });

  return div;
}
