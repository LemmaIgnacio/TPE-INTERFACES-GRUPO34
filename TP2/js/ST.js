const toggleBtn = document.getElementById('toggle-btn')
const sidebar = document.getElementById('sidebar')
const main = document.querySelector('main')


//Sidebar toggle
    // Toggle sidebar for Desktop
    function toggleSidebar(params) {
        sidebar.classList.toggle('close')
        toggleBtn.classList.toggle('rotate')
    }
    function closeSidebar(params) {
        sidebar.classList.add('close')
        toggleBtn.classList.remove('rotate')
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

        // Close sidebar when clicking outside on Mobile
            //Si el sidebar esta abierto y hago click fuera del sidebar y fuera del boton
            if (!e.target.closest('.show-sidebar-mobile') && !e.target.closest('#toggle-btn')) { 
                closeSidebarMobile()
            }
            //Si el sidebar esta cerrado y hago click en el sidebar 
            else if (sidebar.classList.contains('close')) { 
                closeSidebarMobile()
            }

        // Close sidebar when clicking outside on Desktop
            //Si hago click fuera del sidebar y fuera del boton
            if (!e.target.closest('#sidebar') && !e.target.closest('#toggle-btn')) {
                closeSidebar()
            }
            //Arreglar bug que no rota el boton si se abre el sidebar haciendo click en el boton y luego haciendo click en el sidebar 
            else if (!sidebar.classList.contains('close') && !toggleBtn.classList.contains('rotate')) { 
                toggleBtn.classList.add('rotate')
            } 
    });
