const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const categoryBtns = document.querySelectorAll('.category-btn');
const menuCategories = document.querySelectorAll('.menu-category');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        mobileMenu.classList.add('hidden');
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-category');

        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        menuCategories.forEach(cat => {
            if (cat.id === category) {
                cat.classList.remove('hidden');
                cat.classList.add('fade-in');
            } else {
                cat.classList.add('hidden');
            }
        });
    });
});

window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('nav-scrolled');
    } else {
        header.classList.remove('nav-scrolled');
    }
});

function toggleMenu(id) {
    const section = document.getElementById(id);
    const icon = document.getElementById(`icon-${id}`);
    section.classList.toggle('hidden');
    icon.classList.toggle('rotate-180');
}