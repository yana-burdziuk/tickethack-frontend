document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('header-container');
    if (container) {
      fetch('./header.html')
        .then(res => res.text())
        .then(html => {
          container.innerHTML = html;
        })
        .catch(err => console.error('Error loading header:', err));
    }
});