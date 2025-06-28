<?php

//Confere se o Usuário está Logado
session_start();
if (!isset($_SESSION['admin_id'])) {
    header('Location: login.php');
    exit;
}

include 'conexao.php';

$result = $conn->query("SELECT * FROM produtos ORDER BY criado_em DESC");
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<title>Lista de Produtos</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
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
<div class="container mt-5">
    <h2>Produtos Cadastrados</h2>
    <div class="d-flex justify-content-between align-items-center mb-3">
        <button class="btn-primary btn-modelo" onclick="window.location.href='formulario.php'">Cadastrar Novo Produto</button>
        <button class="btn-primary btn-cancelar" onclick="window.location.href='logout.php'">Sair</button>
        
    </div>

    <table class="table table-bordered table-striped">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Marca</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Quantidade</th>
                <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            <?php if ($result && $result->num_rows > 0): ?>
                <?php while ($produto = $result->fetch_assoc()): ?>
                <tr>
                    <td><?= $produto['id'] ?></td>
                    <td><?= htmlspecialchars($produto['nome']) ?></td>
                    <td><?= htmlspecialchars($produto['marca']) ?></td>
                    <td>R$ <?= number_format($produto['preco'], 2, ',', '.') ?></td>
                    <td><?= htmlspecialchars($produto['categoria']) ?></td>
                    <td><?= $produto['quantidade'] ?></td>
                    <td>
                        <a href="editar.php?id=<?= $produto['id'] ?>" class="btn btn-sm btn-warning">Editar</a>
                        <a href="deletar.php?id=<?= $produto['id'] ?>" class="btn btn-sm btn-danger" onclick="return confirm('Tem certeza que deseja deletar?')">Excluir</a>
                    </td>
                </tr>
                <?php endwhile; ?>
            <?php else: ?>
                <tr><td colspan="7" class="text-center">Nenhum produto cadastrado.</td></tr>
            <?php endif; ?>
        </tbody>
    </table>
</div>
</div>  
</body>
</html>
