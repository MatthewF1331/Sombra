document.addEventListener('DOMContentLoaded', () => {
  const produtoJSON = localStorage.getItem('produtoSelecionado');

  if (!produtoJSON) {
    console.error('Nenhum produto selecionado.');
    return;
  }

  const produto = JSON.parse(produtoJSON);

  // Preenchendo os campos do HTML
  document.getElementById('nome').textContent = produto.nome;
  document.getElementById('preco').textContent = produto.preco;
  document.getElementById('descricao').textContent = produto.descricao;
  document.getElementById('imagem').src = produto.imagem;

  // Preenche o ID do produto na tag <p id="id">
  document.getElementById('id').textContent = produto.id;

  // Adiciona os detalhes do produto
  const detalhesContainer = document.getElementById('detalhes');
  produto.detalhes.forEach(detalhe => {
    const li = document.createElement('li');
    li.textContent = detalhe;
    detalhesContainer.appendChild(li);
  });
});
