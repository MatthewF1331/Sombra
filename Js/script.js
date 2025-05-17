// Impedir quantidade menor que 1
    const inputQuantidade = document.querySelector('.quantidade-input');
    inputQuantidade.addEventListener('input', () => {
        if (inputQuantidade.value < 1) {
        inputQuantidade.value = 1;
        }
    });