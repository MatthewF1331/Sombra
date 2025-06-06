class SiteManager {
  constructor() {
    this.currentFilters = {
      categoria: '',
      marca: '',
      search: '',
    };
    this.currentSort = 'relevancia';
    this.produtos = [];
    this.init();
  }

  async init() {
    console.log('Inicializando SiteManager...');

    await this.loadProdutos();

    this.initMenu();
    this.initSearch();
    this.initCart();
    this.initFilters();

    this.loadPageContent();
  }

  async loadProdutos() {
    try {
      // Tentar carregar do arquivo dados.js primeiro
      const produtos = window.produtos; // Declare the produtos variable here
      if (typeof produtos !== 'undefined') {
        this.produtos = produtos;
        console.log('Produtos carregados do dados.js:', this.produtos.length);
        return;
      }

      // Fallback para produtos.json
      const response = await fetch('produtos.json');
      if (response.ok) {
        this.produtos = await response.json();
        console.log('Produtos carregados do JSON:', this.produtos.length);
      } else {
        // Produtos de fallback
        this.produtos = this.getFallbackProdutos();
        console.log('Usando produtos de fallback:', this.produtos.length);
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      this.produtos = this.getFallbackProdutos();
    }
  }

  getFallbackProdutos() {
    return [
      {
        id: 'N3XZQWPY1',
        nome: 'Camiseta Thrasher Fire - Preta',
        preco: 'R$ 199,90',
        imagem: 'assets/images/img1.jpg',
        descricao:
          'Este produto é confeccionado em algodão orgânico de alta qualidade com modelagem oversized.',
        categoria: 'camiseta',
        marca: 'thrasher',
        detalhes: [
          'Composição: 100% algodão',
          'Modelagem regular',
          'Manga curta',
        ],
      },
      {
        id: 'N3XZQWPY2',
        nome: 'Camiseta Chronic - Preta',
        preco: 'R$ 199,90',
        imagem: 'assets/images/img2.jpg',
        descricao:
          'Este produto é confeccionado em algodão orgânico de alta qualidade com modelagem oversized.',
        categoria: 'camiseta',
        marca: 'chronic',
        detalhes: [
          'Composição: 100% algodão',
          'Modelagem regular',
          'Manga curta',
        ],
      },
      {
        id: 'N3XZQWPY3',
        nome: 'Camiseta Volcom - Preta',
        preco: 'R$ 199,90',
        imagem: 'assets/images/img3.jpg',
        descricao:
          'Este produto é confeccionado em algodão orgânico de alta qualidade com modelagem oversized.',
        categoria: 'camiseta',
        marca: 'volcom',
        detalhes: [
          'Composição: 100% algodão',
          'Modelagem regular',
          'Manga curta',
        ],
      },
      {
        id: 'N3XZQWPY4',
        nome: 'Boné Thrasher - Preto',
        preco: 'R$ 159,90',
        imagem: 'assets/images/img4.jpg',
        descricao:
          'Boné confeccionado em material de alta qualidade com ajuste snapback.',
        categoria: 'bone',
        marca: 'thrasher',
        detalhes: [
          'Composição: 100% algodão',
          'Ajuste snapback',
          'Bordado frontal',
        ],
      },
      {
        id: 'N3XZQWPY5',
        nome: 'Moletom Vans - Preto',
        preco: 'R$ 299,90',
        imagem: 'assets/images/img1.jpg',
        descricao:
          'Moletom confeccionado em algodão e poliéster de alta qualidade.',
        categoria: 'moletom',
        marca: 'vans',
        detalhes: [
          'Composição: 80% algodão, 20% poliéster',
          'Modelagem regular',
          'Bolso canguru',
        ],
      },
      {
        id: 'N3XZQWPY6',
        nome: 'Calça Cargo Volcom - Preta',
        preco: 'R$ 359,90',
        imagem: 'assets/images/img2.jpg',
        descricao: 'Calça cargo confeccionada em sarja resistente.',
        categoria: 'calca',
        marca: 'volcom',
        detalhes: [
          'Composição: 100% algodão',
          'Modelagem regular',
          'Múltiplos bolsos',
        ],
      },
      {
        id: 'N3XZQWPY7',
        nome: 'Tênis Vans Old Skool - Preto',
        preco: 'R$ 399,90',
        imagem: 'assets/images/img3.jpg',
        descricao: 'O clássico tênis Vans Old Skool em couro e lona.',
        categoria: 'tenis',
        marca: 'vans',
        detalhes: [
          'Composição: Couro e lona',
          'Solado de borracha',
          'Cadarço tradicional',
        ],
      },
      {
        id: 'N3XZQWPY8',
        nome: 'Mochila Vans - Preta',
        preco: 'R$ 259,90',
        imagem: 'assets/images/img4.jpg',
        descricao: 'Mochila resistente e espaçosa, perfeita para o dia a dia.',
        categoria: 'bag',
        marca: 'vans',
        detalhes: [
          'Composição: Poliéster',
          'Capacidade: 22L',
          'Compartimento para notebook',
        ],
      },
    ];
  }

  initMenu() {
    const menuButton = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const menuOverlay = document.getElementById('menu-overlay');

    if (menuButton) {
      menuButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleMenu();
      });
    }

    if (menuClose) {
      menuClose.addEventListener('click', () => this.toggleMenu());
    }

    if (menuOverlay) {
      menuOverlay.addEventListener('click', () => this.toggleMenu());
    }

    // Inicializar categorias do menu
    const menuCategories = document.querySelectorAll('.menu-category-title');
    menuCategories.forEach((category) => {
      category.addEventListener('click', function () {
        const parent = this.parentElement;

        // Fechar outras categorias abertas
        document.querySelectorAll('.menu-category.active').forEach((item) => {
          if (item !== parent) {
            item.classList.remove('active');
          }
        });

        parent.classList.toggle('active');
      });
    });

    // Links do menu lateral
    document.querySelectorAll('.menu-category-items a').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        const categoria = link.getAttribute('data-categoria');
        const marca = link.getAttribute('data-marca');
        const colecao = link.getAttribute('data-colecao');

        if (categoria) {
          this.applyFilter('categoria', categoria);
        } else if (marca) {
          this.applyFilter('marca', marca);
        } else if (colecao) {
          this.applyFilter('colecao', colecao);
        }

        this.toggleMenu();

        // Redirecionar para catálogo se não estiver lá
        if (!window.location.pathname.includes('catalogo.html')) {
          window.location.href = 'catalogo.html';
        }
      });
    });
  }

  toggleMenu() {
    const menuDropdown = document.getElementById('menu-dropdown');
    const menuOverlay = document.getElementById('menu-overlay');

    if (menuDropdown && menuOverlay) {
      if (!menuDropdown.classList.contains('active')) {
        menuDropdown.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      } else {
        menuDropdown.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  }

  initSearch() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    if (searchForm && searchInput) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const termo = searchInput.value.trim();

        if (termo) {
          this.currentFilters.search = termo;

          if (window.location.pathname.includes('catalogo.html')) {
            this.applyFiltersAndRender();
            this.updatePageTitle(`Resultado: ${termo}`);
          } else {
            window.location.href = `catalogo.html?q=${encodeURIComponent(
              termo,
            )}`;
          }
        }
      });
    }
  }

  initCart() {
    const cartToggle = document.getElementById('cart-toggle');
    const cartModal = document.getElementById('cart-modal');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartModalClose = document.getElementById('cart-modal-close');
    const cartModalContinue = document.getElementById('cart-modal-continue');
    const cartModalCheckout = document.getElementById('cart-modal-checkout');

    if (!cartToggle || !cartModal || !cartOverlay) {
      console.error('Elementos do carrinho não encontrados');
      return;
    }

    cartToggle.addEventListener('click', (e) => {
      e.preventDefault();
      this.openCartModal();
    });

    if (cartModalClose) {
      cartModalClose.addEventListener('click', () => this.closeCartModal());
    }

    cartOverlay.addEventListener('click', () => this.closeCartModal());

    if (cartModalContinue) {
      cartModalContinue.addEventListener('click', () => this.closeCartModal());
    }

    if (cartModalCheckout) {
      cartModalCheckout.addEventListener('click', () => {
        window.location.href = 'carrinho.html';
      });
    }

    // Expor funções globalmente
    window.cartFunctions = {
      openCartModal: () => this.openCartModal(),
      closeCartModal: () => this.closeCartModal(),
      updateCartModal: () => this.updateCartModal(),
    };
  }

  openCartModal() {
    const cartModal = document.getElementById('cart-modal');
    const cartOverlay = document.getElementById('cart-overlay');

    this.updateCartModal();
    cartModal.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeCartModal() {
    const cartModal = document.getElementById('cart-modal');
    const cartOverlay = document.getElementById('cart-overlay');

    cartModal.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  updateCartModal() {
    const cartModalItems = document.getElementById('cart-modal-items');
    const cartModalTotalValue = document.getElementById(
      'cart-modal-total-value',
    );

    if (!cartModalItems || !cartModalTotalValue) {
      console.error('Elementos do modal não encontrados');
      return;
    }

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

    // Adicionar eventos aos botões
    document.querySelectorAll('.decrease-quantity').forEach((btn) => {
      btn.addEventListener('click', () => {
        const index = btn.getAttribute('data-index');
        this.decreaseQuantity(index);
      });
    });

    document.querySelectorAll('.increase-quantity').forEach((btn) => {
      btn.addEventListener('click', () => {
        const index = btn.getAttribute('data-index');
        this.increaseQuantity(index);
      });
    });

    document.querySelectorAll('.cart-modal-item-remove').forEach((btn) => {
      btn.addEventListener('click', () => {
        const index = btn.getAttribute('data-index');
        this.removeFromCart(index);
      });
    });
  }

  decreaseQuantity(index) {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    if (carrinho[index].quantidade > 1) {
      carrinho[index].quantidade--;
      localStorage.setItem('carrinho', JSON.stringify(carrinho));
      this.updateCartModal();
    }
  }

  increaseQuantity(index) {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho[index].quantidade++;
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    this.updateCartModal();
  }

  removeFromCart(index) {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    this.updateCartModal();
  }

  initFilters() {
    // Filtros do dropdown
    document.querySelectorAll('.filter-option').forEach((option) => {
      option.addEventListener('click', (e) => {
        e.preventDefault();
        const filter = option.getAttribute('data-filter');
        const value = option.getAttribute('data-value');

        this.applyFilter(filter, value);
        this.updateFilterButton(filter, option.textContent);
      });
    });

    // Ordenação
    document.querySelectorAll('.sort-option').forEach((option) => {
      option.addEventListener('click', (e) => {
        e.preventDefault();
        const sort = option.getAttribute('data-sort');

        this.currentSort = sort;
        this.applyFiltersAndRender();
        this.updateSortButton(option.textContent);
      });
    });
  }

  applyFilter(filterType, value) {
    this.currentFilters[filterType] = value;
    this.applyFiltersAndRender();
  }

  updateFilterButton(filterType, text) {
    const button = document.querySelector(
      `[data-bs-toggle="dropdown"]:has(+ .dropdown-menu .filter-option[data-filter="${filterType}"])`,
    );
    if (button) {
      const buttonText = button.childNodes[0];
      if (buttonText) {
        buttonText.textContent = text + ' ';
      }
    }
  }

  updateSortButton(text) {
    const sortButtons = document.querySelectorAll('.filter-btn');
    sortButtons.forEach((btn) => {
      if (
        btn.textContent.includes('Ordenar') ||
        btn.textContent.includes('Mais')
      ) {
        const buttonText = btn.childNodes[0];
        if (buttonText) {
          buttonText.textContent = text + ' ';
        }
      }
    });
  }

  applyFiltersAndRender() {
    let filteredProducts = [...this.produtos];

    if (this.currentFilters.categoria) {
      filteredProducts = filteredProducts.filter(
        (produto) =>
          produto.categoria &&
          produto.categoria.toLowerCase() ===
            this.currentFilters.categoria.toLowerCase(),
      );
    }

    if (this.currentFilters.marca) {
      filteredProducts = filteredProducts.filter(
        (produto) =>
          produto.marca &&
          produto.marca.toLowerCase() ===
            this.currentFilters.marca.toLowerCase(),
      );
    }

    if (this.currentFilters.search) {
      const searchTerm = this.currentFilters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (produto) =>
          produto.nome.toLowerCase().includes(searchTerm) ||
          produto.descricao.toLowerCase().includes(searchTerm) ||
          produto.categoria.toLowerCase().includes(searchTerm) ||
          produto.marca.toLowerCase().includes(searchTerm),
      );
    }

    this.sortProducts(filteredProducts);

    this.renderProducts(filteredProducts);
    this.updateProductCount(filteredProducts.length);
  }

  sortProducts(products) {
    switch (this.currentSort) {
      case 'menor-preco':
        products.sort(
          (a, b) => this.getPrice(a.preco) - this.getPrice(b.preco),
        );
        break;
      case 'maior-preco':
        products.sort(
          (a, b) => this.getPrice(b.preco) - this.getPrice(a.preco),
        );
        break;
      case 'nome':
        products.sort((a, b) => a.nome.localeCompare(b.nome));
        break;
      default:
        break;
    }
  }

  getPrice(priceString) {
    return Number.parseFloat(
      priceString.replace('R$ ', '').replace('.', '').replace(',', '.'),
    );
  }

  renderProducts(products) {
    const container =
      document.getElementById('resultados-pesquisa') ||
      document.getElementById('produtos-container');
    if (!container) return;

    container.innerHTML = '';

    if (products.length === 0) {
      container.innerHTML =
        '<p class="text-center my-5">Nenhum produto encontrado.</p>';
      return;
    }

    products.forEach((produto) => {
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
  }

  updateProductCount(count) {
    const countElement = document.getElementById('produtos-count');
    if (countElement) {
      countElement.textContent = count;
    }
  }

  updatePageTitle(title) {
    const titleElement = document.getElementById('page-title');
    if (titleElement) {
      titleElement.textContent = title;
    }
  }

  loadPageContent() {
    const currentPage = window.location.pathname;

    if (currentPage.includes('catalogo.html')) {
      this.loadCatalogPage();
    } else if (currentPage.includes('index.html') || currentPage === '/') {
      this.loadHomePage();
    }
  }

  loadCatalogPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('q');
    const categoria = urlParams.get('categoria');
    const marca = urlParams.get('marca');

    if (searchTerm) {
      this.currentFilters.search = searchTerm;
      this.updatePageTitle(`Resultado: ${searchTerm}`);

      const searchInput = document.getElementById('search-input');
      if (searchInput) {
        searchInput.value = searchTerm;
      }
    }

    if (categoria) {
      this.currentFilters.categoria = categoria;
      this.updatePageTitle(
        `Categoria: ${categoria.charAt(0).toUpperCase() + categoria.slice(1)}`,
      );
    }

    if (marca) {
      this.currentFilters.marca = marca;
      this.updatePageTitle(
        `Marca: ${marca.charAt(0).toUpperCase() + marca.slice(1)}`,
      );
    }

    this.applyFiltersAndRender();
  }

  loadHomePage() {
    const featuredProducts = this.produtos.slice(0, 4);
    this.renderProducts(featuredProducts);
  }

  addToCart(produto, quantidade = 1, tamanho = null, cor = null) {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    const produtoExistente = carrinho.find(
      (item) =>
        item.id === produto.id && item.tamanho === tamanho && item.cor === cor,
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

    this.openCartModal();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.siteManager = new SiteManager();
});

window.addToCart = (produto, quantidade, tamanho, cor) => {
  if (window.siteManager) {
    window.siteManager.addToCart(produto, quantidade, tamanho, cor);
  }
};

const currentFilters = {
  categoria: '',
  marca: '',
  search: '',
};
let allProducts = [];

async function loadProducts() {
  try {
    const produtos = window.produtos; 
    if (typeof produtos !== 'undefined') {
      allProducts = produtos;
    } else {
      const response = await fetch('produtos.json');
      if (response.ok) {
        allProducts = await response.json();
      } else {
        allProducts = [];
      }
    }
    console.log('Produtos carregados:', allProducts.length);
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    allProducts = [];
  }
}

function applyFilters() {
  let filteredProducts = [...allProducts];

  if (currentFilters.categoria) {
    filteredProducts = filteredProducts.filter(
      (produto) =>
        produto.categoria &&
        produto.categoria.toLowerCase() ===
          currentFilters.categoria.toLowerCase(),
    );
  }

  if (currentFilters.marca) {
    filteredProducts = filteredProducts.filter(
      (produto) =>
        produto.marca &&
        produto.marca.toLowerCase() === currentFilters.marca.toLowerCase(),
    );
  }

  if (currentFilters.search) {
    const searchTerm = currentFilters.search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (produto) =>
        produto.nome.toLowerCase().includes(searchTerm) ||
        produto.descricao.toLowerCase().includes(searchTerm) ||
        (produto.categoria &&
          produto.categoria.toLowerCase().includes(searchTerm)) ||
        (produto.marca && produto.marca.toLowerCase().includes(searchTerm)),
    );
  }

  renderProducts(filteredProducts);
  updateProductCount(filteredProducts.length);
}

function renderProducts(products) {
  const container =
    document.getElementById('resultados-pesquisa') ||
    document.getElementById('produtos-container');
  if (!container) return;

  container.innerHTML = '';

  if (products.length === 0) {
    container.innerHTML =
      '<p class="text-center my-5">Nenhum produto encontrado.</p>';
    return;
  }

  products.forEach((produto) => {
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
}

function updateProductCount(count) {
  const countElement = document.getElementById('produtos-count');
  if (countElement) {
    countElement.textContent = count;
  }
}

function atualizarResumoCompra(subtotal) {
  const resumoCompra = document.getElementById('resumo-compra');
  if (resumoCompra) {
    resumoCompra.textContent = `Subtotal: R$ ${subtotal
      .toFixed(2)
      .replace('.', ',')}`;
  }
}

function atualizarQuantidadeProduto(index, novaQuantidade) {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  carrinho[index].quantidade = novaQuantidade;
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  carregarProdutosCarrinho();
}

function removerProduto(index) {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  carrinho.splice(index, 1);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  carregarProdutosCarrinho();
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadProducts();

  document.querySelectorAll('.filter-option').forEach((option) => {
    option.addEventListener('click', (e) => {
      e.preventDefault();
      const filter = option.getAttribute('data-filter');
      const value = option.getAttribute('data-value');

      currentFilters[filter] = value;
      applyFilters();

      const button = option
        .closest('.dropdown')
        .querySelector('.dropdown-toggle');
      if (button) {
        const buttonText = value
          ? option.textContent
          : filter.charAt(0).toUpperCase() + filter.slice(1);
        button.childNodes[0].textContent = buttonText + ' ';
      }
    });
  });

  document.querySelectorAll('.sort-option').forEach((option) => {
    option.addEventListener('click', (e) => {
      e.preventDefault();
      const sort = option.getAttribute('data-sort');

      let filteredProducts = [...allProducts];

      if (currentFilters.categoria) {
        filteredProducts = filteredProducts.filter(
          (produto) =>
            produto.categoria &&
            produto.categoria.toLowerCase() ===
              currentFilters.categoria.toLowerCase(),
        );
      }

      if (currentFilters.marca) {
        filteredProducts = filteredProducts.filter(
          (produto) =>
            produto.marca &&
            produto.marca.toLowerCase() === currentFilters.marca.toLowerCase(),
        );
      }

      if (currentFilters.search) {
        const searchTerm = currentFilters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(
          (produto) =>
            produto.nome.toLowerCase().includes(searchTerm) ||
            produto.descricao.toLowerCase().includes(searchTerm),
        );
      }

      switch (sort) {
        case 'menor-preco':
          filteredProducts.sort((a, b) => {
            const precoA = Number.parseFloat(
              a.preco.replace('R$ ', '').replace('.', '').replace(',', '.'),
            );
            const precoB = Number.parseFloat(
              b.preco.replace('R$ ', '').replace('.', '').replace(',', '.'),
            );
            return precoA - precoB;
          });
          break;
        case 'maior-preco':
          filteredProducts.sort((a, b) => {
            const precoA = Number.parseFloat(
              a.preco.replace('R$ ', '').replace('.', '').replace(',', '.'),
            );
            const precoB = Number.parseFloat(
              b.preco.replace('R$ ', '').replace('.', '').replace(',', '.'),
            );
            return precoB - precoA;
          });
          break;
        case 'nome':
          filteredProducts.sort((a, b) => a.nome.localeCompare(b.nome));
          break;
      }

      renderProducts(filteredProducts);

      const button = option
        .closest('.dropdown')
        .querySelector('.dropdown-toggle');
      if (button) {
        button.childNodes[0].textContent = option.textContent + ' ';
      }
    });
  });


  const urlParams = new URLSearchParams(window.location.search);
  const searchTerm = urlParams.get('q');
  const categoria = urlParams.get('categoria');
  const marca = urlParams.get('marca');

  if (searchTerm) {
    currentFilters.search = searchTerm;
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.value = searchTerm;
    }
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
      pageTitle.textContent = `Resultado: ${searchTerm}`;
    }
  }

  if (categoria) {
    currentFilters.categoria = categoria;
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
      pageTitle.textContent = `Categoria: ${
        categoria.charAt(0).toUpperCase() + categoria.slice(1)
      }`;
    }
  }

  if (marca) {
    currentFilters.marca = marca;
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
      pageTitle.textContent = `Marca: ${
        marca.charAt(0).toUpperCase() + marca.slice(1)
      }`;
    }
  }

  
  applyFilters();
});


