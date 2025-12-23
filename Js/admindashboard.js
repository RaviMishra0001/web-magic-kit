
const counters = document.querySelectorAll('.counter');
const speed = 97; // Lower = faster

const startCounting = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;

            const increment = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(() => startCounting([{ target: counter, isIntersecting: true }], observer), 20);
            } else {
                counter.innerText = target.toLocaleString(); // Adds comma for thousands
            }
        }
    });
};

const observer = new IntersectionObserver(startCounting, {
    threshold: 0.7 // Start when 70% of card is visible
});

counters.forEach(counter => {
    observer.observe(counter);
});
