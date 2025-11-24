// menu.js

// Espera todo o conteúdo da página carregar antes de rodar o script
document.addEventListener('DOMContentLoaded', () => {

    // Seleciona o botão que abre/fecha o menu (ícone hambúrguer)
    const menuToggle = document.querySelector('.menu-toggle');

    // Seleciona a barra de navegação que será mostrada/escondida
    const navBar = document.querySelector('.nav-bar');

    // Garante que ambos os elementos existem antes de adicionar eventos
    if(menuToggle && navBar){

        // Quando o botão for clicado...
        menuToggle.addEventListener('click', () => {

            // Alterna a classe "show" no menu.
            // Se a classe existir → remove (fecha o menu)
            // Se não existir → adiciona (abre o menu)
            navBar.classList.toggle('show');
        });
    }
});

