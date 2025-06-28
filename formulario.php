<?php
// Confere se o Usuário está Logado
session_start();
if (!isset($_SESSION['admin_id'])) {
    header('Location: login.php');
    exit;
}

include 'conexao.php';
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cadastro de Produto - Sombra Streetwear</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="style.css">
  <style>
    .navbar {
      --bs-navbar-padding-x: 0;
      --bs-navbar-padding-y: 1.7rem !important;
    }
  </style>
</head>
<body>
  
  <!-- NAVBAR -->
  <nav class="navbar navbar-expand-lg fixed-top bg-black shadow-sm">
    <div class="container-fluid justify-content-between px-4">
      
      <a href="index.html" class="navbar-brand">
        <img src="assets/images/logo_preta.png" alt="Logo Sombra" height="40" class="logo-responsive">
      </a>
      <a href="#" id="cart-toggle">
        <span class="iconify text-white fs-3" data-icon="mdi:shopping"></span>
      </a>
    </div>
  </nav>

  <div class="container" style="margin-top: 100px;">
    <h2 class="mb-4">Cadastro de Produto</h2>
    
    <form action="cadastrar.php" method="POST" enctype="multipart/form-data" class="form p-4 rounded shadow-sm">
      <div class="row mb-3">
        <div class="col-md-6">
          <label class="form-label">Nome do Produto</label>
          <input type="text" name="nome" class="form-control" required>
        </div>
        <div class="col-md-6">
          <label class="form-label">Marca</label>
          <input type="text" name="marca" class="form-control" required>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-md-4">
          <label class="form-label">Preço</label>
          <input type="number" step="0.01" name="preco" class="form-control" required>
        </div>
        <div class="col-md-4">
          <label class="form-label">Categoria</label>
          <select name="categoria" class="form-select" required>
            <option value="camiseta">Camiseta</option>
            <option value="moletom">Moletom</option>
            <option value="calca">Calça</option>
            <option value="bag">Bags</option>
            <option value="bone">Bonés</option>
            <option value="tenis">Tênis</option>
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label">Coleção</label>
          <input type="text" name="colecao" class="form-control">
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Descrição</label>
        <textarea name="descricao" class="form-control" rows="3" required></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label">Detalhes</label>
        <div class="input-group mb-2">
          <input type="text" id="input-detalhe" class="form-control" placeholder="Adicione um detalhe">
          <button type="button" class="btn btn-outline-secondary" id="btn-add-detalhe">Adicionar</button>
        </div>
        <ul id="lista-detalhes" class="list-group mb-2"></ul>
        <input type="hidden" name="detalhes" id="detalhes-hidden">
      </div>

      <div class="row mb-3">
        <div class="col-md-6">
          <label class="form-label">Imagem Principal</label>
          <input type="file" name="imagem" class="form-control" required>
        </div>
        <div class="col-md-6">
          <label class="form-label">Imagens Secundárias (opcional)</label>
          <input type="file" name="galeria[]" class="form-control" multiple>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-md-4">
          <label class="form-label">Quantidade em Estoque</label>
          <input type="number" name="quantidade" class="form-control" min="0" required>
        </div>
        <div class="col-md-4">
          <label class="form-label d-block">Tamanhos Disponíveis</label>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" name="tamanhos[]" value="P">
            <label class="form-check-label">P</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" name="tamanhos[]" value="M">
            <label class="form-check-label">M</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" name="tamanhos[]" value="G">
            <label class="form-check-label">G</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" name="tamanhos[]" value="XG">
            <label class="form-check-label">XG</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" name="tamanhos[]" value="XXG">
            <label class="form-check-label">XXG</label>
          </div>
        </div>

        <div class="col-md-4">
          <label class="form-label d-block">Cores Disponíveis</label>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" name="cores[]" value="Preto">
            <label class="form-check-label">Preto</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" name="cores[]" value="Branco">
            <label class="form-check-label">Branco</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" name="cores[]" value="Cinza">
            <label class="form-check-label">Cinza</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" name="cores[]" value="Marrom">
            <label class="form-check-label">Marrom</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" name="cores[]" value="Azul">
            <label class="form-check-label">Azul</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" name="cores[]" value="Vermelho">
            <label class="form-check-label">Vermelho</label>
          </div>
        </div>
      </div>

      <button type="submit" class="btn-modelo btn-dark">Cadastrar Produto</button>
      <button class="btn-primary btn-cancelar" onclick="window.location.href='lista.php'">Cancelar</button>
    </form>
  </div>

  <footer class="footer-container mt-5 pt-5">
    <div class="footer text-center py-3">
      <p class="text-muted">&copy; 2025 Sombra Streetwear</p>
    </div>
  </footer>

<script>
  const inputDetalhe = document.getElementById("input-detalhe");
  const btnAddDetalhe = document.getElementById("btn-add-detalhe");
  const listaDetalhes = document.getElementById("lista-detalhes");
  const detalhesHidden = document.getElementById("detalhes-hidden");

  let detalhes = [];

  function atualizarLista() {
    listaDetalhes.innerHTML = "";
    detalhes.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `
        <span>${item}</span>
        <button type="button" class="btn btn-sm btn-danger" onclick="removerDetalhe(${index})">Remover</button>
      `;
      listaDetalhes.appendChild(li);
    });
    detalhesHidden.value = JSON.stringify(detalhes);
  }

  function removerDetalhe(index) {
    detalhes.splice(index, 1);
    atualizarLista();
  }

  btnAddDetalhe.addEventListener("click", () => {
    const valor = inputDetalhe.value.trim();
    if (valor) {
      detalhes.push(valor);
      inputDetalhe.value = "";
      atualizarLista();
    }
  });

  // Garante que o array seja atualizado antes de enviar o form
  document.querySelector("form").addEventListener("submit", () => {
    detalhesHidden.value = JSON.stringify(detalhes);
  });
</script>
</body>
</html>