document.querySelectorAll('.menu-category-items a').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    const categoria = link.getAttribute('data-categoria');
    const marca = link.getAttribute('data-marca');
    const colecao = link.getAttribute('data-colecao');

    let url = 'catalogo.html?';

    if (categoria) {
      url += `categoria=${categoria}`;
    } else if (marca) {
      url += `marca=${marca}`;
    } else if (colecao) {
      url += `colecao=${colecao}`;
    }

    window.location.href = url;
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const mobileSearchBtn = document.getElementById('mobile-search-btn');
  const searchModal = document.getElementById('search-modal');
  const searchModalClose = document.getElementById('search-modal-close');
  const mobileSearchForm = document.getElementById('mobile-search-form');
  const mobileSearchInput = document.getElementById('mobile-search-input');

  if (mobileSearchBtn && searchModal) {
    mobileSearchBtn.addEventListener('click', () => {
      searchModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (mobileSearchInput) {
        setTimeout(() => mobileSearchInput.focus(), 100);
      }
    });
  }

  if (searchModalClose && searchModal) {
    searchModalClose.addEventListener('click', () => {
      searchModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (searchModal) {
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) {
        searchModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  if (mobileSearchForm && mobileSearchInput) {
    mobileSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const termo = mobileSearchInput.value.trim();

      if (termo) {
        searchModal.classList.remove('active');
        document.body.style.overflow = '';

        if (window.location.pathname.includes('catalogo.html')) {
          if (window.siteManager) {
            window.siteManager.currentFilters.search = termo;
            window.siteManager.applyFiltersAndRender();
            window.siteManager.updatePageTitle(`Resultado: ${termo}`);
          }
        } else {
          window.location.href = `catalogo.html?q=${encodeURIComponent(termo)}`;
        }
      }
    });
  }
});

