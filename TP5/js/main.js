"use strict";

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.getElementById('hamburgerBtn');
        if (sidebar && menuBtn) {
            menuBtn.addEventListener('click', () => {
                menuBtn.classList.toggle('active');
                sidebar.classList.toggle('expanded');
            });
        }
});