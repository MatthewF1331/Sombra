document.addEventListener('DOMContentLoaded', () => {
  atualizarCarrinho();


  const btnContinuar = document.querySelector('.catalogo');
  if (btnContinuar) {
    btnContinuar.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'index.html';
    });
  }
});

function atualizarCarrinho() {
  const carrinhoContainer =
    document.querySelector('.card-produto')?.parentElement;
  if (!carrinhoContainer) return;

  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];


  carrinhoContainer.innerHTML = '';

  const legenda = document.createElement('div');
  legenda.className =
    'card-legenda d-flex justify-content-between align-items-center mb-2 px-3';
  legenda.innerHTML = `
    <span>PRODUTO</span>
    <div class="d-flex gap-5">
      <span>QUANTIDADE</span>
      <span>TOTAL</span>
    </div>
  `;
  carrinhoContainer.appendChild(legenda);

  if (carrinho.length === 0) {
    const mensagemVazia = document.createElement('div');
    mensagemVazia.className = 'text-center my-5';
    mensagemVazia.innerHTML = '<p>Sua sacola está vazia.</p>';
    carrinhoContainer.appendChild(mensagemVazia);

    atualizarResumoCompra(0, 0);
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

    const cardProduto = document.createElement('div');
    cardProduto.className = 'card-produto';
    cardProduto.innerHTML = `
      <img src="${item.imagem}" alt="${item.nome}">
      <div class="produto-info">
        <h5>${item.nome}</h5>
        <p>Cód: ${item.id}</p>
        ${item.tamanho ? `<p>Tamanho: ${item.tamanho}</p>` : ''}
        ${item.cor ? `<p>Cor: ${item.cor}</p>` : ''}
        <p class="preco">${item.preco}</p>
      </div>
      <div class="produto-total">
        <input type="number" class="quantidade-input me-3" value="${
          item.quantidade
        }" min="1" data-index="${index}">
        <span>R$ ${total.toFixed(2).replace('.', ',')}</span>
        <span class="iconify fs-4" data-icon="mdi:trash-can-outline" style="cursor: pointer;" data-index="${index}"></span>
      </div>
    `;
    carrinhoContainer.appendChild(cardProduto);
  });

  document.querySelectorAll('.quantidade-input').forEach((input) => {
    input.addEventListener('change', function () {
      const index = this.getAttribute('data-index');
      const novaQuantidade = Number.parseInt(this.value);

      if (novaQuantidade < 1) {
        this.value = 1;
        return;
      }

      const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
      carrinho[index].quantidade = novaQuantidade;
      localStorage.setItem('carrinho', JSON.stringify(carrinho));

      atualizarCarrinho();
    });
  });

  document
    .querySelectorAll('[data-icon="mdi:trash-can-outline"]')
    .forEach((botao) => {
      botao.addEventListener('click', function () {
        const index = this.getAttribute('data-index');
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

        carrinho.splice(index, 1);
        localStorage.setItem('carrinho', JSON.stringify(carrinho));

        atualizarCarrinho();
      });
    });

  
  const frete = 20; 
  atualizarResumoCompra(subtotal, frete);
}

function atualizarResumoCompra(subtotal, frete) {
  const resumoSubtotal = document.querySelector(
    '.resumo-item:nth-child(1) span:last-child',
  );
  const resumoFrete = document.querySelector(
    '.resumo-item:nth-child(2) span:last-child',
  );
  const resumoTotal = document.querySelector('.resumo-total span:last-child');

  if (resumoSubtotal && resumoFrete && resumoTotal) {
    resumoSubtotal.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    resumoFrete.textContent = `R$ ${frete.toFixed(2).replace('.', ',')}`;
    resumoTotal.textContent = `R$ ${(subtotal + frete)
      .toFixed(2)
      .replace('.', ',')}`;
  }
}
