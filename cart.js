document.addEventListener('DOMContentLoaded', () => {
  const cartToggle = document.getElementById('cart-toggle');
  const cartModal = document.getElementById('cart-modal');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartModalClose = document.getElementById('cart-modal-close');
  const cartModalContinue = document.getElementById('cart-modal-continue');
  const cartModalCheckout = document.getElementById('cart-modal-checkout');
  const cartModalItems = document.getElementById('cart-modal-items');
  const cartModalTotalValue = document.getElementById('cart-modal-total-value');

  cartToggle.addEventListener('click', (e) => {
    e.preventDefault();
    openCartModal();
  });

  cartModalClose.addEventListener('click', closeCartModal);
  cartOverlay.addEventListener('click', closeCartModal);
  cartModalContinue.addEventListener('click', closeCartModal);

  cartModalCheckout.addEventListener('click', () => {
    window.location.href = 'checkout.html';
  });

  function openCartModal() {
    updateCartModal();
    cartModal.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCartModal() {
    cartModal.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateCartModal() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    cartModalItems.innerHTML = '';

    if (carrinho.length === 0) {
      cartModalItems.innerHTML =
        '<p class="text-center">Sua sacola está vazia.</p>';
      cartModalTotalValue.textContent = 'R$ 0,00';
      return;
    }

    let subtotal = 0;

    carrinho.forEach((item, index) => {
      const precoTexto = item.preco
        .replace('R$ ', '')
        .replace('.', '')
        .replace(',', '.');
      const preco = Number.parseFloat(precoTexto);
      const total = preco * item.quantidade;
      subtotal += total;

      const itemElement = document.createElement('div');
      itemElement.className = 'cart-modal-item';
      itemElement.innerHTML = `
        <img src="${item.imagem}" alt="${item.nome}">
        <div class="cart-modal-item-info">
          <h5 class="cart-modal-item-name">${item.nome}</h5>
          <p class="cart-modal-item-price">${item.preco} ${
        item.tamanho ? `• Tam: ${item.tamanho}` : ''
      } ${item.cor ? `• Cor: ${item.cor}` : ''}</p>
          <div class="cart-modal-item-quantity">
            <button class="decrease-quantity" data-index="${index}">-</button>
            <span>${item.quantidade}</span>
            <button class="increase-quantity" data-index="${index}">+</button>
            <button class="cart-modal-item-remove" data-index="${index}">
              <span class="iconify" data-icon="mdi:trash-can-outline"></span>
            </button>
          </div>
        </div>
      `;

      cartModalItems.appendChild(itemElement);
    });

    cartModalTotalValue.textContent = `R$ ${subtotal
      .toFixed(2)
      .replace('.', ',')}`;

    document.querySelectorAll('.decrease-quantity').forEach((btn) => {
      btn.addEventListener('click', function () {
        const index = this.getAttribute('data-index');
        decreaseQuantity(index);
      });
    });

    document.querySelectorAll('.increase-quantity').forEach((btn) => {
      btn.addEventListener('click', function () {
        const index = this.getAttribute('data-index');
        increaseQuantity(index);
      });
    });

    document.querySelectorAll('.cart-modal-item-remove').forEach((btn) => {
      btn.addEventListener('click', function () {
        const index = this.getAttribute('data-index');
        removeFromCart(index);
      });
    });
  }

  function decreaseQuantity(index) {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    if (carrinho[index].quantidade > 1) {
      carrinho[index].quantidade--;
      localStorage.setItem('carrinho', JSON.stringify(carrinho));
      updateCartModal();
    }
  }

  function increaseQuantity(index) {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho[index].quantidade++;
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    updateCartModal();
  }

  function removeFromCart(index) {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    updateCartModal();
  }
});
