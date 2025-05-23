function toggleMenu() {
  const menuDropdown = document.getElementById("menu-dropdown")
  const menuOverlay = document.getElementById("menu-overlay")

  if (menuDropdown && menuOverlay) {
    if (!menuDropdown.classList.contains("active")) {
      menuDropdown.style.display = "block"
      menuOverlay.classList.add("active")

      setTimeout(() => {
        menuDropdown.classList.add("active")
        document.body.style.overflow = "hidden" 
      }, 10)
    } else {
      menuDropdown.classList.remove("active")
      menuOverlay.classList.remove("active")

      setTimeout(() => {
        menuDropdown.style.display = "none"
        document.body.style.overflow = "" // Restaurar scroll
      }, 300)
    }
  }
}

function pesquisarProdutos(termo) {
  if (!termo) return []

  const termoPesquisa = termo.toLowerCase()

  return fetch("produtos.json")
    .then((response) => response.json())
    .then((produtos) => {
      return produtos.filter(
        (produto) =>
          produto.nome.toLowerCase().includes(termoPesquisa) || produto.descricao.toLowerCase().includes(termoPesquisa),
      )
    })
}

function exibirResultadosPesquisa(resultados) {
  const container = document.getElementById("resultados-pesquisa")
  if (!container) return

  container.innerHTML = ""

  if (resultados.length === 0) {
    container.innerHTML = '<p class="text-center my-5">Nenhum produto encontrado.</p>'
    return
  }

  const cardsWrapper = document.createElement("div")
  cardsWrapper.className = "cards-wrapper"

  resultados.forEach((produto) => {
    const card = document.createElement("div")
    card.classList.add("card")

    card.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}">
      <div class="info">
        <h3 class="nome">${produto.nome}</h3>
        <p class="preco">${produto.preco}</p>
      </div>
    `

    card.addEventListener("click", () => {
      localStorage.setItem("produtoSelecionado", JSON.stringify(produto))
      window.location.href = "produto.html"
    })

    cardsWrapper.appendChild(card)
  })

  container.appendChild(cardsWrapper)
}

function filtrarPorCategoria(categoria) {
  return fetch("produtos.json")
    .then((response) => response.json())
    .then((produtos) => {
      if (!categoria || categoria === "todos") return produtos

      return produtos.filter(
        (produto) => produto.categoria && produto.categoria.toLowerCase() === categoria.toLowerCase(),
      )
    })
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM carregado, inicializando script.js")

  const menuButton = document.getElementById("menu-toggle")
  const menuClose = document.getElementById("menu-close")
  const menuOverlay = document.getElementById("menu-overlay")

  if (menuButton) {
    menuButton.addEventListener("click", (e) => {
      e.preventDefault()
      toggleMenu()
    })
  } else {
    console.error("Botão de menu não encontrado")
  }

  if (menuClose) {
    menuClose.addEventListener("click", toggleMenu)
  }

  if (menuOverlay) {
    menuOverlay.addEventListener("click", toggleMenu)
  }

  const menuCategories = document.querySelectorAll(".menu-category-title")
  menuCategories.forEach((category) => {
    category.addEventListener("click", function () {
      const parent = this.parentElement

      // Fechar outras categorias abertas
      document.querySelectorAll(".menu-category.active").forEach((item) => {
        if (item !== parent) {
          item.classList.remove("active")
        }
      })

      parent.classList.toggle("active")
    })
  })

  // Fechar o menu dropdown ao redimensionar a janela
  window.addEventListener("resize", () => {
    const menuDropdown = document.getElementById("menu-dropdown")
    const menuOverlay = document.getElementById("menu-overlay")
    if (menuDropdown && menuDropdown.classList.contains("active")) {
      menuDropdown.classList.remove("active")
      if (menuOverlay) menuOverlay.classList.remove("active")

      setTimeout(() => {
        menuDropdown.style.display = "none"
        document.body.style.overflow = ""
      }, 300)
    }
  })

  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get("openCart") === "true") {
    setTimeout(() => {
      const cartToggle = document.getElementById("cart-toggle")
      if (cartToggle) {
        cartToggle.click()
      }
    }, 500)
  }

  const searchForm = document.getElementById("search-form")
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const searchInput = document.getElementById("search-input")
      if (searchInput) {
        const termo = searchInput.value.trim()
        if (termo) {
          pesquisarProdutos(termo).then((resultados) => {
            localStorage.setItem("resultadosPesquisa", JSON.stringify(resultados))
            window.location.href = "catalogo.html?q=" + encodeURIComponent(termo)
          })
        }
      }
    })
  }

  const filtros = document.querySelectorAll(".dropdown-item[data-categoria]")
  filtros.forEach((filtro) => {
    filtro.addEventListener("click", function (e) {
      e.preventDefault()
      const categoria = this.getAttribute("data-categoria")
      filtrarPorCategoria(categoria).then((resultados) => {
        exibirResultadosPesquisa(resultados)
        const contador = document.querySelector(".produtos-encontrados")
        if (contador) {
          contador.textContent = `${resultados.length} produtos encontrados`
        }
      })
    })
  })

  if (window.location.pathname.includes("catalogo.html")) {
    const urlParams = new URLSearchParams(window.location.search)
    const termoPesquisa = urlParams.get("q")

    if (termoPesquisa) {
      const tituloPesquisa = document.querySelector("h2")
      if (tituloPesquisa) {
        tituloPesquisa.textContent = `Resultado: ${termoPesquisa}`
      }

      const resultadosArmazenados = localStorage.getItem("resultadosPesquisa")
      if (resultadosArmazenados) {
        exibirResultadosPesquisa(JSON.parse(resultadosArmazenados))
      } else {
        pesquisarProdutos(termoPesquisa).then((resultados) => {
          exibirResultadosPesquisa(resultados)
        })
      }
    } else {
      filtrarPorCategoria("todos").then((resultados) => {
        exibirResultadosPesquisa(resultados)
      })
    }
  }

  document.querySelectorAll(".menu-category-items a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.stopPropagation()

      const menuDropdown = document.getElementById("menu-dropdown")
      const menuOverlay = document.getElementById("menu-overlay")

      if (menuDropdown && menuOverlay) {
        menuDropdown.classList.remove("active")
        menuOverlay.classList.remove("active")

        setTimeout(() => {
          menuDropdown.style.display = "none"
          document.body.style.overflow = ""
        }, 300)
      }
    })
  })
})
