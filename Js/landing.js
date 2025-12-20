// ==================== MAIN SCRIPT.JS - FULLY WORKING (December 2025) ====================

// 1. Contact Form Submission
$(document).ready(function () {
    $("#contactForm").on("submit", function (e) {
        e.preventDefault();

        // Change this URL if your endpoint is different
        const contactUrl = '/Account/Contact';

        $.ajax({
            url: contactUrl,
            type: 'POST',
            data: $(this).serialize(),
            beforeSend: () => Notiflix.Loading.pulse('Loading...'),
            success: (res) => {
                Notiflix.Loading.remove();
                if (res.success) {
                    Notiflix.Notify.success(res.msg);
                    $("#contactForm")[0].reset();
                } else {
                    Notiflix.Notify.failure(res.msg);
                }
            },
            error: () => {
                Notiflix.Loading.remove();
                Notiflix.Notify.failure('Server not responding! Please try again later.');
            }
        });
    });
});

// 2. AOS Animation
AOS.init({ duration: 1200 });

// 3. Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", () => {
    const navMenu = document.getElementById("navMenu");
    const hamburgerBtn = document.getElementById("hamburgerBtn");

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener("click", () => {
            navMenu.classList.toggle("show");
            hamburgerBtn.classList.toggle("active");
        });
    }

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768 && navMenu && hamburgerBtn) {
            navMenu.classList.remove("show");
            hamburgerBtn.classList.remove("active");
        }
    });
});

// 4. Header Scroll Effect
window.addEventListener("scroll", () => {
    const header = document.querySelector(".site-header");
    if (header) {
        header.classList.toggle("scrolled", window.scrollY > 50);
    }
});

// 5. Typewriter Effect
class TxtType {
    constructor(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.isDeleting = false;
        this.tick();
    }

    tick() {
        const i = this.loopNum % this.toRotate.length;
        const fullTxt = this.toRotate[i];

        this.txt = this.isDeleting
            ? fullTxt.substring(0, this.txt.length - 1)
            : fullTxt.substring(0, this.txt.length + 1);

        this.el.innerHTML = `<span class="wrap">${this.txt}</span>`;

        let delta = 200 - Math.random() * 100;
        if (this.isDeleting) delta /= 2;

        if (!this.isDeleting && this.txt === fullTxt) {
            delta = this.period;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.loopNum++;
            delta = 500;
        }

        setTimeout(() => this.tick(), delta);
    }
}

window.addEventListener("load", () => {
    document.querySelectorAll(".typewrite").forEach(el => {
        const toRotate = el.getAttribute("data-type");
        const period = el.getAttribute("data-period");
        if (toRotate) new TxtType(el, JSON.parse(toRotate), period);
    });

    const style = document.createElement("style");
    style.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff; }";
    document.body.appendChild(style);
});

// 6. Infinite Logo Slider (Duplicate Slides)
document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".slide-track");
    if (track) {
        Array.from(track.children).forEach(slide => {
            track.appendChild(slide.cloneNode(true));
        });
    }
});

// 7. Back to Top Button
$(document).ready(function () {
    const $btn = $("#back-top");

    $(window).scroll(() => {
        $btn.toggleClass("show", $(window).scrollTop() > 300);
    });

    $btn.on("click", e => {
        e.preventDefault();
        $("html, body").animate({ scrollTop: 0 }, 300);
    });
});

// 8. Hide Page Loader
window.addEventListener("load", () => {
    const loader = document.getElementById("pageLoader");
    if (loader) loader.style.display = "none";
});

// 9. Theme Color Picker Functions
function toggleColorPicker() {
    const picker = document.getElementById("themeColorPicker");
    if (picker) {
        picker.style.display = picker.style.display === "block" ? "none" : "block";
    }
}

function getContrastYIQ(hex) {
    hex = hex.replace("#", "").toLowerCase();
    if (hex === "ffffff" || hex === "fff") return "#000000";
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "#000000" : "#ffffff";
}

function isLightColor(hex) {
    hex = hex.replace("#", "").toLowerCase();
    if (hex === "ffffff" || hex === "fff") return true;
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 200;
}

function updateButtonTextColors(isLight) {
    const shadowColor = isLight ? "#000000" : "var(--btn-shadow)";
    const borderColor = isLight ? "#000000" : "var(--btn-color)";
    const textColor = isLight ? "#000000" : "var(--btn-color)";

    const style = document.createElement("style");
    style.id = "dynamic-btn-fix";
    style.textContent = `
        .btn-3d, .cta a, .hero-video .hero-text .button, .buy-btn, button[type="submit"] {
            color: ${textColor} !important;
        }
        .btn-3d.outline, .cta a {
            border-color: ${borderColor} !important;
            box-shadow: 0 7px 0 ${borderColor} !important;
        }
        .btn-3d:hover, .cta a:hover {
            box-shadow: 0 4px 0 ${shadowColor} !important;
            transform: translateY(3px) scale(1.04);
        }
        .btn-3d:active, .cta a:active {
            box-shadow: 0 2px 0 ${shadowColor} !important;
            transform: translateY(5px) scale(1.02);
        }
        .buy-btn, button[type="submit"] {
            border-color: ${borderColor} !important;
        }
        .buy-btn:hover, button[type="submit"]:hover {
            background-color: var(--btn-color) !important;
            color: ${textColor} !important;
        }
        .pricing-box.featured, .info-wrap {
            border-top-color: ${borderColor} !important;
        }
    `;

    const old = document.getElementById("dynamic-btn-fix");
    if (old) old.remove();
    document.head.appendChild(style);
}

