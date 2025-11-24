// menu.js

// espera todo o conteúdo da página carregar antes de rodar o script
document.addEventListener('DOMContentLoaded', () => {

    // seleciona o botão que abre/fecha o menu (ícone hambúrguer)
    const menuToggle = document.querySelector('.menu-toggle');

    // seleciona a barra de navegação que será mostrada/escondida
    const navBar = document.querySelector('.nav-bar');

    // garante que ambos os elementos existem antes de adicionar eventos
    if(menuToggle && navBar){

        // Quando o botão for clicado...
        menuToggle.addEventListener('click', () => {

            // alterna a classe "show" no menu.
            // se a classe existir  remove (fecha o menu)
            // se não existir  adiciona (abre o menu)
            navBar.classList.toggle('show');
        });
    }
});


