// menu.js
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navBar = document.querySelector('.nav-bar');

    if(menuToggle && navBar){
        menuToggle.addEventListener('click', () => {
            navBar.classList.toggle('show');
        });
    }
});
