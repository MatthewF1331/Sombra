<?php
//Confere se o Usuário está Logado
session_start();
if (!isset($_SESSION['admin_id'])) {
    header('Location: login.php');
    exit;
}

include 'conexao.php';  // conexão deve estar na variável $conn

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Receber dados do formulário
    $nome = $_POST['nome'] ?? '';
    $marca = $_POST['marca'] ?? '';
    $preco = $_POST['preco'] ?? 0;
    $categoria = $_POST['categoria'] ?? '';
    $colecao = $_POST['colecao'] ?? null;
    $descricao = $_POST['descricao'] ?? '';
    $quantidade = $_POST['quantidade'] ?? 0;

    // Tamanhos, cores e detalhes são arrays, converter para JSON com acentos normais
    $tamanhos = isset($_POST['tamanhos']) ? json_encode($_POST['tamanhos'], JSON_UNESCAPED_UNICODE) : json_encode([], JSON_UNESCAPED_UNICODE);
    $cores = isset($_POST['cores']) ? json_encode($_POST['cores'], JSON_UNESCAPED_UNICODE) : json_encode([], JSON_UNESCAPED_UNICODE);
    $detalhes = isset($_POST['detalhes']) ? json_encode($_POST['detalhes'], JSON_UNESCAPED_UNICODE) : json_encode([], JSON_UNESCAPED_UNICODE);

    // Upload da imagem principal
    if (isset($_FILES['imagem']) && $_FILES['imagem']['error'] === UPLOAD_ERR_OK) {
        $ext = pathinfo($_FILES['imagem']['name'], PATHINFO_EXTENSION);
        $nomeImagemPrincipal = uniqid('img_') . '.' . $ext;
        $destino = 'uploads/' . $nomeImagemPrincipal;
        if (!move_uploaded_file($_FILES['imagem']['tmp_name'], $destino)) {
            die('Erro ao fazer upload da imagem principal.');
        }
    } else {
        die('Imagem principal é obrigatória.');
    }

    // Upload das imagens secundárias (opcional)
    $imagensSecundarias = [];
    if (isset($_FILES['galeria'])) {
        foreach ($_FILES['galeria']['tmp_name'] as $key => $tmpName) {
            if ($_FILES['galeria']['error'][$key] === UPLOAD_ERR_OK) {
                $ext = pathinfo($_FILES['galeria']['name'][$key], PATHINFO_EXTENSION);
                $nomeImg = uniqid('img_sec_') . '.' . $ext;
                $destino = 'uploads/' . $nomeImg;
                if (move_uploaded_file($tmpName, $destino)) {
                    $imagensSecundarias[] = $nomeImg;
                }
            }
        }
    }
    $imagensSecundariasJson = json_encode($imagensSecundarias, JSON_UNESCAPED_UNICODE);

    // Preparar e executar inserção com MySQLi
    $stmt = $conn->prepare("INSERT INTO produtos 
        (nome, marca, preco, categoria, colecao, descricao, imagem_principal, imagens_secundarias, quantidade, tamanhos, cores, detalhes) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $stmt->bind_param(
        "ssdsssssisss",
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
        $detalhes
    );

    if ($stmt->execute()) {
        header('Location: lista.php');
        exit;
    } else {
        echo "Erro ao cadastrar produto: " . $stmt->error;
    }

} else {
    echo "Método inválido.";
}
