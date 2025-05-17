// Breadcrumb automático
    const breadcrumb = document.getElementById("breadcrumb");
    const path = ["Página Inicial", "Camisas", "Camisa Pollo"];
    breadcrumb.textContent = path.join(" / ");