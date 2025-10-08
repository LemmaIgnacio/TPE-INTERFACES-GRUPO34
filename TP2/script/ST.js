const toggleBtn = document.getElementById('toggle-btn')
const sidebar = document.getElementById('sidebar')

function toggleSidebar(params) {
    sidebar.classList.toggle('close')
    toggleBtn.classList.toggle('rotate')
}

function toggleSubMenu(button) {
    const menu = button.nextElementSibling;
    if (!menu || !menu.classList.contains('sub-menu')) return;

    menu.classList.toggle('show');
    button.classList.toggle('rotate');
}

// Close all submenus helper
function closeAllSubMenus() {
    document.querySelectorAll('.sub-menu.show').forEach(menu => menu.classList.remove('show'));
    document.querySelectorAll('.dropdown-btn.rotate').forEach(btn => btn.classList.remove('rotate'));
}

// Close dropdowns when clicking outside any .dropdown
document.addEventListener('click', (e) => {
    // if the click is not inside a .dropdown, close all
    if (!e.target.closest('.dropdown')) {
        closeAllSubMenus();
    }
});