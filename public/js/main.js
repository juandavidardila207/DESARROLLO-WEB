/**
 * PC Componentes - Client-side JavaScript
 * Maneja el carrito con localStorage y las interacciones de UI
 */

// ===================== CART MANAGER =====================
const CartManager = {
  STORAGE_KEY: 'pc_componentes_cart',

  getCart() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveCart(cart) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
    this.updateBadge();
  },

  addItem(productId, quantity = 1) {
    const cart = this.getCart();
    const existing = cart.find(item => item.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ productId, quantity });
    }
    this.saveCart(cart);
    this.showToast('Producto añadido al carrito');
  },

  removeItem(productId) {
    let cart = this.getCart();
    cart = cart.filter(item => item.productId !== productId);
    this.saveCart(cart);
  },

  updateQuantity(productId, quantity) {
    const cart = this.getCart();
    const item = cart.find(item => item.productId === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
        this.saveCart(cart);
      }
    }
  },

  getItemCount() {
    return this.getCart().reduce((total, item) => total + item.quantity, 0);
  },

  clearCart() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.updateBadge();
  },

  updateBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const count = this.getItemCount();
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  },

  showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="toast-icon">✓</span> ${message}`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }
};

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', () => {
  // Actualizar badge del carrito al cargar
  CartManager.updateBadge();

  // Botones "Añadir al carrito"
  document.querySelectorAll('.btn-add-cart, .btn-add-cart-large').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productId = parseInt(btn.dataset.productId);
      if (productId) {
        CartManager.addItem(productId);
      }
    });
  });

  // Selector de cantidad en detalle de producto
  const qtyMinus = document.querySelector('.qty-minus');
  const qtyPlus = document.querySelector('.qty-plus');
  const qtyInput = document.querySelector('.quantity-input');

  if (qtyMinus && qtyPlus && qtyInput) {
    qtyMinus.addEventListener('click', () => {
      let val = parseInt(qtyInput.value) || 1;
      if (val > 1) qtyInput.value = val - 1;
    });
    qtyPlus.addEventListener('click', () => {
      let val = parseInt(qtyInput.value) || 1;
      qtyInput.value = val + 1;
    });
  }

  // Mobile menu toggle
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('show');
    });
  }
});

// Exponer CartManager globalmente para uso en inline scripts
window.CartManager = CartManager;
