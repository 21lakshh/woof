 // Intersection Observer for scroll animations
 const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.report-form, .feature-card').forEach(el => {
    observer.observe(el);
});

// Form input animations
document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(input => {
    input.addEventListener('focus', () => {
        input.parentNode.querySelector('label').style.color = 'var(--primary)';
    });
    input.addEventListener('blur', () => {
        if (!input.value) {
            input.parentNode.querySelector('label').style.color = '#666';
        }
    });
});
