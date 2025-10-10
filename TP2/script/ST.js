const toggleBtn = document.getElementById('toggle-btn')
const sidebar = document.getElementById('sidebar')


//Sidebar toggle
function toggleSidebar(params) {
    sidebar.classList.toggle('close')
    toggleBtn.classList.toggle('rotate')
}

function toggleSidebarMobil(params) {
    toggleBtn.classList.toggle('rotate')
    sidebar.classList.remove('close')
    sidebar.classList.toggle('show-sidebar-mobile')
    
}
function closeSidebarMobile(params) {
    sidebar.classList.remove('show-sidebar-mobile')
    
}


//Dropdown toggle
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
        if (!e.target.closest('.show-sidebar-mobile') && !e.target.closest('#toggle-btn')) {
            closeSidebarMobile()
        }
    });