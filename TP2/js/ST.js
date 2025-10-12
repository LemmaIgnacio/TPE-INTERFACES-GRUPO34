const toggleBtn = document.getElementById('toggle-btn')
const sidebar = document.getElementById('sidebar')
const main = document.querySelector('main')


//Sidebar toggle
    // Toggle sidebar for Desktop
    function toggleSidebar(params) {
        sidebar.classList.toggle('close')
        toggleBtn.classList.toggle('rotate')
    }

    // Toggle sidebar for Mobile
    function toggleSidebarMobil(params) {
        toggleBtn.classList.toggle('rotate')
        sidebar.classList.remove('close')
        sidebar.classList.toggle('show-sidebar-mobile')
        main.classList.toggle('less-opacity')
        
    }
    function closeSidebarMobile(params) {
        sidebar.classList.remove('show-sidebar-mobile')
        main.classList.remove('less-opacity')
        toggleBtn.classList.remove('rotate')
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


//Event listener to close submenus when clicking outside
    document.addEventListener('click', (e) => {
        // if the click is not inside a .dropdown, close all
        if (!e.target.closest('.dropdown')) {
            closeAllSubMenus();
        }

        // Close sidebar when clicking outside on mobile
        if (!e.target.closest('.show-sidebar-mobile') && !e.target.closest('#toggle-btn')) {
            closeSidebarMobile()
        } else if (sidebar.classList.contains('close')) {
            closeSidebarMobile()
        }
    });
