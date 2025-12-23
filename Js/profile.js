document.querySelectorAll('.user-info-menu').forEach(menu => {
    const trigger = menu.querySelector('.trigger');
    const arrow = menu.querySelector('.fa-arrow-left');
    const flyouts = menu.querySelectorAll('.flyout');

    menu.addEventListener('click', () => {
        trigger.classList.toggle('hidden');
        arrow.classList.toggle('hidden');
        flyouts.forEach(flyout => flyout.classList.toggle('flyout-out'));
    });
});
