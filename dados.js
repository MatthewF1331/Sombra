fetch('produtos.json')
  .then(response => response.json())
  .then(produtos => {
    const container = document.getElementById('produtos-container');

    produtos.forEach(produto => {
      const card = document.createElement('div');
      card.classList.add('card');

      card.innerHTML = `
        <img src="${produto.imagem}" alt="${produto.nome}">
        <div class="info">
          <h3 class="nome">${produto.nome}</h3>
          <p class="preco">${produto.preco}</p>
        </div>
      `;

      card.addEventListener('click', () => {
        localStorage.setItem('produtoSelecionado', JSON.stringify(produto));
        window.location.href = 'produto.html';
      });

      container.appendChild(card);
    });
  })
  .catch(error => {
    console.error('Erro ao carregar os produtos:', error);
  });
