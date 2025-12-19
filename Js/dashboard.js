    document.addEventListener("DOMContentLoaded", function () {
        let swiperInstance = null;

    function initSwiper() {
                if (window.innerWidth > 560) {
                    if (!swiperInstance) {
        swiperInstance = new Swiper('.swiper', {
            slidesPerView: 'auto',
            spaceBetween: 30,
            centeredSlides: false,
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                type: 'bullets',
            },
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            breakpoints: {
                560: {
                    slidesPerView: 'auto',
                    spaceBetween: 20,
                    centeredSlides: false,
                },
                768: {
                    slidesPerView: 'auto',
                    spaceBetween: 30,
                    centeredSlides: false,
                }
            }
        });
                    }
                } else {
                    if (swiperInstance) {
        swiperInstance.destroy(true, true);
    swiperInstance = null;
                    }
                }
            }

    // Initialize on load
    initSwiper();

    // Reinitialize on window resize
    window.addEventListener('resize', initSwiper);
        });
