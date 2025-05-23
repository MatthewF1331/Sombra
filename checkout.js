document.addEventListener('DOMContentLoaded', () => {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

  if (carrinho.length === 0) {
    window.location.href = 'index.html';
    return;
  }

  let subtotal = 0;

  carrinho.forEach((item) => {
    const precoTexto = item.preco
      .replace('R$ ', '')
      .replace('.', '')
      .replace(',', '.');
    const preco = Number.parseFloat(precoTexto);

    if (!isNaN(preco)) {
      subtotal += preco * item.quantidade;
    } else {
      console.error('Preço inválido:', item.preco);
    }
  });

  const frete = 20; 

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

  const btnContinuar = document.querySelector('.link-comprar');
  if (btnContinuar) {
    btnContinuar.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'index.html';
    });
  }

  const btnAvancar = document.querySelector('.btn-avancar');
  if (btnAvancar) {
    btnAvancar.addEventListener('click', (e) => {
      e.preventDefault();

      const cep = document.querySelector(
        'input[placeholder="00000-000"]',
      ).value;
      const nome = document.querySelector(
        'input[placeholder="João da Silva"]',
      ).value;
      const pagamento = document.querySelector(
        'input[name="pagamento"]:checked',
      );

      if (!cep || !nome || !pagamento) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      alert(
        'Pedido finalizado com sucesso! Em breve entraremos em contato via WhatsApp para combinar o pagamento.',
      );

      localStorage.removeItem('carrinho');

      window.location.href = 'index.html';
    });
  }
});
