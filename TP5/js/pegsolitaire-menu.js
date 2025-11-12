document.addEventListener('DOMContentLoaded', function() {
    const howtoBtn = document.getElementById('pegsolitaire-howto-btn');
    const howtoModal = document.getElementById('howto-modal');

    if (howtoModal) {
        howtoModal.style.display = 'none';
        howtoBtn.addEventListener('click', function() {
        if (howtoModal.style.display === 'none') {
            howtoModal.style.display = 'block';
            howtoModal.scrollIntoView({behavior: 'smooth', block: 'center'});
        } else {
                howtoModal.style.display = 'none';
            }
        });
    }
});
