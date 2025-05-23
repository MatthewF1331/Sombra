
const ProductManager = (function() {
  
  function init() {
    if (window.location.pathname.includes("produto.html")) {
      loadProductDetails();
    }
    
    if (window.location.pathname.includes("index.html") || window.location.pathname.endsWith('/')) {
      loadFeaturedProducts();
    }
    
    console.log('ProductManager inicializado');
  }
  
 
  function loadProductDetails() {
    const produtoJSON = localStorage.getItem('produtoSelecionado');

    if (!produtoJSON) {
      console.error('Nenhum produto selecionado.');
      return;
    }

    const produto = JSON.parse(produtoJSON);

    updateProductUI(produto);
    
    setupSizeButtons();
    
    setupColorOptions();
    
    setupAddToCartButton(produto);
  }
  
  

  function updateProductUI(produto) {
    const elements = {
      nome: document.getElementById('nome'),
      preco: document.getElementById('preco'),
      descricao: document.getElementById('descricao'),
      imagem: document.getElementById('imagem'),
      id: document.getElementById('id'),
      detalhes: document.getElementById('detalhes')
    };
    
   
    if (elements.nome) elements.nome.textContent = produto.nome;
    if (elements.preco) elements.preco.textContent = produto.preco;
    if (elements.descricao) elements.descricao.textContent = produto.descricao;
    if (elements.imagem) elements.imagem.src = produto.imagem;
    if (elements.id) elements.id.textContent = produto.id;
    
    if (elements.detalhes && produto.detalhes && Array.isArray(produto.detalhes)) {
      elements.detalhes.innerHTML = '';
      produto.detalhes.forEach((detalhe) => {
        const li = document.createElement('li');
        li.textContent = detalhe;
        elements.detalhes.appendChild(li);
      });
    }
  }
  

  function setupSizeButtons() {
    document.querySelectorAll('.tamanho-btn').forEach((btn) => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.tamanho-btn').forEach((b) => {
          b.classList.remove('selecionado');
        });
      
        this.classList.add('selecionado');
      });
    });
  }
  

  function setupColorOptions() {
    document.querySelectorAll('.cor-opcao').forEach((opcao) => {
      opcao.addEventListener('click', function() {
        // Remover a classe 'selecionada' de todas as opções
        document.querySelectorAll('.cor-opcao').forEach((o) => {
          o.classList.remove('selecionada');
        });
        this.classList.add('selecionada');
      });
    });
  }
  
  
  function setupAddToCartButton(produto) {
    const btnAdicionar = document.querySelector('.btn-adicionar');
    if (btnAdicionar) {
      btnAdicionar.addEventListener('click', () => {
        const quantidade = Number.parseInt(document.querySelector('.quantidade-input').value) || 1;

        const tamanhoSelecionado = document.querySelector('.tamanho-btn.selecionado');
        const tamanho = tamanhoSelecionado ? tamanhoSelecionado.textContent : null;

        const corSelecionada = document.querySelector('.cor-opcao.selecionada');
        const cor = corSelecionada ? corSelecionada.getAttribute('data-cor') : null;

        if (typeof CartManager !== 'undefined' && CartManager.addToCart) {
          CartManager.addToCart(produto, quantidade, tamanho, cor);
        } else {
          addToCartLegacy(produto, quantidade, tamanho, cor);
        }
      });
    }
  }

  function addToCartLegacy(produto, quantidade, tamanho, cor) {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    const produtoExistente = carrinho.find(
      (item) => item.id === produto.id && item.tamanho === tamanho && item.cor === cor,
    );

    if (produtoExistente) {
      produtoExistente.quantidade += quantidade;
    } else {
      carrinho.push({
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        imagem: produto.imagem,
        quantidade: quantidade,
        tamanho: tamanho,
        cor: cor,
      });
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    const cartToggle = document.getElementById('cart-toggle');
    if (cartToggle) {
      cartToggle.click();
    } else {
      alert('Produto adicionado à sacola!');
    }
  }
  

  function loadFeaturedProducts() {
    const container = document.getElementById("produtos-container");
    if (!container) return;
    
    if (typeof produtos !== 'undefined' && Array.isArray(produtos)) {
      renderProducts(produtos, container);
    } else {
      fetch("produtos.json")
        .then(response => response.json())
        .then(data => {
          const featuredProducts = data.slice(0, 4);
          renderProducts(featuredProducts, container);
        })
        .catch(error => {
          console.error("Erro ao carregar produtos:", error);
          container.innerHTML = '<p class="text-center">Erro ao carregar produtos.</p>';
        });
    }
  }
  


  function renderProducts(produtos, container) {
    container.innerHTML = "";

    produtos.forEach((produto) => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <img src="${produto.imagem}" alt="${produto.nome}">
        <div class="info">
          <h3 class="nome">${produto.nome}</h3>
          <p class="preco">${produto.preco}</p>
        </div>
      `;

      card.addEventListener("click", () => {
        localStorage.setItem("produtoSelecionado", JSON.stringify(produto));
        window.location.href = "produto.html";
      });

      container.appendChild(card);
    });
  }

  return {
    init,
    loadProductDetails,
    loadFeaturedProducts
  };
})();

document.addEventListener("DOMContentLoaded", ProductManager.init);