function carregarProdutosCarrinho() {
  const produtosContainer = document.getElementById('produtos-container');
  if (!produtosContainer) return;

  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  produtosContainer.innerHTML = '';

  if (carrinho.length === 0) {
    const mensagemVazia = document.createElement('div');
    mensagemVazia.className = 'text-center my-5';
    mensagemVazia.innerHTML = '<p>Sua sacola está vazia.</p>';
    produtosContainer.appendChild(mensagemVazia);

    atualizarResumoCompra(0);
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

    const produtoItem = document.createElement('div');
    produtoItem.className = 'produto-checkout-item';
    produtoItem.innerHTML = `
      <img src="${item.imagem}" alt="${item.nome}" class="produto-checkout-img">
      <div class="produto-checkout-info">
        <h5 class="produto-checkout-nome">${item.nome}</h5>
        <p class="produto-checkout-preco">${item.preco}</p>
        <p class="produto-checkout-quantidade">Quantidade: ${
          item.quantidade
        }</p>
        ${
          item.tamanho
            ? `<p class="produto-checkout-quantidade">Tamanho: ${item.tamanho}</p>`
            : ''
        }
        ${
          item.cor
            ? `<p class="produto-checkout-quantidade">Cor: ${item.cor}</p>`
            : ''
        }
      </div>
      <div class="d-flex align-items-center gap-2">
        <input type="number" class="quantidade-input" value="${
          item.quantidade
        }" min="1" data-index="${index}" style="width: 60px; height: 35px;">
        <button class="btn btn-sm btn-outline-danger" data-index="${index}" onclick="removerProduto(${index})">
          <span class="iconify" data-icon="mdi:trash-can-outline"></span>
        </button>
      </div>
    `;
    produtosContainer.appendChild(produtoItem);
  });

  // Adicionar eventos aos inputs de quantidade
  document.querySelectorAll('.quantidade-input').forEach((input) => {
    input.addEventListener('change', function () {
      const index = this.getAttribute('data-index');
      const novaQuantidade = Number.parseInt(this.value);

      if (novaQuantidade < 1) {
        this.value = 1;
        return;
      }

      atualizarQuantidadeProduto(index, novaQuantidade);
    });
  });

  atualizarResumoCompra(subtotal);
}
