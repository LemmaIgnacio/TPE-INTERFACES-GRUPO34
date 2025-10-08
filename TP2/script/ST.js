const toggleBtn = document.getElementById('toggle-btn')
const sidebar = document.getElementById('sidebar')

function toggleSidebar(params) {
    sidebar.classList.toggle('close')
    toggleBtn.classList.toggle('rotate')
}


function toggleSubMenu(button) {
    const menu = button.nextElementSibling;
    
    menu.classList.toggle('show');
    button.classList.toggle('rotate');
}