// Script específico para a página de catálogo
document.addEventListener("DOMContentLoaded", () => {
  console.log("Catálogo carregado")

  // Aguardar o SiteManager estar pronto
  setTimeout(() => {
    if (window.siteManager) {
      // Aplicar filtros da URL se existirem
      const urlParams = new URLSearchParams(window.location.search)

      // Verificar se há filtros específicos na URL
      const categoria = urlParams.get("categoria")
      const marca = urlParams.get("marca")
      const colecao = urlParams.get("colecao")

      if (categoria) {
        window.siteManager.applyFilter("categoria", categoria)
      }

      if (marca) {
        window.siteManager.applyFilter("marca", marca)
      }

      if (colecao) {
        window.siteManager.applyFilter("colecao", colecao)
      }
    }
  }, 100)
})
