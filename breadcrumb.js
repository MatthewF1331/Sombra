document.addEventListener('DOMContentLoaded', () => {
  const breadcrumb = document.getElementById('breadcrumb');
  if (!breadcrumb) return;

  const path = window.location.pathname;
  let breadcrumbText = 'Home';

  if (path.includes('catalogo.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const termoPesquisa = urlParams.get('q');

    if (termoPesquisa) {
      breadcrumbText += ' > Pesquisa > ' + termoPesquisa;
    } else {
      breadcrumbText += ' > Catálogo';
    }
  } else if (path.includes('produto.html')) {
    const produto =
      JSON.parse(localStorage.getItem('produtoSelecionado')) || {};
    breadcrumbText += ' > Catálogo > ' + (produto.nome || 'Produto');
  } else if (path.includes('carrinho.html')) {
    breadcrumbText += ' > Sacola';
  } else if (path.includes('checkout.html')) {
    breadcrumbText += ' > Sacola > Checkout';
  }

  breadcrumb.textContent = breadcrumbText;
});
