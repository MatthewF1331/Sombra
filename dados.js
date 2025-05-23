const produtos = [
  {
    id: "N3XZQWPY1",
    nome: "Camiseta Thrasher Fire - Preta",
    preco: "R$ 199,90",
    imagem: "assets/images/img1.jpg",
    descricao:
      "Este produto é confeccionado em algodão orgânico de alta qualidade com modelagem oversized. Costuras reforçadas e acabamento premium garantem conforto e durabilidade.",
    categoria: "camiseta",
    marca: "thrasher",
    detalhes: ["Composição: 100% algodão", "Modelagem regular", "Manga curta"],
  },
  {
    id: "N3XZQWPY2",
    nome: "Camiseta Chronic - Preta",
    preco: "R$ 199,90",
    imagem: "assets/images/img2.jpg",
    descricao:
      "Este produto é confeccionado em algodão orgânico de alta qualidade com modelagem oversized. Costuras reforçadas e acabamento premium garantem conforto e durabilidade.",
    categoria: "camiseta",
    marca: "chronic",
    detalhes: ["Composição: 100% algodão", "Modelagem regular", "Manga curta"],
  },
  {
    id: "N3XZQWPY3",
    nome: "Camiseta Volcom - Preta",
    preco: "R$ 199,90",
    imagem: "assets/images/img3.jpg",
    descricao:
      "Este produto é confeccionado em algodão orgânico de alta qualidade com modelagem oversized. Costuras reforçadas e acabamento premium garantem conforto e durabilidade.",
    categoria: "camiseta",
    marca: "volcom",
    detalhes: ["Composição: 100% algodão", "Modelagem regular", "Manga curta"],
  },
  {
    id: "N3XZQWPY4",
    nome: "Boné Thrasher - Preto",
    preco: "R$ 159,90",
    imagem: "assets/images/img4.jpg",
    descricao:
      "Boné confeccionado em material de alta qualidade com ajuste snapback. Bordado frontal e acabamento premium.",
    categoria: "bone",
    marca: "thrasher",
    detalhes: ["Composição: 100% algodão", "Ajuste snapback", "Bordado frontal"],
  },
]

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("produtos-container")

  if (container) {
    container.innerHTML = ""

    produtos.forEach((produto) => {
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

      container.appendChild(card)
    })
  }
})