// 10. Live Theme Color Change
document.getElementById("themeColorPicker")?.addEventListener("input", e => {
    const color = e.target.value.toLowerCase();
    const textColor = getContrastYIQ(color);
    const headerBg = color + "CC";

    document.documentElement.style.setProperty("--primary-color", color);
    document.documentElement.style.setProperty("--bg-color", color + "15");
    document.documentElement.style.setProperty("--section-bg", color + "10");
    document.documentElement.style.setProperty("--text-color", textColor);
    document.documentElement.style.setProperty("--section-text", textColor);
    document.documentElement.style.setProperty("--header-bg", headerBg);
    document.documentElement.style.setProperty("--header-text", textColor);
    document.documentElement.style.setProperty("--heading-color", isLightColor(color) ? "#000000" : headerBg);
    document.documentElement.style.setProperty("--footer-text-color", isLightColor(color) ? "#000000" : textColor);
    document.documentElement.style.setProperty("--btn-color", color);
    document.documentElement.style.setProperty("--btn-shadow", color);
    document.documentElement.style.setProperty("--btn-text", textColor);

    updateButtonTextColors(isLightColor(color));

    ["previewCircle", "previewSquare"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.background = color;
    });

    localStorage.setItem("dynamicColor", color);
});

// 11. Load Saved Theme on Page Load
window.addEventListener("load", () => {
    const savedColor = localStorage.getItem("dynamicColor") || "#98C69A";
    const picker = document.getElementById("themeColorPicker");
    if (picker) picker.value = savedColor;

    const textColor = getContrastYIQ(savedColor);
    const headerBg = savedColor + "CC";

    document.documentElement.style.setProperty("--primary-color", savedColor);
    document.documentElement.style.setProperty("--bg-color", savedColor + "15");
    document.documentElement.style.setProperty("--section-bg", savedColor + "10");
    document.documentElement.style.setProperty("--text-color", textColor);
    document.documentElement.style.setProperty("--section-text", textColor);
    document.documentElement.style.setProperty("--header-bg", headerBg);
    document.documentElement.style.setProperty("--header-text", textColor);
    document.documentElement.style.setProperty("--heading-color", isLightColor(savedColor) ? "#000000" : headerBg);
    document.documentElement.style.setProperty("--footer-text-color", isLightColor(savedColor) ? "#000000" : textColor);
    document.documentElement.style.setProperty("--btn-color", savedColor);
    document.documentElement.style.setProperty("--btn-shadow", savedColor);
    document.documentElement.style.setProperty("--btn-text", textColor);

    updateButtonTextColors(isLightColor(savedColor));

    ["previewCircle", "previewSquare"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.background = savedColor;
    });
});

// 12. Swiper Slider - CUBE EFFECT WORKING (Swiper 11)
const swiper = new Swiper(".mySwiper", {
    effect: "cube",
    grabCursor: true,
    cubeEffect: {
        shadow: true,
        slideShadows: true,
        shadowOffset: 20,
        shadowScale: 0.94,
    },
    loop: true,
    autoplay: {
        delay: 4000,
        disableOnInteraction: false,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
});

// 13. Razorpay Payment - Working with Event Delegation
$(document).on("click", ".buy-btn", function (e) {
    e.preventDefault();

    const $planBox = $(this).closest(".pricing-box");
    const amountUSD = $planBox.data("amount");

    if (amountUSD === 0) {
        Notiflix.Notify.success("Free plan selected!");
        return;
    }

    const amountINR = Math.round(amountUSD * 85);

    // Change these URLs if needed
    //const createOrderUrl = '/Payment/CreateOrder';
   // const verifyUrl = '/Payment/VerifyPayment';
    const createOrderUrl = '@Url.Action("CreateOrder", "Payment")';
    const verifyUrl = '@Url.Action("VerifyPayment", "Payment")';
    $.post(createOrderUrl, { amount: amountINR, currency: "INR" })
        .done(orderData => {
            if (orderData.error) {
                Notiflix.Notify.failure(orderData.error);
                return;
            }

            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Digital Sign",
                description: $planBox.find("h3").text().trim(),
                order_id: orderData.orderId,
                handler: response => {
                    $.post(verifyUrl, {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature
                    }).done(verifyData => {
                        verifyData.success
                            ? Notiflix.Notify.success(verifyData.message)
                            : Notiflix.Notify.failure(verifyData.message);
                    });
                },
                prefill: {
                    name: "Ravi Kumar Mishra",
                    email: "Ravi.tech0001@gmail.com",
                    contact: "7770931708"
                },
                theme: { color: "#3399cc" }
            };

            const rzp = new Razorpay(options);
            rzp.open();
        })
        .fail(() => Notiflix.Notify.failure("Failed to initiate payment."));
});

// 14. Sticky Nav Toggle
function toggleStickyNav() {
    const wrapper = document.getElementById("stickyNav");
    if (wrapper) {
        wrapper.classList.toggle("expanded");
        wrapper.classList.toggle("collapsed");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("toggleStickyNavBtn"); // Change ID if your button has different ID
    if (toggleBtn) {
        toggleBtn.addEventListener("click", toggleStickyNav);
    }

});
