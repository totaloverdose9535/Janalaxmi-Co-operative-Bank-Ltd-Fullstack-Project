const modal = document.getElementById('registerModal');
const overlay = document.getElementById('overlay');


modal.addEventListener('shown.bs.modal', function() {
    overlay.style.display = 'block';
});

modal.addEventListener('hidden.bs.modal', function() {
    overlay.style.display = 'none';
});