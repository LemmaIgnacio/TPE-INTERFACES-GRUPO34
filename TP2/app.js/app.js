const topbar = document.getElementById('topbar');
const sidebar = document.getElementById('sidebar');

const dropdownContent = document.getElementById('dropdownContent');
const dropdownBtn = document.getElementById('dropdownBtn');

// Toggle dropdown menu visibility
    dropdownBtn?.addEventListener('click', () => {
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    });

// Close the dropdown if the user clicks outside of it
    window.addEventListener('click', (event) => {
        if (event.target !== dropdownBtn && !event.target.closest('.dropdown')) {
            if (dropdownContent) {
                dropdownContent.style.display = 'none';
            }
        }
    });


