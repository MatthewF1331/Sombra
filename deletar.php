<?php
//Confere se o Usuário está Logado
session_start();
if (!isset($_SESSION['admin_id'])) {
    header('Location: login.php');
    exit;
}

include 'conexao.php';

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);

    // Buscar imagens para apagar
    $res = $conn->query("SELECT imagem_principal, imagens_secundarias FROM produtos WHERE id = $id");
    if ($res && $res->num_rows > 0) {
        $produto = $res->fetch_assoc();

        // Apagar imagem principal
        if (!empty($produto['imagem_principal']) && file_exists('uploads/' . $produto['imagem_principal'])) {
            unlink('uploads/' . $produto['imagem_principal']);
        }

        // Apagar imagens secundárias
        $imgsSec = json_decode($produto['imagens_secundarias'], true);
        if (is_array($imgsSec)) {
            foreach ($imgsSec as $img) {
                if (!empty($img) && file_exists('uploads/' . $img)) {
                    unlink('uploads/' . $img);
                }
            }
        }
    }

    // Deletar o produto (e junto, o campo 'detalhes')
    $stmt = $conn->prepare("DELETE FROM produtos WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
}

header('Location: lista.php');
exit;
?>
