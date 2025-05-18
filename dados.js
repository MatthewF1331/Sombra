fetch('produtos.json') //Tem que executar com o LIVE SERVER porque o navegador bloqueia o Fetch()
  .then(response => response.json())
  .then(produtos => {
    const container = document.getElementById('produtos-container');

    produtos.forEach(produto => {
      const card = document.createElement('div');
      card.classList.add('card');

      card.innerHTML = `
        <a href="${produto.link}">
          <img src="${produto.imagem}" alt="${produto.nome}">
          <div class="info">
            <h3 class="nome">${produto.nome}</h3>
            <p class="preco">${produto.preco}</p>
          </div>
        </a>
      `;

      container.appendChild(card);
    });
  })
  .catch(error => {
    console.error('Erro ao carregar os produtos:', error);
  });
