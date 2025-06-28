function gerarJSON() {
  fetch('gerar_json.php')
    .then(response => response.json())
    .then(data => {
      console.log('Resposta da API:', data);
      //alert('JSON gerado com sucesso!');
    })
    .catch(error => {
      console.error('Erro ao gerar JSON:', error);
      //alert('Erro ao gerar o JSON.');
    });
}

// Você pode chamar gerarJSON() em um botão ou ao carregar a página:
document.addEventListener('DOMContentLoaded', gerarJSON);