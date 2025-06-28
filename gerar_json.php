<?php
// Arquivo: gerar_json.php

header('Content-Type: application/json');

$host = 'localhost';
$db   = 'sistema_produtos';
$user = 'root';        // Substitua conforme seu ambiente
$pass = '';            // Substitua conforme seu ambiente

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro de conexão com o banco de dados']);
    exit;
}

$sql = "SELECT id, nome, preco, imagem_principal, descricao, categoria, marca, detalhes FROM produtos";
$result = $conn->query($sql);

$produtos = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Se o campo "detalhes" estiver como JSON no banco, decodifica
        if (isset($row['detalhes'])) {
            $detalhes = json_decode($row['detalhes'], true);
            $row['detalhes'] = is_array($detalhes) ? $detalhes : [$row['detalhes']];
        }

        // Formata o preço com vírgula
        if (isset($row['preco'])) {
            $row['preco'] = str_replace('.', ',', $row['preco']);
        }

        // Adiciona a rota completa ao campo imagem_principal
        if (!empty($row['imagem_principal'])) {
            $row['imagem_principal'] = 'uploads/' . $row['imagem_principal'];
        }

        $produtos[] = $row;
    }

    // Salva os produtos em um arquivo JSON físico
    file_put_contents('produtos.json', json_encode($produtos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
} else {
    echo json_encode(['mensagem' => 'Nenhum produto encontrado.']);
}

$conn->close();
?>
