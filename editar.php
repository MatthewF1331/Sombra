<?php
//Confere se o Usuário está Logado
session_start();
if (!isset($_SESSION['admin_id'])) {
    header('Location: login.php');
    exit;
}

error_reporting(E_ALL);
ini_set('display_errors', 1);
include 'conexao.php';

if (!isset($_GET['id'])) {
    header('Location: lista.php');
    exit;
}

$id = intval($_GET['id']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome = $_POST['nome'] ?? '';
    $marca = $_POST['marca'] ?? '';
    $preco = floatval($_POST['preco'] ?? 0);
    $categoria = $_POST['categoria'] ?? '';
    $colecao = $_POST['colecao'] ?? '';
    $descricao = $_POST['descricao'] ?? '';
    $quantidade = intval($_POST['quantidade'] ?? 0);
    $tamanhos = isset($_POST['tamanhos']) ? json_encode($_POST['tamanhos']) : json_encode([]);
    $cores = isset($_POST['cores']) ? json_encode($_POST['cores']) : json_encode([]);

    // Detalhes vem em JSON string
    $detalhes = $_POST['detalhes'] ?? '[]';
    $detalhesArray = json_decode($detalhes, true);
    if (!is_array($detalhesArray)) {
        $detalhesArray = [];
    }
    $detalhesJson = json_encode($detalhesArray, JSON_UNESCAPED_UNICODE);

    // Buscar imagens atuais
    $res = $conn->query("SELECT imagem_principal, imagens_secundarias FROM produtos WHERE id = $id");
    if (!$res || $res->num_rows === 0) {
        die("Produto não encontrado.");
    }
    $produtoAtual = $res->fetch_assoc();

    $nomeImagemPrincipal = $produtoAtual['imagem_principal'];
    // Upload imagem principal
    if (!empty($_FILES['imagem']['name']) && $_FILES['imagem']['error'] === UPLOAD_ERR_OK) {
        if (!empty($nomeImagemPrincipal) && file_exists('uploads/' . $nomeImagemPrincipal)) {
            unlink('uploads/' . $nomeImagemPrincipal);
        }
        $ext = pathinfo($_FILES['imagem']['name'], PATHINFO_EXTENSION);
        $nomeImagemPrincipal = uniqid('img_') . '.' . $ext;
        move_uploaded_file($_FILES['imagem']['tmp_name'], 'uploads/' . $nomeImagemPrincipal);
    }

    // Imagens secundárias
    $imagensSecundarias = json_decode($produtoAtual['imagens_secundarias'], true);
    if (!is_array($imagensSecundarias)) {
        $imagensSecundarias = [];
    }

    // Upload das imagens secundárias - checar se foi enviado pelo menos um arquivo válido
    if (isset($_FILES['galeria']) && isset($_FILES['galeria']['name']) && is_array($_FILES['galeria']['name'])) {
        foreach ($_FILES['galeria']['tmp_name'] as $key => $tmpName) {
            if (!empty($tmpName) && isset($_FILES['galeria']['error'][$key]) && $_FILES['galeria']['error'][$key] === UPLOAD_ERR_OK) {
                $ext = pathinfo($_FILES['galeria']['name'][$key], PATHINFO_EXTENSION);
                $nomeImg = uniqid('img_sec_') . '.' . $ext;
                move_uploaded_file($tmpName, 'uploads/' . $nomeImg);
                $imagensSecundarias[] = $nomeImg;
            }
        }
    }
    $imagensSecundariasJson = json_encode($imagensSecundarias, JSON_UNESCAPED_UNICODE);

    $stmt = $conn->prepare("UPDATE produtos SET 
            nome=?, marca=?, preco=?, categoria=?, colecao=?, descricao=?, 
            imagem_principal=?, imagens_secundarias=?, quantidade=?, tamanhos=?, cores=?, detalhes=? 
        WHERE id=?");

    $stmt->bind_param(
        "ssdsssssisssi",
        $nome,
        $marca,
        $preco,
        $categoria,
        $colecao,
        $descricao,
        $nomeImagemPrincipal,
        $imagensSecundariasJson,
        $quantidade,
        $tamanhos,
        $cores,
        $detalhesJson,
        $id
    );

    if ($stmt->execute()) {
        header('Location: lista.php');
        exit;
    } else {
        echo "Erro ao atualizar: " . $stmt->error;
    }
}

// Buscar produto para preencher o formulário
$res = $conn->query("SELECT * FROM produtos WHERE id = $id");
if ($res->num_rows === 0) {
    die("Produto não encontrado.");
}
$produto = $res->fetch_assoc();

$tamanhos = json_decode($produto['tamanhos'], true);
if (!is_array($tamanhos)) {
    $tamanhos = [];
}

$cores = json_decode($produto['cores'], true);
if (!is_array($cores)) {
    $cores = [];
}

$imagensSecundarias = json_decode($produto['imagens_secundarias'], true);
if (!is_array($imagensSecundarias)) {
    $imagensSecundarias = [];
}

$detalhes = json_decode($produto['detalhes'], true);
if (!is_array($detalhes)) {
    $detalhes = [];
}
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
    <h2 class="mb-4">Editar Produto</h2>
    <form method="POST" enctype="multipart/form-data" class="form p-4 rounded shadow-sm">
      <div class="row mb-3">
        <div class="col-md-6">
          <label class="form-label">Nome do Produto</label>
          <input type="text" name="nome" class="form-control" value="<?= htmlspecialchars($produto['nome']) ?>" required />
        </div>
        <div class="col-md-6">
          <label class="form-label">Marca</label>
          <input type="text" name="marca" class="form-control" value="<?= htmlspecialchars($produto['marca']) ?>" required />
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-md-4">
          <label class="form-label">Preço</label>
          <input type="number" step="0.01" name="preco" class="form-control" value="<?= htmlspecialchars($produto['preco']) ?>" required />
        </div>
        <div class="col-md-4">
          <label class="form-label">Categoria</label>
          <select name="categoria" class="form-select" required>
            <?php
            $categorias = ['camiseta' => 'Camiseta', 'moletom' => 'Moletom', 'calca' => 'Calça', 'bag' => 'Bags',  'bone' => 'Bonés', 'tenis' => 'Tênis'];
            foreach ($categorias as $key => $label) {
                $selected = ($produto['categoria'] === $key) ? 'selected' : '';
                echo "<option value=\"$key\" $selected>$label</option>";
            }
            ?>
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label">Coleção</label>
          <input type="text" name="colecao" class="form-control" value="<?= htmlspecialchars($produto['colecao']) ?>" />
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Descrição</label>
        <textarea name="descricao" class="form-control" rows="3" required><?= htmlspecialchars($produto['descricao']) ?></textarea>
      </div>

      <!-- Detalhes -->
      <div class="mb-3">
        <label class="form-label">Detalhes</label>
        <div class="input-group mb-2">
          <input type="text" id="input-detalhe" class="form-control" placeholder="Adicione um detalhe" />
          <button type="button" class="btn btn-outline-secondary" id="btn-add-detalhe">Adicionar</button>
        </div>
        <ul id="lista-detalhes" class="list-group mb-2"></ul>
        <input type="hidden" name="detalhes" id="detalhes-hidden" />
      </div>

      <div class="row mb-3">
        <div class="col-md-6">
          <label class="form-label">Imagem Principal</label>
          <input type="file" name="imagem" class="form-control" />
          <?php if (!empty($produto['imagem_principal'])): ?>
            <img src="uploads/<?= htmlspecialchars($produto['imagem_principal']) ?>" alt="Imagem Principal" class="img-thumbnail mt-2" style="max-height: 150px;">
          <?php endif; ?>
        </div>
        <div class="col-md-6">
          <label class="form-label">Imagens Secundárias (opcional)</label>
          <input type="file" name="galeria[]" class="form-control" multiple />
          <div class="mt-2 d-flex flex-wrap gap-2">
            <?php foreach ($imagensSecundarias as $img): ?>
              <img src="uploads/<?= htmlspecialchars($img) ?>" alt="Imagem Secundária" class="img-thumbnail" style="max-height: 100px;" />
            <?php endforeach; ?>
          </div>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-md-4">
          <label class="form-label">Quantidade</label>
          <input type="number" name="quantidade" class="form-control" value="<?= (int)$produto['quantidade'] ?>" min="0" required />
        </div>

        <div class="col-md-4">
          <label class="form-label d-block">Tamanhos</label>
          <?php
            $todosTamanhos = ['P','M','G','XG','XXG'];
            foreach ($todosTamanhos as $t) {
                $checked = in_array($t, $tamanhos) ? 'checked' : '';
                echo "<div class='form-check form-check-inline'>";
                echo "<input class='form-check-input' type='checkbox' id='tam_$t' name='tamanhos[]' value='$t' $checked>";
                echo "<label class='form-check-label' for='tam_$t'>$t</label>";
                echo "</div>";
            }
          ?>
        </div>

        <div class="col-md-4">
          <label class="form-label d-block">Cores</label>
          <?php
            $todasCores = ['Preto','Branco','Cinza','Marrom','Azul','Vermelho'];
            foreach ($todasCores as $c) {
                $checked = in_array($c, $cores) ? 'checked' : '';
                echo "<div class='form-check form-check-inline'>";
                echo "<input class='form-check-input' type='checkbox' id='cor_$c' name='cores[]' value='$c' $checked>";
                echo "<label class='form-check-label' for='cor_$c'>$c</label>";
                echo "</div>";
            }
          ?>
        </div>
      </div>

      <button type="submit" class="btn-modelo btn-primary">Salvar</button>
      <button class="btn-primary btn-cancelar" onclick="window.location.href='lista.php'">Cancelar</button>
      
    </form>
  </div>

  <script>
    const detalhes = <?= json_encode($detalhes) ?>;
    const listaDetalhes = document.getElementById('lista-detalhes');
    const inputDetalhe = document.getElementById('input-detalhe');
    const btnAddDetalhe = document.getElementById('btn-add-detalhe');
    const detalhesHidden = document.getElementById('detalhes-hidden');

    function atualizarLista() {
      listaDetalhes.innerHTML = '';
      detalhes.forEach((det, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.textContent = det;

        const btnRemover = document.createElement('button');
        btnRemover.className = 'btn btn-sm btn-danger';
        btnRemover.textContent = 'Remover';
        btnRemover.onclick = () => {
          detalhes.splice(index, 1);
          atualizarLista();
        };
        li.appendChild(btnRemover);
        listaDetalhes.appendChild(li);
      });

      detalhesHidden.value = JSON.stringify(detalhes);
    }

    btnAddDetalhe.addEventListener('click', () => {
      const val = inputDetalhe.value.trim();
      if (val !== '') {
        detalhes.push(val);
        inputDetalhe.value = '';
        atualizarLista();
      }
    });

    atualizarLista();
  </script>
</body>
</html>
